import { useAccount, usePublicClient, useReadContract, useWalletClient } from 'wagmi';
import { writeContract, readContract } from '@wagmi/core';
import { parseEther } from 'viem';
import type { Abi } from 'viem';
import BadgeNFTAbiJson from '@/contracts/AidBadgeNFT.json';
import AidChainAbiJson from '@/contracts/AidChain.json';
import type { ContractState, Donation, AidRequest } from '@/types';
import { config } from '@/wagmisetup';
import { useMemo, useEffect, useState } from 'react';
import { Address } from 'viem';

const CONTRACT_ADDRESS = import.meta.env.VITE_AID_CONTRACT as `0x${string}`;
console.log("Loaded contract address:", CONTRACT_ADDRESS);

const AidChainAbi = AidChainAbiJson.abi as Abi; // Cast the imported JSON ABI to the Abi type
const VITE_BADGE_CONTRACT = import.meta.env.VITE_BADGE_CONTRACT as `0x${string}`;
const BadgeNFTAbi = BadgeNFTAbiJson.abi as Abi;

// This custom hook provides functions to interact with the AidChain smart contract.
export const useContract = () => {
  const { address: userAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // ===== READ CONTRACTS =====
  const totalDonated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'totalDonated', //call totalDonated function from the contract
  });

  // ✅ FIX: Destructure .data and default to [] so donations is always an array
  const { data: donationsData = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'getDonations', //call getDonations function from the contract
  });

  const aidRequestsList = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'getAidRequests', //call getAidRequests function from the contract
  });

  const userReq = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'aidRequests', //call aidRequests function from the contract
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const isApproved = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'approvedRecipients', //call approvedRecipients function from the contract
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const hasClaimed = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasClaimedAid', //call hasClaimedAid function from the contract
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const hasDonorNFT = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasDonorBadge', // to check if the user has a donor badge
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const hasDonated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasDonated', //call hasDonated function from the contract
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const aidAmount = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'AID_AMOUNT',
  });

  // ✅ NEW: Read activeRecipient from smart contract
  const activeRecipient = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'activeRecipient', // get the current active recipient from contract
  });

  // Load full AidRequest details
  const [fullAidRequests, setFullAidRequests] = useState<AidRequest[]>([]);
  console.log("📦 aidRequestsList.data:", aidRequestsList.data);
  console.log("📦 RAW aidRequestsList.data:", aidRequestsList.data);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!Array.isArray(aidRequestsList.data)) return;
      const addresses = aidRequestsList.data as string[];

      const detailedRequests = await Promise.all(
        addresses.map(async (addr) => {
          const req = await readContract(config, {
            address: CONTRACT_ADDRESS,
            abi: AidChainAbi,
            functionName: 'aidRequests',
            args: [addr],
          });

          return {
            recipient: addr,
            reason: req[1],
            timestamp: Number(req[2]),
            approved: req[3],
            claimed: req[4],
            location: req[5],
            name: req[6],
            contact: req[7],
          };
        })
      );

      setFullAidRequests(detailedRequests);
    };

    fetchDetails();
  }, [aidRequestsList.data]);

   const recipientNFTBalance = useReadContract({
      address: import.meta.env.VITE_BADGE_CONTRACT as `0x${string}`,
      abi: BadgeNFTAbi, // import your AidBadgeNFT ABI
      functionName: 'balanceOf',
      args: userAddress ? [userAddress] : undefined,
      query: { enabled: !!userAddress },
    });

  const loading =
    totalDonated.isLoading ||
    aidRequestsList.isLoading ||
    userReq.isLoading ||
    isApproved.isLoading ||
    hasClaimed.isLoading ||
    hasDonated.isLoading;

  const contractState: ContractState = useMemo(() => ({
    totalDonated: totalDonated.data ? String(Number(totalDonated.data) / 1e18) : '0',
    donations: donationsData as Donation[], // ✅ fixed so always array
    aidRequests: fullAidRequests,
    aidAmount: aidAmount.data ? String(Number(aidAmount.data) / 1e18) : '0',
    activeRecipient: activeRecipient.data as string, // ✅ added activeRecipient
    userHasApplied:
      !!(userReq.data as AidRequest)?.recipient &&
      (userReq.data as AidRequest)?.recipient !== '0x0000000000000000000000000000000000000000',
    userHasDonated: Boolean(hasDonated.data),
    userIsApproved: Boolean(isApproved.data),
    userHasClaimed: Boolean(hasClaimed.data),
    userHasDonorNFT: Boolean(hasDonorNFT.data),
    recipientNFTBalance: Number(recipientNFTBalance.data || 0),
  }), [
    totalDonated.data,
    donationsData,
    fullAidRequests,
    aidAmount.data,
    activeRecipient.data,
    userReq.data,
    isApproved.data,
    hasClaimed.data,
    hasDonated.data,
    hasDonorNFT.data,
  ]);

  // ===== WRITE ACTIONS =====
  const donate = async (_: string, amount: string) =>
    await writeContract(config, {
      abi: AidChainAbi,
      address: CONTRACT_ADDRESS,
      functionName: 'donate',
      args: [], //  No arguments passed
      account: userAddress,
      value: parseEther(amount),
      chain: config.chains[0],
    });

  // to apply for aid - recipient only
  const applyForAid = async (
    reason: string,
    location: string,
    name: string,
    contact: string
  ) =>
    await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'applyForAid',
      args: [reason, location, name, contact],
      account: userAddress!,
      chain: config.chains[0],
    });

  // to approve a recipient for aid - admin & NFA
  const approveRecipient = async (recipient: string) =>
    await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'approveRecipient',
      args: [recipient],
      account: userAddress!,
      chain: config.chains[0],
    });

  // to reject a recipient for aid - admin only
  const rejectRecipient = async (recipient: string) =>
    await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'rejectRecipient',
      args: [recipient],
      account: userAddress!,
      chain: config.chains[0],
    });

  // to claim aid after being approved
  const claimAid = async () =>
    await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'claimAid',
      account: userAddress!,
      chain: config.chains[0],
    });

  // to mint donor NFT - donor only
  // This function mints a donor NFT to the connected wallet address.
  const mintDonorNFT = async (donorAddress: string) =>
    await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'mintDonorNFT',
      args: [donorAddress],
      account: userAddress!,
      chain: config.chains[0],
    });

  // This function mints a recipient NFT to the specified recipient address.
  // It is used by the admin to mint NFTs for approved recipients.
  const mintRecipientNFT = async (recipientAddress: string) =>
    await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'mintRecipientNFT',
      args: [recipientAddress],
      account: userAddress!,
      chain: config.chains[0],
    });

  // to reset after the user has applied
  const resetCycle = async () =>
    await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'resetCycle',
      account: userAddress!,
      chain: config.chains[0],
    });


  return {
    contractState,
    loading,
    donate,
    applyForAid,
    approveRecipient,
    rejectRecipient,
    claimAid,
    mintDonorNFT,
    mintRecipientNFT,
    resetCycle,
    recipientNFTBalance: Number(recipientNFTBalance || 0)
  };
};
