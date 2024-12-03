import { FileText, User, HelpCircle, Lock } from 'lucide-react';
import { MetaMaskAuth } from './MetaMaskAuth';

interface NavigationProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
  walletAddress?: string;
}

export function Navigation({ onConnect, isConnected, walletAddress }: NavigationProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MyFile</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#upload"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Upload
            </a>
            <a
              href="#decrypt"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Decrypt
            </a>
            <a
              href="#profile"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </a>
            <a
              href="#help"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </a>
          </nav>

          <MetaMaskAuth 
            onConnect={onConnect} 
            isConnected={isConnected} 
            walletAddress={walletAddress}
          />
        </div>
      </div>
    </header>
  );
}