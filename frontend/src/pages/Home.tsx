import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield, Award, Users, TrendingUp, Globe } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from '@/components/connectWalletButton';
import { isAdmin } from '@/admin/isAdmin';
import { GeminiChat } from '@/components/ChatBot';

export const Home: React.FC = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

 


  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isAdmin(address)) {
      navigate('/admin');
    }
  }, [address]);

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

        {/* Hero Image */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Hands reaching out for help and support"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Floating cards */}
          <div className="absolute -top-8 -left-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">100% Secure</p>
                <p className="text-sm text-gray-600">Blockchain Protected</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 -right-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">89.3 ETH</p>
                <p className="text-sm text-gray-600">Total Raised</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isConnected && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
        )}
      </div>

      {/* Fundraising Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <FundCard
          title="Emergency Food Relief"
          location="Southeast Asia"
          raised={24.7}
          goal={30}
          donors={156}
          img="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
          color="green"
        />

        {/* Card 2 */}
        <FundCard
          title="Clean Water Initiative"
          location="Sub-Saharan Africa"
          raised={18.2}
          goal={25}
          donors={203}
          img="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
          color="blue"
        />

        {/* Card 3 */}
        <FundCard
          title="Education Support"
          location="Rural Communities"
          raised={31.5}
          goal={40}
          donors={287}
          img="https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
          color="purple"
        />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <Feature
          icon={<Shield className="h-6 w-6 text-indigo-600" />}
          title="Transparent & Secure"
          text="All transactions are recorded on the Ethereum blockchain, ensuring complete transparency and immutable records of every donation and aid distribution."
          bg="bg-indigo-100"
        />
        <Feature
          icon={<Award className="h-6 w-6 text-green-600" />}
          title="NFT Rewards"
          text="Donors and recipients receive unique NFT badges as proof of their participation, creating a permanent record of their contribution to the community."
          bg="bg-green-100"
        />
        <Feature
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          title="Smart Distribution"
          text="Our NFA (No Fraud Algorithm) automatically approves legitimate aid requests while preventing abuse through intelligent pattern recognition."
          bg="bg-purple-100"
        />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Stats */}
      <Stats />

      {/* Call To Action */}
      <div className="text-center bg-gray-50 rounded-2xl p-8">
        <Globe className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
          Join the decentralized aid revolution. Every contribution matters, every transaction is transparent,
          and every participant is rewarded.
        </p>
        {!isConnected && <ConnectWalletButton />}
      </div>

      {/* Gemini Chat Assistant */}
      <GeminiChat />
    </div>
  );
};

// Fundraising Card Component
const FundCard = ({ title, location, raised, goal, donors, img, color }: any) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <img src={img} alt={title} className="w-full h-40 object-cover" />
    <div className="p-4 space-y-2">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{location}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div className={`bg-${color}-500 h-2.5 rounded-full`} style={{ width: `${(raised / goal) * 100}%` }}></div>
      </div>
      <p className="text-sm text-gray-600">{raised} ETH raised of {goal} ETH</p>
      <p className="text-sm text-gray-600">{donors} donors</p>
    </div>
  </div>
);

// Reusable Feature Block
const Feature = ({ icon, title, text, bg }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-4`}>{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

// How It Works Section
const HowItWorks = () => (
  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How AidChain Works</h2>
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <ol className="space-y-6">
        {[
          {
            step: 'Connect Your Wallet',
            desc: 'Link your MetaMask wallet to interact with the AidChain smart contract on Ethereum Sepolia testnet.',
          },
          {
            step: 'Donate or Apply',
            desc: 'Choose to donate ETH to help others or apply for aid if you need assistance. All transactions are transparent.',
          },
          {
            step: 'Automatic Processing',
            desc: 'Our smart contract automatically processes aid requests and distributes funds to approved recipients.',
          },
          {
            step: 'Earn NFT Badges',
            desc: 'Receive unique NFT badges as proof of your participation, whether as a donor or aid recipient.',
          },
        ].map((item, i) => (
          <li key={i} className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              {i + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.step}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="volunteer pic"
          className="rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-indigo-600 bg-opacity-10 rounded-lg" />

        {/* Floating Icons */}
        <div className="absolute -top-6 -right-6 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Heart className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Award className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Stats Section
const Stats = () => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2">Making a Real Impact</h2>
      <p className="text-indigo-100">Join thousands of users creating positive change through blockchain technology</p>
    </div>
    <div className="grid md:grid-cols-4 gap-6 text-center">
      {[
        ['1,247', 'Total Donations'],
        ['89.3 ETH', 'Funds Raised'],
        ['892', 'People Helped'],
        ['2,139', 'NFTs Minted'],
      ].map(([stat, label]) => (
        <div key={label}>
          <div className="text-3xl font-bold mb-1">{stat}</div>
          <div className="text-indigo-200">{label}</div>
        </div>
      ))}
    </div>
  </div>
);