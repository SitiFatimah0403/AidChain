import { useAccount, useReadContract } from 'wagmi';
import { writeContract, readContract } from '@wagmi/core';
import { parseEther } from 'viem';
import type { Abi } from 'viem';
import AidChainAbiJson from '@/contracts/AidChain.json';
import type { ContractState, Donation, AidRequest } from '@/types';
import { config } from '@/wagmisetup';
import { useMemo, useEffect, useState } from 'react';

const CONTRACT_ADDRESS = import.meta.env.VITE_AID_CONTRACT as `0x${string}`;
const AidChainAbi = AidChainAbiJson as unknown as Abi; // Cast the imported JSON ABI to the Abi type

// This custom hook provides functions to interact with the AidChain smart contract.
export const useContract = () => {
  const { address: userAddress } = useAccount();

  // Read hooks
  const totalDonated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'totalDonated', //call totalDonated function from the contract
  });

  const getDonations = useReadContract({
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

  const hasDonated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasDonated', //call hasDonated function from the contract
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  // Load full AidRequest details
  const [fullAidRequests, setFullAidRequests] = useState<AidRequest[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!Array.isArray(aidRequestsList.data)) return;
      const addresses = aidRequestsList.data as string[];

      const detailedRequests = await Promise.all(
        addresses.map(async (addr) => {
          const [req, approved, claimed] = await Promise.all([
  readContract(config, {
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'aidRequests',
    args: [addr],
  }) as Promise<AidRequest>,

  readContract(config, {
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'approvedRecipients',
    args: [addr],
  }) as Promise<boolean>,

  readContract(config, {
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasClaimedAid',
    args: [addr],
  }) as Promise<boolean>,
]);


          return {
            recipient: addr,
            reason: req.reason,
            timestamp: Number(req.timestamp),
            approved,
            claimed,
          };
        })
      );

      setFullAidRequests(detailedRequests);
    };

    fetchDetails();
  }, [aidRequestsList.data]);

  const loading =
    totalDonated.isLoading ||
    getDonations.isLoading ||
    aidRequestsList.isLoading ||
    userReq.isLoading ||
    isApproved.isLoading ||
    hasClaimed.isLoading ||
    hasDonated.isLoading;

  const contractState: ContractState = useMemo(() => ({
    totalDonated: totalDonated.data ? String(Number(totalDonated.data) / 1e18) : '0',
    donations: (getDonations.data ?? []) as Donation[],
    aidRequests: fullAidRequests,
    
    userHasApplied:
      !!(userReq.data as AidRequest)?.recipient &&
      (userReq.data as AidRequest)?.recipient !== '0x0000000000000000000000000000000000000000',
    userHasDonated: Boolean(hasDonated.data),
    userIsApproved: Boolean(isApproved.data),
    userHasClaimed: Boolean(hasClaimed.data),

  }), [
    totalDonated.data,
    getDonations.data,
    fullAidRequests,
    userReq.data,
    isApproved.data,
    hasClaimed.data,
    hasDonated.data,
  ]);

  // Write actions
  const donate = async (amount: string) =>
    await writeContract(config, {
      abi: AidChainAbi,
      address: CONTRACT_ADDRESS,
      functionName: 'donate', //send donation to the contract
      account: userAddress,
      value: parseEther(amount),
      chain: config.chains[0],
    });

    // to apply for aid - recipient only
  const applyForAid = async (
    reason: string,
    location: string,
    name:string,
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

    //to approve a recipient for aid - admin & NFA
  const approveRecipient = async (recipient: string) =>
    await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'approveRecipient',
      args: [recipient],
      account: userAddress!,
      chain: config.chains[0],
    });

    //to reject a recipient for aid - admin only
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
  };
};
