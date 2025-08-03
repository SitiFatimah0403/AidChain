import { useAccount, useReadContract } from 'wagmi';
import { writeContract } from '@wagmi/core';
import { parseEther } from 'viem';
import type { Abi } from 'viem';
import AidChainAbiJson from '@/contracts/AidChain.json';
import type { ContractState, Donation, AidRequest } from '@/types';
import { config } from '@/wagmisetup'; 


const CONTRACT_ADDRESS = import.meta.env.VITE_AID_CONTRACT as `0x${string}`;
const AidChainAbi = AidChainAbiJson as unknown as Abi;

export const useContract = () => {
  const { address: userAddress } = useAccount();

  // ===== READ CONTRACTS =====
  const totalDonated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'totalDonated',
  });

  const getDonations = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'getDonations',
  });

  const aidRequestsList = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'getAidRequests',
  });

  const userReq = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'aidRequests',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const isApproved = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'approvedRecipients',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const hasClaimed = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasClaimedAid',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const hasDonated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasDonated',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    // ====Reading state====
    contractState: {
      totalDonated: totalDonated.data ? String(Number(totalDonated.data) / 1e18) : '0',
      donations: getDonations.data ?? [],
      aidRequests: ((aidRequestsList.data as string[] ?? [])).map((addr: string) => ({
        recipient: addr,
        reason: (userReq.data as AidRequest)?.reason ?? '',
        timestamp: (userReq.data as AidRequest)?.timestamp ? Number((userReq.data as AidRequest).timestamp) : 0,
        approved: isApproved.data ?? false,
        claimed: hasClaimed.data ?? false,
      })),
      userHasDonated: hasDonated.data ?? false,
      userHasApplied:
        !!(userReq.data as AidRequest)?.recipient &&
        (userReq.data as AidRequest)?.recipient !== '0x0000000000000000000000000000000000000000', //nanti tukar
      userIsApproved: isApproved.data ?? false,
      userHasClaimed: hasClaimed.data ?? false,
    },

    // ====Writing actions====== 
    donate: async (amount: string) =>
      await writeContract(config, {
      abi: AidChainAbi,
      address: CONTRACT_ADDRESS,
      functionName: 'donate',
      account: userAddress,
      value: parseEther(amount),
      chain: config.chains[0], //use sepolia chain je
    }),

    applyForAid: async (reason: string) =>
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: AidChainAbi,
        functionName: 'applyForAid',
        args: [reason],
        account: userAddress!,
        chain: config.chains[0],
      }),

    approveRecipient: async (recipient: string) =>
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: AidChainAbi,
        functionName: 'approveRecipient',
        args: [recipient],
        account: userAddress!,
        chain: config.chains[0], // Add the chain property
      }),

    claimAid: async () =>
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: AidChainAbi,
        functionName: 'claimAid',
        account: userAddress!,
        chain: config.chains[0],
      }),

    mintDonorNFT: async () =>
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: AidChainAbi,
        functionName: 'mintDonorNFT',
        args: [userAddress!],
        account: userAddress!,
        chain: config.chains[0],
      }),

    mintRecipientNFT: async () =>
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: AidChainAbi,
        functionName: 'mintRecipientNFT',
        args: [userAddress!],
        account: userAddress!,
        chain: config.chains[0],
      }),
  };
};
