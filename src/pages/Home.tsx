import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Award, Users, TrendingUp, Globe } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export const Home: React.FC = () => {
  const { wallet, connectWallet } = useWallet();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Transparent Aid Distribution
            <span className="block text-indigo-600">Powered by Blockchain</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AidChain revolutionizes charitable giving through smart contracts, ensuring every donation 
            reaches those in need while providing complete transparency and NFT rewards for contributors.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {wallet.isConnected ? (
            <div className="flex gap-4">
              <Link
                to="/donor"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Start Donating</span>
              </Link>
              <Link
                to="/recipient"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Apply for Aid</span>
              </Link>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Shield className="h-5 w-5" />
              <span>Connect Wallet to Get Started</span>
            </button>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent & Secure</h3>
          <p className="text-gray-600">
            All transactions are recorded on the Ethereum blockchain, ensuring complete transparency 
            and immutable records of every donation and aid distribution.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Award className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">NFT Rewards</h3>
          <p className="text-gray-600">
            Donors and recipients receive unique NFT badges as proof of their participation, 
            creating a permanent record of their contribution to the community.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Distribution</h3>
          <p className="text-gray-600">
            Our NFA (No Fraud Algorithm) automatically approves legitimate aid requests while 
            preventing abuse through intelligent pattern recognition.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How AidChain Works</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Connect Your Wallet</h3>
                <p className="text-gray-600">Link your MetaMask wallet to interact with the AidChain smart contract on Ethereum Sepolia testnet.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Donate or Apply</h3>
                <p className="text-gray-600">Choose to donate ETH to help others or apply for aid if you need assistance. All transactions are transparent.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Automatic Processing</h3>
                <p className="text-gray-600">Our smart contract automatically processes aid requests and distributes funds to approved recipients.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Earn NFT Badges</h3>
                <p className="text-gray-600">Receive unique NFT badges as proof of your participation, whether as a donor or aid recipient.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Blockchain technology"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-indigo-600 bg-opacity-10 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Making a Real Impact</h2>
          <p className="text-indigo-100">Join thousands of users creating positive change through blockchain technology</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">1,247</div>
            <div className="text-indigo-200">Total Donations</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">89.3 ETH</div>
            <div className="text-indigo-200">Funds Raised</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">892</div>
            <div className="text-indigo-200">People Helped</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">2,139</div>
            <div className="text-indigo-200">NFTs Minted</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gray-50 rounded-2xl p-8">
        <Globe className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
          Join the decentralized aid revolution. Every contribution matters, every transaction is transparent, 
          and every participant is rewarded.
        </p>
        
        {!wallet.isConnected && (
          <button
            onClick={connectWallet}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Connect Wallet to Begin
          </button>
        )}
      </div>
    </div>
  );
};
