import * as React from 'react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Users, Clock, CheckCircle, Gift, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useContract } from '@/hooks/useContract';
import { useBadgeContract } from '@/hooks/useBadgeContract';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isAdmin } from '@/admin/isAdmin';
import { GeminiChat } from "@/components/ChatBot";

//import css
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


export const RecipientDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const {
    contractState,
    donate,
    mintDonorNFT,
    applyForAid,
    claimAid,
    loading,
  } = useContract();
  const { mintBadge } = useBadgeContract();

  const [aidReason, setAidReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const { address: userAddress } = useAccount();
  

  const navigate = useNavigate();
  const queryClient = useQueryClient(); // to refetch latest contract data

    //if admin, then dia tak boleh masuk recipient dashboard
    useEffect(() => {
    if (isAdmin(address)) {
      navigate('/admin');
    }
  }, [address]);

  

  const handleApplyForAid = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!aidReason.trim()) return;

  try {
    setIsSubmitting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        const locationStr = `${lat},${lon}`;

        await applyForAid(aidReason, locationStr, name, phone);

        // Force refetch contract data so new request appears
        await queryClient.invalidateQueries();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait a bit

        // Clear form after successful submission
        setAidReason('');
        setName('');
        setPhone('');
        alert('Aid application submitted successfully!');
      },
      (error) => {
        console.error('Location access denied', error);
        alert('Please enable location to submit your application.');
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
    if (!address) return;
    try {
      // link badge nanti
    const metadataURI = 'https://ipfs.io/ipfs://bafkreiaa2a2kqqv2kznfwfwozhiocikrcq5mg3nqy2kdkjylg76wsnnesm';

      await mintBadge(address, metadataURI); 
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

  if (!isConnected || !address) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to access the recipient dashboard.</p>
      </div>
    );
  }

  // 🔍 DEBUGGING: Log aid requests
  useEffect(() => {
    console.log("📦 contractState.aidRequests:", contractState.aidRequests);
  }, [contractState.aidRequests]);


  const userRequest = contractState.aidRequests.find(
    (r) => r.recipient.toLowerCase() === address.toLowerCase()
  );

  console.log("👤 Matched userRequest:", userRequest);
  if (userRequest) {
  console.log("✅ Approved:", userRequest.approved);
  console.log("❌ Claimed:", userRequest.claimed);
  console.log("🧠 Type of claimed:", typeof userRequest.claimed);
}

  console.log("All Donations:", contractState.donations);
  console.log("Active Recipient:", contractState.activeRecipient);
  console.log("My Address:", address);


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipient Dashboard</h1>
        <p className="text-xl text-gray-600">Apply for aid and track your application status</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {contractState.aidRequests?.length ?? 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {contractState.aidRequests.filter((r) => r.approved).length}
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
                {contractState.aidRequests.filter((r) => r.claimed).length}
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

      {/* Form or Status View */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          {/*NAK TESTING <p>userRequest exists: {userRequest ? '✅ YES' : '❌ NO'}</p>*/}
            {!userRequest ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                Apply for Aid
              </h2>
              <form onSubmit={handleApplyForAid} className="space-y-4">
                <div>
                  <label htmlFor="recipient-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    id="recipient-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="recipient-number" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="border border-gray-300 rounded-md">
                    <PhoneInput
                      country={'my'}
                      value={phone}
                      onChange={setPhone}
                      enableSearch={true}
                      preferredCountries={['my']}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        id: 'recipient-number',
                      }}
                      containerClass="w-full"
                    inputClass="!w-full !pl-14 !pr-4 !py-2 !border !border-gray-300 !rounded-md !text-sm focus:!outline-none focus:!ring-2 focus:!ring-indigo-500"
                    buttonClass="!border-none !bg-transparent !left-3"
                    />
                  </div>
                </div>
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
                    <li>• Each approved recipient can only have their fund raise open for 14 days from date of launch</li>
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
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          userRequest.approved,
                          userRequest.claimed
                        )}`}
                      >
                        {getStatusText(userRequest.approved, userRequest.claimed)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Reason:</strong> {userRequest.reason}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Applied:</strong>{' '}
                      {new Date(Number(userRequest.timestamp) * 1000).toLocaleDateString('en-GB')} {new Date(Number(userRequest.timestamp) * 1000).toLocaleTimeString('en-GB')}
                    </p>
                  </div>

                  {userRequest.approved && !userRequest.claimed && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Ready to Claim!</h3>
                      <p className="text-sm text-green-800 mb-4">
                        Your application has been approved. You can now claim your aid of ETH.
                      </p>
                      <button
                        onClick={handleClaimAid}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                      >
                        {isSubmitting   ? 'Claiming...'
                         : `Claim Aid (${contractState.aidAmount || '...'} ETH)`}
                      </button>
                    </div>
                  )}

                  {userRequest.claimed && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-purple-900">Claim Your Recipient NFT</h3>
                          <p className="text-sm text-purple-800">
                            You're eligible for a recipient badge NFT!
                          </p>
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

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Aid Requests</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading requests...</p>
            </div>
          ) : contractState.aidRequests && contractState.aidRequests.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contractState.aidRequests
                .filter(request => isAdmin(address) || request.recipient.toLowerCase() === address.toLowerCase()) // ✅ show only mine unless admin
                .slice(-10)
                .reverse()
                .map((request, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {request.recipient.slice(0, 6)}...{request.recipient.slice(-4)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          request.approved,
                          request.claimed
                        )}`}
                      >
                        {getStatusText(request.approved, request.claimed)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700"><strong>Name:</strong> {request.name}</p>
                    <p className="text-sm text-gray-700"><strong>Contact:</strong> {request.contact}</p>
                    <p className="text-sm text-gray-700"><strong>Location:</strong> {request.location}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Reason:</strong> {request.reason}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(Number(request.timestamp) * 1000).toLocaleDateString('en-GB')}{" "}
                      {new Date(Number(request.timestamp) * 1000).toLocaleTimeString('en-GB')}
                    </p>

                    {/* ✅ New section: Donations received for this application */}
                    <div className="mt-3 border-t pt-2">
                      <p className="text-sm font-medium text-gray-900 mb-1">Donations Received:</p>

                      {(() => { console.log("Donations array:", contractState.donations); return null; })()}

                      {contractState.donations
                        .filter(() => true)


                        .map((donation, index) => (
                          <div key={index} className="flex justify-between text-sm text-gray-700">
                            <span>{donation.donor.slice(0, 6)}...{donation.donor.slice(-4)}</span>
                            <span>{(Number(donation.amount) / 1e18).toFixed(4)} ETH</span>
                          </div>
                        ))
                      }
                    </div>
                      
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

      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Your Aid Summary</h2>
          {/*
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Automatic Approval (NFA)</h3>
            <p className="text-blue-100 text-sm">
              Our No Fraud Algorithm automatically approves legitimate requests from addresses that
              haven't previously claimed aid and aren't flagged for suspicious activity.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fair Distribution</h3>
            <p className="text-blue-100 text-sm">
              Each approved aid request remains active for 14 days, ensuring equal opportunity for all applicants to receive support within the same time frame.
            </p>
          </div>*/}
      
      
      

      {/* ✅ Added user stats here in same section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 text-center gap-6 border-t border-white/30 pt-6">
        
        <div>
          <p className="text-sm font-medium text-white/80">ETH Received</p>
          <p className="text-3xl font-bold">
            {userRequest?.claimed ? `${contractState.aidAmount || '0'} ETH` : '0 ETH'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-white/80">Total Donors</p>
          <p className="text-3xl font-bold">
            {new Set(contractState.donations.map(d => d.donor.toLowerCase())).size}
          </p>
        </div>
      </div>
    </div>

        {/* ✅ Floating chatbot */}
                <GeminiChat />
                      
    </div>
  );
};

                  
