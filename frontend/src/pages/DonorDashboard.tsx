import React, { useState } from 'react';
import { Heart, Award, TrendingUp, Users, Gift } from 'lucide-react';
import { useAccount, useWalletClient } from 'wagmi';
import { useContract } from '@/hooks/useContract';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isAdmin } from '@/admin/isAdmin';



export const DonorDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const signer = walletClient;

  const { contractState, loading, donate, mintDonorNFT } = useContract();
  const [donationAmount, setDonationAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      await donate(donationAmount);
      setDonationAmount('');
      alert('Donation successful! Thank you for your contribution.');
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donated</p>
              <p className="text-2xl font-bold text-gray-900">{contractState.totalDonated} ETH</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{contractState.donations.length}</p>
            </div>
            <Heart className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">People Helped</p>
              <p className="text-2xl font-bold text-gray-900">{contractState.aidRequests.filter(r => r.claimed).length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
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
                placeholder="0.01"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Your Impact</h3>
              <p className="text-sm text-blue-800">
                Your donation will be distributed to approved recipients who need assistance. 
                Each recipient can claim up to 0.01 ETH to help with their needs.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !donationAmount}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-semibold transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Donate Now'}
            </button>
          </form>

          {contractState.userHasDonated && (
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
                      {donation.donor.slice(0, 6)}...{donation.donor.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(donation.timestamp * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-600">{donation.amount} ETH</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No donations yet. Be the first to contribute!</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Your Impact</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {contractState.donations.filter(d => d.donor.toLowerCase() === address?.toLowerCase()).length}
            </div>
            <div className="text-indigo-200">Your Donations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {contractState.donations
                .filter(d => d.donor.toLowerCase() === address?.toLowerCase())
                .reduce((sum, d) => sum + parseFloat(d.amount), 0)
                .toFixed(4)}
            </div>
            <div className="text-indigo-200">ETH Contributed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {Math.floor(
                contractState.donations
                  .filter(d => d.donor.toLowerCase() === address?.toLowerCase())
                  .reduce((sum, d) => sum + parseFloat(d.amount), 0) / 0.01
              )}
            </div>
            <div className="text-indigo-200">People You Can Help</div>
          </div>
        </div>
      </div>
    </div>
  );
};
