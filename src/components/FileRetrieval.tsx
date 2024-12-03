import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, ExternalLink, Lock, FileDown, Eye, EyeOff, QrCode } from 'lucide-react';
import { decryptFile } from '@/lib/encryption';
import { useToast } from '@/hooks/use-toast';

export function FileRetrieval() {
  const [cid, setCid] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [password, setPassword] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const { toast } = useToast();

  // Extract CID from URL if present (for QR code scans)
  const handleUrlInput = (value: string) => {
    setCid(value);
    if (value.includes('ipfs/')) {
      const cidFromUrl = value.split('ipfs/').pop();
      if (cidFromUrl) {
        setCid(cidFromUrl);
        handleRetrieve(cidFromUrl);
      }
    }
  };

  const handleRetrieve = (cidToUse = cid) => {
    if (!cidToUse.trim()) {
      toast({
        title: "Invalid CID",
        description: "Please enter a valid IPFS CID or URL",
        variant: "destructive"
      });
      return;
    }
    const url = `https://gateway.pinata.cloud/ipfs/${cidToUse.trim()}`;
    setFileUrl(url);
  };

  const handleDecrypt = async () => {
    if (!fileUrl || !password) {
      toast({
        title: "Missing Information",
        description: "Please ensure you have entered both CID and password",
        variant: "destructive"
      });
      return;
    }

    setIsDecrypting(true);

    try {
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const encryptedFile = await response.blob();
      const fileName = fileUrl.split('/').pop() || 'encrypted-file';
      const file = new File([encryptedFile], fileName.endsWith('.encrypted') ? fileName : `${fileName}.encrypted`);
      
      const decryptedFile = await decryptFile(file, password);
      
      // Create and trigger download
      const downloadUrl = URL.createObjectURL(decryptedFile);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = decryptedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Success!",
        description: "File decrypted and downloaded successfully.",
      });
    } catch (error) {
      console.error('Decryption failed:', error);
      
      let errorMessage = "Failed to decrypt the file. ";
      if (error instanceof Error && error.message.includes('HTTP error')) {
        errorMessage = "Failed to retrieve the file from IPFS. Please check your CID.";
      } else {
        errorMessage += "Please check your password and ensure the file is encrypted.";
      }
      
      toast({
        title: "Decryption Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary mb-4">
          <QrCode className="h-5 w-5" />
          <h3 className="font-semibold">Access IPFS Document</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cid">IPFS CID or Gateway URL</Label>
            <div className="flex gap-2">
              <Input
                id="cid"
                placeholder="Enter IPFS CID or paste gateway URL"
                value={cid}
                onChange={(e) => handleUrlInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => handleRetrieve()}
                disabled={!cid.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                Retrieve
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Paste a CID, gateway URL, or scan a QR code to access your document
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="encrypted">File is encrypted</Label>
            </div>
            <Switch
              id="encrypted"
              checked={isEncrypted}
              onCheckedChange={setIsEncrypted}
            />
          </div>

          {isEncrypted && (
            <div className="space-y-2">
              <Label htmlFor="decrypt-password">Decryption Password</Label>
              <div className="relative">
                <Input
                  id="decrypt-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your decryption password"
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
            </div>
          )}
        </div>

        {fileUrl && (
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="font-medium mb-2">File URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background p-2 rounded text-sm break-all">
                  {fileUrl}
                </code>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {isEncrypted ? (
              <Button 
                onClick={handleDecrypt} 
                className="w-full"
                disabled={!password || isDecrypting}
              >
                <FileDown className="h-4 w-4 mr-2" />
                {isDecrypting ? 'Decrypting...' : 'Decrypt & Download'}
              </Button>
            ) : (
              <div className="aspect-video bg-background rounded-lg overflow-hidden">
                <img
                  src={fileUrl}
                  alt="Retrieved file"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}