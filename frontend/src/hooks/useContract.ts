import { useAccount } from 'wagmi';
import { useContractRead, useContractWrite } from 'wagmi';
import { useTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import ABI from '../abi/AidChain.json'; // or relative path
import type { ContractState } from '../types';

const CONTRACT_ADDRESS = '0x1234…'; // your deployed address

export const useContract = (userAddress?: `0x${string}`) => {
  // Reads
  const totalDonated = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalDonated',
    watch: true,
  });

  const getDonations = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getDonations',
    watch: true,
  });

  const aidRequestsList = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAidRequests',
    watch: true,
  });

  const userReq = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'aidRequests',
    args: [userAddress!],
    enabled: Boolean(userAddress),
    watch: true,
  });

  const hasDonated = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'hasDonated',
    args: [userAddress!],
    enabled: Boolean(userAddress),
    watch: true,
  });

  const isApproved = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'approvedRecipients',
    args: [userAddress!],
    enabled: Boolean(userAddress),
    watch: true,
  });

  const hasClaimed = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'hasClaimedAid',
    args: [userAddress!],
    enabled: Boolean(userAddress),
    watch: true,
  });

  // Writes
  const donate = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'donate',
  });
  const apply = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'applyForAid',
  });
  const approve = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'approveRecipient',
  });
  const claim = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'claimAid',
  });
  const mintDonor = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'mintDonorNFT',
    args: [userAddress!],
  });
  const mintRecipient = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'mintRecipientNFT',
    args: [userAddress!],
  });

  // Track status
  const donateReceipt = useTransactionReceipt({ hash: donate.data?.hash });
  const applyReceipt = useTransactionReceipt({ hash: apply.data?.hash });
  const approveReceipt = useTransactionReceipt({ hash: approve.data?.hash });
  const claimReceipt = useTransactionReceipt({ hash: claim.data?.hash });
  const mintDonorReceipt = useTransactionReceipt({ hash: mintDonor.data?.hash });
  const mintRecipientReceipt = useTransactionReceipt({ hash: mintRecipient.data?.hash });

  // Derived contract state
  const contractState: ContractState = {
    totalDonated: totalDonated.data ? String(Number(totalDonated.data) / 1e18) : '0',
    donations: (getDonations.data ?? []) as any,
    aidRequests: (aidRequestsList.data ?? []).map((addr: string) => {
      const req = userReq.data;
      return {
        recipient: addr,
        reason: req?.reason ?? '',
        timestamp: req?.timestamp ? Number(req.timestamp) : 0,
        approved: isApproved.data ?? false,
        claimed: hasClaimed.data ?? false,
      };
    }),
    userHasDonated: hasDonated.data ?? false,
    userHasApplied: Boolean(userReq.data?.recipient && userReq.data.recipient !== '0x0000000000000000000000000000000000000000'),
    userIsApproved: isApproved.data ?? false,
    userHasClaimed: hasClaimed.data ?? false,
  };

  return {
    contractState,
    loading: totalDonated.isLoading || getDonations.isLoading || aidRequestsList.isLoading,
    donate: (amount: string) => donate.write?.({ value: parseEther(amount) }),
    donateLoading: donate.isLoading || donateReceipt.isLoading,
    applyForAid: (reason: string) => apply.write?.({ args: [reason] }),
    applyLoading: apply.isLoading || applyReceipt.isLoading,
    approveRecipient: (addr: string) => approve.write?.({ args: [addr] }),
    approveLoading: approve.isLoading || approveReceipt.isLoading,
    claimAid: () => claim.write?.(),
    claimLoading: claim.isLoading || claimReceipt.isLoading,
    mintDonorNFT: () => mintDonor.write?.(),
    mintDonorLoading: mintDonor.isLoading || mintDonorReceipt.isLoading,
    mintRecipientNFT: () => mintRecipient.write?.(),
    mintRecipientLoading: mintRecipient.isLoading || mintRecipientReceipt.isLoading,
  };
};
