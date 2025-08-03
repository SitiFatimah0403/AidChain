/*
🔧 Purpose:
- Checks if the connected user has a badge.
- Allows minting a badge (e.g., as 'donor') if not already minted.
- Shows the user's badge role.

🔑 Uses:
-useAccount() from wagmi to get connected wallet address.
-useBadgeContract() (your custom hook) to interact with smart contract methods (mintBadge, checkBadgeStatus, etc.).

🔄 How it works:
-When user connects a wallet, useEffect checks if they have a badge.
-On button click, mintBadge() is called with the current wallet address and badge role.
-Badge info is updated and displayed (e.g., 'Your badge role: donor').

*/ 

import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useBadgeContract } from '../hooks/useBadgeContract';


const BadgeButton = () => { 
  const { address } = useAccount();
  const {
    mintBadge,
    hasBadge,
    badgeRole,
    checkBadgeStatus,
  } = useBadgeContract();

  // Check badge status when address changes
  useEffect(() => {
    if (address) checkBadgeStatus(address);
  }, [address]);

  // Handle minting badge
  const handleMint = async () => {
    try {
      await mintBadge(address!, 'donor');
      await checkBadgeStatus(address!);
    } catch (err) {
      console.error('Error minting badge:', err);
    }
  };

  return (
    <div>
      <p>🪪 Your badge role: <strong>{badgeRole || 'None'}</strong></p>
      <button onClick={handleMint} disabled={hasBadge}>
        {hasBadge ? '✅ Badge already minted' : '🎖️ Mint Badge'}
      </button>
    </div>
  );
};

export default BadgeButton;
