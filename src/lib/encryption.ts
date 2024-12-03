export async function generateKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("secure-salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFile(file: File, password: string): Promise<File> {
  const key = await generateKey(password);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const fileData = await file.arrayBuffer();

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    fileData
  );

  // Combine IV and encrypted data
  const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
  combinedData.set(iv);
  combinedData.set(new Uint8Array(encryptedData), iv.length);

  return new File([combinedData], `${file.name}.encrypted`, { type: "application/encrypted" });
}

export async function decryptFile(encryptedFile: File, password: string): Promise<File> {
  try {
    const key = await generateKey(password);
    const fileData = await encryptedFile.arrayBuffer();
    
    if (fileData.byteLength < 12) {
      throw new Error('Invalid encrypted file format');
    }
    
    // Extract IV and encrypted data
    const iv = new Uint8Array(fileData.slice(0, 12));
    const encryptedData = fileData.slice(12);

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );

    const originalName = encryptedFile.name.replace('.encrypted', '');
    return new File([decryptedData], originalName);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt file. Please check your password.');
  }
}