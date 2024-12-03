import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, QrCode, Lock } from 'lucide-react';

interface QRCodeDisplayProps {
  cid: string;
  isEncrypted?: boolean;
}

export function QRCodeDisplay({ cid, isEncrypted = false }: QRCodeDisplayProps) {
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `ipfs-${cid}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const shareQRCode = async () => {
    try {
      await navigator.share({
        title: 'IPFS Document QR Code',
        text: `Access this document on IPFS: ${ipfsUrl}${isEncrypted ? ' (Password required for decryption)' : ''}`,
        url: ipfsUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 text-primary">
          <QrCode className="h-5 w-5" />
          <h3 className="font-semibold">QR Code for Easy Access</h3>
          {isEncrypted && (
            <Lock className="h-4 w-4 text-yellow-500" />
          )}
        </div>

        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <QRCode
              id="qr-code"
              value={ipfsUrl}
              size={200}
              level="H"
              includeMargin
              className="rounded-lg"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            {isEncrypted 
              ? "Scan this QR code to access the encrypted file (password required)"
              : "Scan this QR code to access the file directly"}
          </p>
          
          <div className="flex gap-2 justify-center">
            <Button
              onClick={downloadQRCode}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR
            </Button>
            
            {navigator.share && (
              <Button
                onClick={shareQRCode}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Link
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}