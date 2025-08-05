import React, { useState } from 'react';
import { Shield, Users, CheckCircle, XCircle, AlertTriangle, Gift } from 'lucide-react';
import { useContract } from '@/hooks/useContract';
import { useAccount } from 'wagmi';
import { isAdmin } from '@/admin/isAdmin'; 

export const AdminPanel: React.FC = () => {
  const { address: userAddress, isConnected } = useAccount();
  const {
    contractState,
    donate,
    applyForAid,
    approveRecipient,
    claimAid,
    mintDonorNFT,
    mintRecipientNFT,
    loading
  } = useContract();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = isConnected;

  const handleApproveRecipient = async (recipient: string) => {
    try {
      setIsSubmitting(true);
      await approveRecipient(recipient);
      alert('Recipient approved successfully!');
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMintDonorNFT = async (donor: string) => {
    try {
      await mintDonorNFT(donor);
      alert('Donor NFT minted successfully!');
    } catch (error) {
      console.error('NFT minting failed:', error);
      alert('NFT minting failed. Please try again.');
    }
  };

  const handleMintRecipientNFT = async (recipient: string) => {
    try {
      await mintRecipientNFT(recipient);
      alert('Recipient NFT minted successfully!');
    } catch (error) {
      console.error('NFT minting failed:', error);
      alert('NFT minting failed. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your admin wallet to access the admin panel.</p>
      </div>
    );
  }

  const pendingRequests = contractState.aidRequests.filter(r => !r.approved);
  const approvedRequests = contractState.aidRequests.filter(r => r.approved && !r.claimed);
  const claimedRequests = contractState.aidRequests.filter(r => r.claimed);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-xl text-gray-600">Manage aid requests and monitor platform activity</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Donations" value={contractState.donations.length} icon={<Users className="h-8 w-8 text-blue-600" />} />
        <StatCard title="Pending Requests" value={pendingRequests.length} icon={<AlertTriangle className="h-8 w-8 text-yellow-600" />} />
        <StatCard title="Approved" value={approvedRequests.length} icon={<CheckCircle className="h-8 w-8 text-green-600" />} />
        <StatCard title="Claimed" value={claimedRequests.length} icon={<Gift className="h-8 w-8 text-purple-600" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <AidRequests
          loading={loading}
          requests={contractState.aidRequests}
          handleApprove={handleApproveRecipient}
          isSubmitting={isSubmitting}
        />
        <NFTManagement
          donations={contractState.donations}
          claimedRequests={claimedRequests}
          handleMintDonor={handleMintDonorNFT}
          handleMintRecipient={handleMintRecipientNFT}
        />
      </div>

      <RecentActivity donations={contractState.donations} claimed={claimedRequests} />

      <PlatformStats
        totalDonated={contractState.totalDonated}
        totalDonations={contractState.donations.length}
        aidApplications={contractState.aidRequests.length}
        peopleHelped={claimedRequests.length}
      />
    </div>
  );
};

// Reusable component for stats
const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

// Aid Requests Section
const AidRequests = ({ loading, requests, handleApprove, isSubmitting }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
      <Shield className="h-6 w-6 text-indigo-600 mr-2" />
      Aid Requests
    </h2>
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading requests...</p>
      </div>
    ) : requests.length > 0 ? (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {requests.map((r, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{r.recipient.slice(0, 6)}...{r.recipient.slice(-4)}</span>
              <div className="flex items-center space-x-2">
                {r.claimed ? (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Claimed</span>
                ) : r.approved ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Approved</span>
                ) : (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleApprove(r.recipient)}
                      disabled={isSubmitting}
                      className="p-1 bg-green-600 hover:bg-green-700 text-white rounded"
                      title="Approve"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{r.reason}</p>
            <p className="text-xs text-gray-500">Applied: {new Date(r.timestamp * 1000).toLocaleDateString()}</p>
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
);

// NFT Mint Section
const NFTManagement = ({ donations, claimedRequests, handleMintDonor, handleMintRecipient }) => {
  const uniqueDonors = (donations as any[]).reduce((acc: string[], d) => {
    if (!acc.includes(d.donor)) acc.push(d.donor);
    return acc;
  }, []);
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Gift className="h-6 w-6 text-purple-600 mr-2" />
        NFT Management
      </h2>
      <div className="space-y-6">
        {/* Donors */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Mint Donor NFTs</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uniqueDonors.map((donor, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{donor.slice(0, 6)}...{donor.slice(-4)}</span>
                <button
                  onClick={() => handleMintDonor(donor)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Mint Donor NFT
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Recipients */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Mint Recipient NFTs</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {claimedRequests.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{r.recipient.slice(0, 6)}...{r.recipient.slice(-4)}</span>
                <button
                  onClick={() => handleMintRecipient(r.recipient)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Mint Recipient NFT
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentActivity = ({ donations, claimed }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Recent Donations</h3>
        {(donations as any[]).slice(-6).reverse().map((d, i) => (
          <div key={i} className="p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{d.donor.slice(0, 6)}...{d.donor.slice(-4)}</span>
              <span className="text-sm font-semibold text-blue-600">{d.amount} ETH</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{new Date(Number(d.timestamp) * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Recent Claims</h3>
        {claimed.slice(-6).reverse().map((r, i) => (
          <div key={i} className="p-3 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{r.recipient.slice(0, 6)}...{r.recipient.slice(-4)}</span>
              <span className="text-sm font-semibold text-green-600">0.01 ETH</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{new Date(Number(r.timestamp) * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PlatformStats = ({ totalDonated, totalDonations, aidApplications, peopleHelped }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
    <h2 className="text-2xl font-bold mb-6">Platform Statistics</h2>
    <div className="grid md:grid-cols-4 gap-6 text-center">
      <div><div className="text-3xl font-bold mb-2">{totalDonated}</div><div className="text-indigo-200">Total ETH Donated</div></div>
      <div><div className="text-3xl font-bold mb-2">{totalDonations}</div><div className="text-indigo-200">Total Donations</div></div>
      <div><div className="text-3xl font-bold mb-2">{aidApplications}</div><div className="text-indigo-200">Aid Applications</div></div>
      <div><div className="text-3xl font-bold mb-2">{peopleHelped}</div><div className="text-indigo-200">People Helped</div></div>
    </div>
  </div>
);
