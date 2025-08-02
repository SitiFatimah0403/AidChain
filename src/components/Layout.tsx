import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Wallet, Shield, Home } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">AidChain</span>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                
                <Link
                  to="/donor"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/donor') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Donate</span>
                </Link>
                
                <Link
                  to="/recipient"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/recipient') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Receive Aid</span>
                </Link>
                
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {wallet.isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">
                      {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                    </div>
                    <div className="text-xs">
                      {parseFloat(wallet.balance).toFixed(4)} ETH
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
