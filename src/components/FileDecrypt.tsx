import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Lock, Eye, EyeOff, FileDown, Search } from 'lucide-react';
import { decryptFile } from '@/lib/encryption';
import { useToast } from '@/hooks/use-toast';

export function FileDecrypt() {
  const [cid, setCid] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleRetrieve = () => {
    if (!cid.trim()) {
      toast({
        title: "Invalid CID",
        description: "Please enter a valid IPFS CID",
        variant: "destructive"
      });
      return;
    }
    const url = `https://gateway.pinata.cloud/ipfs/${cid.trim()}`;
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
    setProgress(10);

    try {
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setProgress(30);
      const encryptedFile = await response.blob();
      const fileName = fileUrl.split('/').pop() || 'encrypted-file';
      const file = new File([encryptedFile], fileName);
      
      setProgress(50);
      const decryptedFile = await decryptFile(file, password);
      setProgress(80);
      
      // Create and trigger download
      const downloadUrl = URL.createObjectURL(decryptedFile);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = decryptedFile.name.replace('.encrypted', '');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setProgress(100);
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
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary mb-4">
          <Lock className="h-5 w-5" />
          <h3 className="font-semibold">Decrypt IPFS Document</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cid">IPFS CID</Label>
            <div className="flex gap-2">
              <Input
                id="cid"
                placeholder="Enter the document's CID"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleRetrieve}
                disabled={!cid.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                Retrieve
              </Button>
            </div>
          </div>

          {fileUrl && (
            <>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="font-medium mb-2">File URL:</p>
                <code className="block w-full bg-background p-2 rounded text-sm break-all">
                  {fileUrl}
                </code>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Decryption Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the decryption password"
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

              {progress > 0 && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    {isDecrypting ? 'Decrypting...' : 'Completed'} {progress}%
                  </p>
                </div>
              )}

              <Button 
                onClick={handleDecrypt} 
                className="w-full"
                disabled={!password || isDecrypting}
              >
                <FileDown className="h-4 w-4 mr-2" />
                {isDecrypting ? 'Decrypting...' : 'Decrypt & Download'}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}