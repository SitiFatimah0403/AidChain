/*
🔧 Purpose:
-Encapsulates all contract interactions:
      -Writing: mintBadge()
      -Reading: hasBadge, badgeRoles
-Returns badge status + utility functions for UI use.

🔑 Uses:
-useWalletClient() to get signer for write transactions.
-usePublicClient() to read contract state.
-AidBadgeNFT.abi imported from your contract's JSON.
-sepolia from viem/chains.

🔄 How it works:
You pass an address, it:
-Reads whether the address has a badge.
-Reads what badge role they have.

When minting:
-Calls writeContract() using the wallet’s signer and waits for transaction confirmation.

*/
import { useEffect, useState } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { parseAbiItem, type Address } from 'viem';
import AidBadgeNFT from '../contracts/AidBadgeNFT.json';
import { sepolia } from 'viem/chains';

const BADGE_CONTRACT_ADDRESS = import.meta.env.VITE_BADGE_CONTRACT as Address; 

// Define the ABI for the badge contract
export const useBadgeContract = () => {
  const { data: walletClient } = useWalletClient(); // gives access to the connected wallet (e.g., MetaMask).
  const publicClient = usePublicClient(); //lets you interact with the blockchain RPC (e.g., for reading and confirming transactions).

  const [hasBadge, setHasBadge] = useState(false); // Whether the user has a badge
  const [badgeRole, setBadgeRole] = useState<string | null>(null);  // The role of the badge (e.g., 'donor', 'recipient')

  //This function allows you to mint a badge NFT to a given Ethereum address (to) for a specific role.
  const mintBadge = async (to: string, role: string) => {
    if (!walletClient) throw new Error('Wallet not connected');
    if (!walletClient.account) throw new Error('Wallet account not found');

    // Smart Contract Write Operation
    const txHash = await walletClient.writeContract({
      account: walletClient.account.address, // The address of the connected wallet
      address: BADGE_CONTRACT_ADDRESS, // The address of the badge contract
      abi: AidBadgeNFT.abi, // The ABI of the badge contract
      functionName: 'mintBadge', 
      args: [to as Address, role],
      chain: sepolia,
    });

    console.log('Transaction hash:', txHash);

    // Wait for transaction to be mined, meaning it has been confirmed on the blockchain
    await publicClient.waitForTransactionReceipt({ hash: txHash });
  };

  // Check if the user has a badge
  const checkBadgeStatus = async (address: string) => {
    if (!publicClient) return;

    const has = await publicClient.readContract({
      address: BADGE_CONTRACT_ADDRESS,
      abi: AidBadgeNFT.abi,
      functionName: 'hasBadge',
      args: [address as Address],
    });

    let role: string | null = null;

    if (has) {
      role = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: AidBadgeNFT.abi,
        functionName: 'badgeRoles',
        args: [address as Address],
      }) as string;
    }

    setHasBadge(has as boolean);
    setBadgeRole(role);
  };

  return {
    mintBadge,
    hasBadge,
    badgeRole,
    checkBadgeStatus,
  };
};
