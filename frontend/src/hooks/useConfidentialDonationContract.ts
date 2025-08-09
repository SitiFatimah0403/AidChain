import ConfidentialDonations from '../contracts/ConfidentialDonations.json';
import {
  usePublicClient,
  useWalletClient,
  useReadContract,
  useAccount,
} from 'wagmi';
import { sapphireTestnet } from 'viem/chains'; // ✅ from viem, not wagmi
import { Address, parseEther } from 'viem';
import { wrapWalletClient } from '@oasisprotocol/sapphire-viem-v2';
// ✅ Use Sapphire-wrapped ABI (important for confidential tx)
import * as sapphire from '@oasisprotocol/sapphire-wagmi-v2';



const abi = ConfidentialDonations.abi;
const CONTRACT_ADDRESS = import.meta.env
  .VITE_CONFIDENTIAL_DONATION_CONTRACT as Address;

export const useConfidentialDonationContract = () => {
  // ✅ These are already wrapped because we set `replaceProviders: true` in wagmisetup.ts
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
    chainId: sapphireTestnet.id,
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
      chain: sapphireTestnet,
    });

    return txHash;
  };

  // ✅ WRITE: Confidential donation (Sapphire encrypted)
const confidentialDonate = async (recipient: Address, amount: string) => {
  const client = await walletClient.data;
  if (!client) throw new Error('Wallet not connected');

  // Wrap the WalletClient with Sapphire encryption
  const encryptedClient = await wrapWalletClient(client);

  const txHash = await encryptedClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'confidentialDonate',
    args: [recipient],
    value: parseEther(amount),
    account: client.account,
    chain: sapphireTestnet,
  });

  return txHash;
};

  return {
    sendDonation,
    confidentialDonate,
    donations,
    isLoadingDonations: isLoading,
    donationError: error,
  };
};
