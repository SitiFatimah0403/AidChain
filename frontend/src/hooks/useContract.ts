import { useAccount, useReadContract } from 'wagmi';
import { writeContract, readContract, switchChain as coreSwitchChain, getChainId } from '@wagmi/core';
import { parseEther, type Abi, type Address } from 'viem';
import AidChainAbiJson from '@/contracts/AidChain.json';
import BadgeNFTAbiJson from '@/contracts/AidBadgeNFT.json';
import type { ContractState, Donation, AidRequest } from '@/types';
import { config } from '@/wagmisetup';
import { useMemo, useEffect, useState } from 'react';
import { sepolia } from 'wagmi/chains';

// ===== ENV ADDRESSES =====
const CONTRACT_ADDRESS = import.meta.env.VITE_AID_CONTRACT as `0x${string}`;
const BADGE_CONTRACT = import.meta.env.VITE_BADGE_CONTRACT as `0x${string}`;

const AidChainAbi = AidChainAbiJson.abi as Abi;
const BadgeNFTAbi = BadgeNFTAbiJson.abi as Abi;

// ===== Helper: force switch to Sepolia before any AidChain write =====
const ensureSepolia = async () => {
  const current = await getChainId(config);
  if (current !== sepolia.id) {
    await coreSwitchChain(config, { chainId: sepolia.id });
  }
};

