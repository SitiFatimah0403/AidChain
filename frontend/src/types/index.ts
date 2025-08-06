export interface Donation {
  donor: string;
  recipient: string;
  amount: string;
  timestamp: number;
}

export interface AidRequest {
  recipient: string;
  reason: string;
  timestamp: number;
  approved: boolean;
  claimed: boolean;
  location: string;
  name: string;
  contact: string;
}



export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
}

export interface ContractState {
  totalDonated: string;
  donations: Donation[];
  aidRequests: AidRequest[];
  userHasDonated: boolean;
  userHasApplied: boolean;
  userIsApproved: boolean;
  userHasClaimed: boolean;
}
