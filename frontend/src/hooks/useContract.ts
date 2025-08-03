import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ContractState, Donation, AidRequest } from '../types';

const CONTRACT_ADDRESS = '0x12345678901234567890123456789012345678'; // Replace with actual deployed address (GUNA .ENV)
const CONTRACT_ABI = [
  "function donate() external payable",
  "function applyForAid(string memory reason) external",
  "function approveRecipient(address recipient) external",
  "function claimAid() external",
  "function getDonations() external view returns (tuple(address donor, uint256 amount, uint256 timestamp)[])",
  "function getAidRequests() external view returns (address[])",
  "function totalDonated() external view returns (uint256)",
  "function aidRequests(address) external view returns (address recipient, string reason, uint256 timestamp, bool approved, bool claimed)",
  "function hasDonated(address) external view returns (bool)",
  "function approvedRecipients(address) external view returns (bool)",
  "function hasClaimedAid(address) external view returns (bool)",
  "function mintDonorNFT(address donor) external",
  "function mintRecipientNFT(address recipient) external",
  "event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp)",
  "event AidRequested(address indexed recipient, string reason, uint256 timestamp)",
  "event RecipientApproved(address indexed recipient, uint256 timestamp)",
  "event AidClaimed(address indexed recipient, uint256 amount, uint256 timestamp)",
  "event ApprovedByNFA(address indexed recipient, uint256 timestamp)"
];

export const useContract = (signer: ethers.JsonRpcSigner | null, userAddress: string | null) => {
  const [contractState, setContractState] = useState<ContractState>({
    totalDonated: '0',
    donations: [],
    aidRequests: [],
    userHasDonated: false,
    userHasApplied: false,
    userIsApproved: false,
    userHasClaimed: false,
  });

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signer) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
      loadContractData(contractInstance);
    }
  }, [signer, userAddress]);

  const loadContractData = async (contractInstance: ethers.Contract) => {
    try {
      setLoading(true);
      
      const totalDonated = await contractInstance.totalDonated();
      const donations = await contractInstance.getDonations();
      const aidRequestAddresses = await contractInstance.getAidRequests();
      
      // Load aid requests details
      const aidRequests: AidRequest[] = [];
      for (const address of aidRequestAddresses) {
        const request = await contractInstance.aidRequests(address);
        aidRequests.push({
          recipient: request.recipient,
          reason: request.reason,
          timestamp: Number(request.timestamp),
          approved: request.approved,
          claimed: request.claimed,
        });
      }

      let userHasDonated = false;
      let userHasApplied = false;
      let userIsApproved = false;
      let userHasClaimed = false;

      if (userAddress) {
        userHasDonated = await contractInstance.hasDonated(userAddress);
        userIsApproved = await contractInstance.approvedRecipients(userAddress);
        userHasClaimed = await contractInstance.hasClaimedAid(userAddress);
        
        const userRequest = await contractInstance.aidRequests(userAddress);
        userHasApplied = userRequest.recipient !== ethers.ZeroAddress;
      }

      setContractState({
        totalDonated: ethers.formatEther(totalDonated),
        donations: donations.map((d: any) => ({
          donor: d.donor,
          amount: ethers.formatEther(d.amount),
          timestamp: Number(d.timestamp),
        })),
        aidRequests,
        userHasDonated,
        userHasApplied,
        userIsApproved,
        userHasClaimed,
      });
    } catch (error) {
      console.error('Error loading contract data:', error);
    } finally {
      setLoading(false);
    }
  };

  const donate = async (amount: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    const tx = await contract.donate({
      value: ethers.parseEther(amount)
    });
    await tx.wait();
    
    // Reload data
    await loadContractData(contract);
  };

  const applyForAid = async (reason: string, location: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    const tx = await contract.applyForAid(reason, location);
    await tx.wait();
    
    // Reload data
    await loadContractData(contract);
  };

  const claimAid = async () => {
    if (!contract) throw new Error('Contract not initialized');
    
    const tx = await contract.claimAid();
    await tx.wait();
    
    // Reload data
    await loadContractData(contract);
  };

  const approveRecipient = async (recipient: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    const tx = await contract.approveRecipient(recipient);
    await tx.wait();
    
    // Reload data
    await loadContractData(contract);
  };

  const mintDonorNFT = async (donor: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    const tx = await contract.mintDonorNFT(donor);
    await tx.wait();
  };

  const mintRecipientNFT = async (recipient: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    const tx = await contract.mintRecipientNFT(recipient);
    await tx.wait();
  };

  return {
    contractState,
    loading,
    donate,
    applyForAid,
    claimAid,
    approveRecipient,
    mintDonorNFT,
    mintRecipientNFT,
    refreshData: () => contract && loadContractData(contract),
  };
};
