import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, File, Lock, Eye, EyeOff } from 'lucide-react';
import { uploadToPinata } from '@/lib/pinata';
import { encryptFile } from '@/lib/encryption';
import { useToast } from '@/hooks/use-toast';
import { QRCodeDisplay } from './QRCodeDisplay';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useEncryption, setUseEncryption] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    
    if (useEncryption && !password) {
      toast({
        title: "Password Required",
        description: "Please enter a password for file encryption.",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      let fileToUpload = file;
      
      if (useEncryption) {
        setProgress(10);
        fileToUpload = await encryptFile(file, password);
        setProgress(30);
      }

      // Simulate progress for the upload
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const ipfsHash = await uploadToPinata(fileToUpload);
      setCid(ipfsHash);
      
      clearInterval(interval);
      setProgress(100);

      toast({
        title: "Success!",
        description: useEncryption 
          ? "File encrypted and uploaded successfully. Keep your password safe!"
          : "File uploaded successfully to IPFS.",
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-lg">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag & drop a file here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                Support for documents, images, and other files
              </p>
            </div>
          )}
        </div>

        {file && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 p-4 bg-secondary rounded-lg">
              <File className="h-5 w-5" />
              <span className="font-medium">{file.name}</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="encryption">Enable Encryption</Label>
                </div>
                <Switch
                  id="encryption"
                  checked={useEncryption}
                  onCheckedChange={setUseEncryption}
                />
              </div>

              {useEncryption && (
                <div className="space-y-2">
                  <Label htmlFor="password">Encryption Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Store this password safely. You'll need it to decrypt the file.
                  </p>
                </div>
              )}
            </div>
            
            {uploading ? (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {useEncryption ? 'Encrypting and uploading...' : 'Uploading...'} {progress}%
                </p>
              </div>
            ) : (
              <Button onClick={handleUpload} className="w-full">
                {useEncryption ? 'Encrypt & Upload' : 'Upload to IPFS'}
              </Button>
            )}
          </div>
        )}
      </Card>

      {cid && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">File Details</h3>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="font-medium mb-2">IPFS CID:</p>
                <code className="block w-full bg-background p-2 rounded text-sm break-all">
                  {cid}
                </code>
                <p className="mt-4 text-sm text-muted-foreground">
                  {useEncryption 
                    ? "Your file is encrypted and available on IPFS. You'll need your password to decrypt it."
                    : "Your file is now available on IPFS. Use the QR code below to share it easily."}
                </p>
              </div>
            </div>
          </Card>

          <QRCodeDisplay cid={cid} isEncrypted={useEncryption} />
        </div>
      )}
    </div>
  );
}