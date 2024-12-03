import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WalletIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MetaMaskAuthProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
  walletAddress?: string;
}

export function MetaMaskAuth({ onConnect, isConnected, walletAddress }: MetaMaskAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to continue",
        variant: "destructive"
      });
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get the network/chain ID
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      onConnect(accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length > 0) {
          onConnect(newAccounts[0]);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
    return (
      <Button
        variant="outline"
        className="bg-primary/10 hover:bg-primary/20 text-primary font-mono"
      >
        <WalletIcon className="h-4 w-4 mr-2" />
        {formatAddress(walletAddress)}
      </Button>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors duration-200"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <WalletIcon className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}