import ConfidentialDonations from '../contracts/ConfidentialDonations.json';
import {usePublicClient,useWalletClient,useReadContract,useAccount,} from 'wagmi';
import { sapphireTestnet } from 'wagmi/chains';
import { Address, parseEther } from 'viem';

const abi = ConfidentialDonations.abi;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONFIDENTIAL_DONATION_CONTRACT as Address;

export const useConfidentialDonationContract = () => {
  const publicClient = usePublicClient({ chainId: sapphireTestnet.id });
  const walletClient = useWalletClient({ chainId: sapphireTestnet.id });
  const { address: userAddress } = useAccount();

  // ✅ READ: Get donation history
  const {
    data: donations,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getDonations',
    args: [userAddress!],
  }) as {
    data: readonly bigint[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  // ✅ WRITE: Public donation
  const sendDonation = async (to: Address, amount: bigint) => {
    const client = await walletClient.data;
    if (!client) throw new Error('Wallet not connected');

    const txHash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'donate',
      args: [to],
      value: amount,
      account: client.account,
    });

    return txHash;
  };

  // ✅ WRITE: Confidential donation
  const confidentialDonate = async (recipient: Address, amount: string) => {
    const client = await walletClient.data;
    if (!client) throw new Error('Wallet not connected');

    const txHash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'confidentialDonate',
      args: [recipient],
      value: parseEther(amount),
      account: client.account,
    });

    return txHash;
  };

  // ✅ Return all functions + state
  return {
    sendDonation,
    confidentialDonate,
    donations,
    isLoadingDonations: isLoading,
    donationError: error,
  };
};
