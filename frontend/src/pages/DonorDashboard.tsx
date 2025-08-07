import React, { useState } from 'react';
import { Heart, Award, TrendingUp, Users, Gift } from 'lucide-react';
import { useAccount, useWalletClient } from 'wagmi';
import { useContract } from '@/hooks/useContract';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isAdmin } from '@/admin/isAdmin';
import { GeminiChat } from "@/components/ChatBot";
import { formatEther , isAddress } from 'viem';
import { useSearchParams } from 'react-router-dom';
import { useConfidentialDonationContract } from '@/hooks/useConfidentialDonationContract';



export const DonorDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const signer = walletClient;
  const { contractState, loading, donate, mintDonorNFT } = useContract();
  const [donationAmount, setDonationAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  //const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null); //selectedRecipient can be null or a string, instead of always being a string.
  const [searchParams] = useSearchParams();
  const { confidentialDonate } = useConfidentialDonationContract(); // Hook to handle confidential donations
  const [isDonating, setIsDonating] = useState(false); //for confidential donation state

  useEffect(() => {
    const prefilledRecipient = searchParams.get("recipient");
    if (prefilledRecipient) {
      setSelectedRecipient(prefilledRecipient);
    }
  }, [searchParams]);

  //if admin, then dia tak boleh masuk donor dashboard
  useEffect(() => {
    if (isAdmin(address)) {
      navigate('/admin');
    }
  }, [address]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount || parseFloat(donationAmount) <= 0) return;

    try {
      setIsSubmitting(true);
      console.log("📤 Donating to:", selectedRecipient);
      console.log("💰 Amount:", donationAmount);
      await donate(selectedRecipient, donationAmount);
      setDonationAmount('');
      alert('Donation successful! Thank you for your contribution.');
    } catch (error: any) {
      console.error('❌ Donation failed:', error);
      if (error?.message) {
        console.log("📛 Error Message:", error.message);
      }
      if (error?.cause) {
        console.log("📛 Cause:", error.cause);
      }
      alert('Donation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }

    

  };

  //handle confidential donation-SEPPHIRE
const handleConfidentialDonate = async () => {
  if (!selectedRecipient || !donationAmount) {
    alert("Recipient and amount are required.");
    return;
  }

  if (!isAddress(selectedRecipient)) {
    alert("❌ Invalid Ethereum address.");
    return;
  }

  try {
    setIsDonating(true);
    await confidentialDonate(selectedRecipient as `0x${string}`, donationAmount);
    alert("✅ Confidential donation successful!");
  } catch (error) {
    console.error("❌ Confidential donation failed:", error);
    alert("❌ Donation failed. Try again.");
  } finally {
    setIsDonating(false);
  }
};

  const handleMintNFT = async () => {
    if (!address) return;

    try {
      await mintDonorNFT(address); // ✅ now passing the address
      alert('Donor NFT minted successfully!');
    } catch (error) {
      console.error('NFT minting failed:', error);
      alert('NFT minting failed. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to access the donor dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Donor Dashboard</h1>
        <p className="text-xl text-gray-600">Make a difference with transparent blockchain donations</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donated</p>
              <p className="text-2xl font-bold text-gray-900">
                {contractState.donations
                  .filter(d => d.donor.toLowerCase() === address?.toLowerCase())
                  .reduce((sum, d) => sum + parseFloat(formatEther(BigInt(d.amount))), 0)
                  .toFixed(3)} ETH
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">
                {contractState.donations.filter(d => d.donor.toLowerCase() === address?.toLowerCase()).length}
              </p>
            </div>
            <Users className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Status</p>
              <p className="text-lg font-semibold text-indigo-600">
                {contractState.userHasDonated ? 'Donor' : 'New User'}
              </p>
            </div>
            <Award className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Heart className="h-6 w-6 text-red-600 mr-2" />
            Make a Donation
          </h2>

          <form onSubmit={handleDonate} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                  Choose Recipient
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/recipientsList')}
                  className="text-indigo-600 text-sm underline hover:text-indigo-800"
                >
                  See Lists
                </button>
              </div>
              <select
                id="recipient"
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">-- Select Recipient --</option>
                {contractState.aidRequests
                  .filter(r => r.approved && !r.claimed)
                  .map((r, index) => (
                    <option key={index} value={r.recipient}>
                      {r.name} - {r.recipient.slice(0, 6)}...{r.recipient.slice(-4)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (ETH)
              </label>
              <input
                type="number"
                id="amount"
                step="0.001"
                min="0.001"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="minimum 0.001"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Your Impact</h3>
              <p className="text-sm text-blue-800">
                Every recipient has been pre-approved based on need, ensuring your donation makes a real difference.
              </p>
            </div>

            {/* ✅ Floating chatbot */}
            <GeminiChat />

            <button
              type="submit"
              disabled={isSubmitting || !donationAmount}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-semibold transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Donate Now'}
            </button>

            {/* Confidential donation button */}
            <button
              type="button"
              disabled={isDonating || !donationAmount}
              onClick={handleConfidentialDonate}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-semibold transition-colors mt-2"
            >
              {isDonating ? 'Processing...' : 'Confidential Donate (Sapphire)'} </button>


          </form>

          {contractState.userHasDonated && !contractState.userHasDonorNFT && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900">Claim Your Donor NFT</h3>
                  <p className="text-sm text-green-800">You're eligible for a donor badge NFT!</p>
                </div>
                <button
                  onClick={handleMintNFT}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <Gift className="h-4 w-4" />
                  <span>Mint NFT</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading donations...</p>
            </div>
          ) : contractState.donations.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contractState.donations.slice(-10).reverse().map((donation, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {donation.donor && donation.donor.length >= 10
                        ? `${donation.donor.slice(0, 6)}...${donation.donor.slice(-4)}`
                        : 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(Number(donation.timestamp) * 1000).toLocaleDateString('en-GB')} {new Date(Number(donation.timestamp) * 1000).toLocaleTimeString('en-GB')}

                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-600"> {formatEther(BigInt(donation.amount))}  ETH</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No donations yet. Your support could make a difference.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Community Impact</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {contractState.donations.length}
            </div>
            <div className="text-indigo-200">Total Donations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {contractState.donations
                .reduce((sum, d) => sum + parseFloat(formatEther(BigInt(d.amount))), 0)
                .toFixed(3)} ETH
            </div>
            <div className="text-indigo-200">Funds Raised</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {
                new Set(
                  contractState.donations.map(d => d.donor?.toLowerCase())
                ).size
              }
            </div>
            <div className="text-indigo-200">People Helped</div>
          </div>

        </div>
      </div>
    </div>
  );
};
