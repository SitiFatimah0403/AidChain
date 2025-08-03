import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Wallet, Shield, Home } from 'lucide-react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { formatEther } from 'viem';

interface LayoutProps {
  children: React.ReactNode;
}


export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { address, isConnected } = useAccount(); // Gets the connected wallet address and status
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ // Fetches the balance of the connected wallet
    address: address,
   // watch: true,
  });

  const isActive = (path: string) => location.pathname === path; // Checks if the current path matches the given path

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
                {[
                  { to: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
                  { to: '/donor', label: 'Donate', icon: <Heart className="h-4 w-4" /> },
                  { to: '/recipient', label: 'Receive Aid', icon: <Wallet className="h-4 w-4" /> },
                  { to: '/admin', label: 'Admin', icon: <Shield className="h-4 w-4" /> },
                ].map(({ to, label, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(to)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isConnected && address ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </div>
                    <div className="text-xs">
                      {balanceData ? parseFloat(formatEther(balanceData.value)).toFixed(4) : '...'} ETH
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const el = document.getElementById('connect-modal-button');
                    if (el) (el as HTMLButtonElement).click();
                  }}
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
