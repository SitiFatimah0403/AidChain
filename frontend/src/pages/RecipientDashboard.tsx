import React, { useState } from 'react';
import { Users, Clock, CheckCircle, Gift, AlertCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';

export const RecipientDashboard: React.FC = () => {
  const { wallet, signer } = useWallet();
  const { contractState, loading, applyForAid, claimAid, mintRecipientNFT } = useContract(signer, wallet.address);
  const [aidReason, setAidReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState('');

  const handleApplyForAid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aidReason.trim()) return;

    try {
      setIsSubmitting(true);

      // dapatkan user punya location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lon = position.coords.longitude.toFixed(6);
          const locationStr = `${lat},${lon}`;

          // Now send reason + location to smart contract
          await applyForAid(aidReason, locationStr);
          setAidReason('');
          alert('Aid application submitted successfully!');
        },
        (error) => {
          console.error("Location access denied", error);
          alert("Please enable location to submit your application.");
          setIsSubmitting(false);
        }
      );
    } catch (error) {
      console.error('Aid application failed:', error);
      alert('Aid application failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClaimAid = async () => {
    try {
      setIsSubmitting(true);
      await claimAid();
      alert('Aid claimed successfully!');
    } catch (error) {
      console.error('Aid claim failed:', error);
      alert('Aid claim failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMintNFT = async () => {
    if (!wallet.address) return;
    
    try {
      await mintRecipientNFT(wallet.address);
      alert('Recipient NFT minted successfully!');
    } catch (error) {
      console.error('NFT minting failed:', error);
      alert('NFT minting failed. Please try again.');
    }
  };

  const getStatusColor = (approved: boolean, claimed: boolean) => {
    if (claimed) return 'text-green-600 bg-green-100';
    if (approved) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStatusText = (approved: boolean, claimed: boolean) => {
    if (claimed) return 'Claimed';
    if (approved) return 'Approved';
    return 'Pending';
  };

  if (!wallet.isConnected) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to access the recipient dashboard.</p>
      </div>
    );
  }

  const userRequest = contractState.aidRequests.find(r => r.recipient.toLowerCase() === wallet.address?.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipient Dashboard</h1>
        <p className="text-xl text-gray-600">Apply for aid and track your application status</p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{contractState.aidRequests.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {contractState.aidRequests.filter(r => r.approved).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Claimed</p>
              <p className="text-2xl font-bold text-gray-900">
                {contractState.aidRequests.filter(r => r.claimed).length}
              </p>
            </div>
            <Gift className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Status</p>
              <p className="text-lg font-semibold text-indigo-600">
                {userRequest ? getStatusText(userRequest.approved, userRequest.claimed) : 'Not Applied'}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Application Form or Status */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          {!contractState.userHasApplied ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                Apply for Aid
              </h2>

              <form onSubmit={handleApplyForAid} className="space-y-4">
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Aid Request
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    value={aidReason}
                    onChange={(e) => setAidReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Please explain why you need assistance..."
                    required
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Aid Information</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Each approved recipient can claim up to 0.01 ETH</li>
                    <li>• Applications are automatically reviewed by our NFA system</li>
                    <li>• Legitimate requests are typically approved instantly</li>
                    <li>• You can only apply once per address</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !aidReason.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-semibold transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                Your Application Status
              </h2>

              {userRequest && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(userRequest.approved, userRequest.claimed)}`}>
                        {getStatusText(userRequest.approved, userRequest.claimed)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Reason:</strong> {userRequest.reason}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Applied:</strong> {new Date(userRequest.timestamp * 1000).toLocaleDateString()}
                    </p>
                  </div>

                  {userRequest.approved && !userRequest.claimed && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Ready to Claim!</h3>
                      <p className="text-sm text-green-800 mb-4">
                        Your application has been approved. You can now claim your aid of 0.01 ETH.
                      </p>
                      <button
                        onClick={handleClaimAid}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                      >
                        {isSubmitting ? 'Claiming...' : 'Claim Aid (0.01 ETH)'}
                      </button>
                    </div>
                  )}

                  {userRequest.claimed && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-purple-900">Claim Your Recipient NFT</h3>
                          <p className="text-sm text-purple-800">You're eligible for a recipient badge NFT!</p>
                        </div>
                        <button
                          onClick={handleMintNFT}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <Gift className="h-4 w-4" />
                          <span>Mint NFT</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Recent Aid Requests */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Aid Requests</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading requests...</p>
            </div>
          ) : contractState.aidRequests.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contractState.aidRequests.slice(-10).reverse().map((request, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {request.recipient.slice(0, 6)}...{request.recipient.slice(-4)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.approved, request.claimed)}`}>
                      {getStatusText(request.approved, request.claimed)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{request.reason}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(request.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No aid requests yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">How Aid Distribution Works</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Automatic Approval (NFA)</h3>
            <p className="text-blue-100 text-sm">
              Our No Fraud Algorithm automatically approves legitimate requests from addresses that haven't 
              previously claimed aid and aren't flagged for suspicious activity.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fair Distribution</h3>
            <p className="text-blue-100 text-sm">
              Each approved recipient can claim exactly 0.01 ETH to ensure fair distribution of donated funds 
              among all those who need assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