// This custom hook provides functions to interact with the AidChain smart contract (Sepolia)
export const useContract = () => {
  const { address: userAddress } = useAccount();

  // ===== READ CONTRACTS (all pinned to Sepolia) =====
  const totalDonated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'totalDonated',
    chainId: sepolia.id,
  });

  const { data: donationsData = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'getDonations',
    chainId: sepolia.id,
  }) as { data: Donation[] | undefined };

  const aidRequestsList = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'getAidRequests',
    chainId: sepolia.id,
  });

  const userReq = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'aidRequests',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
    chainId: sepolia.id,
  });

  const isApproved = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'approvedRecipients',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
    chainId: sepolia.id,
  });

  const hasClaimed = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasClaimedAid',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
    chainId: sepolia.id,
  });

  const hasDonorNFT = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasDonorBadge',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
    chainId: sepolia.id,
  });

  const hasDonated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'hasDonated',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
    chainId: sepolia.id,
  });

  const aidAmount = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'AID_AMOUNT',
    chainId: sepolia.id,
  });

  const activeRecipient = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AidChainAbi,
    functionName: 'activeRecipient',
    chainId: sepolia.id,
  });

  // Badge NFT (assumed on Sepolia)
  const recipientNFTBalance = useReadContract({
    address: BADGE_CONTRACT,
    abi: BadgeNFTAbi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress as Address] : undefined,
    query: { enabled: !!userAddress },
    chainId: sepolia.id,
  });

  // ===== Load full AidRequest details (pin readContract to Sepolia) =====
  const [fullAidRequests, setFullAidRequests] = useState<AidRequest[]>([]);

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
            args: [addr as Address],
            chainId: sepolia.id,
          });

          // req tuple: [recipient, reason, timestamp, approved, claimed, location, name, contact]
          return {
            recipient: addr,
            reason: String((req as any)[1]),
            timestamp: Number((req as any)[2]),
            approved: Boolean((req as any)[3]),
            claimed: Boolean((req as any)[4]),
            location: String((req as any)[5]),
            name: String((req as any)[6]),
            contact: String((req as any)[7]),
          } as AidRequest;
        })
      );

      setFullAidRequests(detailedRequests);
    };

    fetchDetails();
  }, [aidRequestsList.data]);

  const loading =
    totalDonated.isLoading ||
    aidRequestsList.isLoading ||
    userReq.isLoading ||
    isApproved.isLoading ||
    hasClaimed.isLoading ||
    hasDonated.isLoading ||
    aidAmount.isLoading ||
    activeRecipient.isLoading ||
    recipientNFTBalance.isLoading;

  const contractState: ContractState = useMemo(
    () => ({
      totalDonated: totalDonated.data ? String(Number(totalDonated.data) / 1e18) : '0',
      donations: (donationsData as Donation[]) ?? [],
      aidRequests: fullAidRequests,
      aidAmount: aidAmount.data ? String(Number(aidAmount.data) / 1e18) : '0',
      activeRecipient:
        (activeRecipient.data as string) ?? '0x0000000000000000000000000000000000000000',
      userHasApplied:
        !!(userReq.data as any)?.recipient &&
        (userReq.data as any)?.recipient !== '0x0000000000000000000000000000000000000000',
      userHasDonated: Boolean(hasDonated.data),
      userIsApproved: Boolean(isApproved.data),
      userHasClaimed: Boolean(hasClaimed.data),
      userHasDonorNFT: Boolean(hasDonorNFT.data),
      recipientNFTBalance: Number(recipientNFTBalance.data || 0),
    }),
    [
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
      recipientNFTBalance.data,
    ]
  );

  // ===== WRITE ACTIONS (all force Sepolia) =====

  // Donor -> plain donate on AidChain (Sepolia)
  const donate = async (_: string, amount: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    await ensureSepolia();

    return await writeContract(config, {
      abi: AidChainAbi,
      address: CONTRACT_ADDRESS,
      functionName: 'donate',
      args: [],
      account: userAddress as Address,
      value: parseEther(amount),
      chain: sepolia,
    });
  };

  // Recipient -> apply for aid (Sepolia)
  const applyForAid = async (reason: string, location: string, name: string, contact: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    await ensureSepolia();

    return await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'applyForAid',
      args: [reason, location, name, contact],
      account: userAddress as Address,
      chain: sepolia,
    });
  };

  // Admin/NFA -> approve recipient (Sepolia)
  const approveRecipient = async (recipient: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    await ensureSepolia();

    return await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'approveRecipient',
      args: [recipient as Address],
      account: userAddress as Address,
      chain: sepolia,
    });
  };

  // Admin -> reject recipient (Sepolia)
  const rejectRecipient = async (recipient: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    await ensureSepolia();

    return await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'rejectRecipient',
      args: [recipient as Address],
      account: userAddress as Address,
      chain: sepolia,
    });
  };

  // Recipient -> claim aid (Sepolia)
  const claimAid = async () => {
    if (!userAddress) throw new Error('Wallet not connected');
    await ensureSepolia();

    return await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'claimAid',
      account: userAddress as Address,
      chain: sepolia,
    });
  };

  // Donor -> mint donor NFT (Sepolia)
  const mintDonorNFT = async (donorAddress: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    await ensureSepolia();

    return await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'mintDonorNFT',
      args: [donorAddress as Address],
      account: userAddress as Address,
      chain: sepolia,
    });
  };

  // Admin -> mint recipient NFT (Sepolia)
  const mintRecipientNFT = async (recipientAddress: string) => {
    if (!userAddress) throw new Error('Wallet not connected');
    await ensureSepolia();

    return await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'mintRecipientNFT',
      args: [recipientAddress as Address],
      account: userAddress as Address,
      chain: sepolia,
    });
  };

  // Admin -> reset cycle (Sepolia)
  const resetCycle = async () => {
    if (!userAddress) throw new Error('Wallet not connected');
    await ensureSepolia();

    return await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: AidChainAbi,
      functionName: 'resetCycle',
      account: userAddress as Address,
      chain: sepolia,
    });
  };

  return {
    contractState,
    loading,
    donate,              // Sepolia
    applyForAid,         // Sepolia
    approveRecipient,    // Sepolia
    rejectRecipient,     // Sepolia
    claimAid,            // Sepolia
    mintDonorNFT,        // Sepolia
    mintRecipientNFT,    // Sepolia
    resetCycle,          // Sepolia
    recipientNFTBalance: Number(recipientNFTBalance.data || 0),
  };
};


