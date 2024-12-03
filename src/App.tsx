import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { FileRetrieval } from '@/components/FileRetrieval';
import { MetaMaskAuth } from '@/components/MetaMaskAuth';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ProfileSettings } from '@/components/ProfileSettings';
import { HelpFAQ } from '@/components/HelpFAQ';
import { FileDecrypt } from '@/components/FileDecrypt';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  const handleConnect = (address: string) => {
    setIsConnected(true);
    setWalletAddress(address);
    console.log('Connected address:', address);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        onConnect={handleConnect} 
        isConnected={isConnected} 
        walletAddress={walletAddress}
      />
      
      {!isConnected ? (
        <div>
          <Hero />
          <Features />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-[600px] mx-auto">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <div className="space-y-6">
                  <FileUpload />
                  <FileRetrieval />
                </div>
              </TabsContent>
              
              <TabsContent value="decrypt">
                <FileDecrypt />
              </TabsContent>
              
              <TabsContent value="profile">
                <ProfileSettings walletAddress={walletAddress} />
              </TabsContent>
              
              <TabsContent value="help">
                <HelpFAQ />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;