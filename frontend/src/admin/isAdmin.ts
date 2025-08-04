//Handle logic for checking if a wallet is an admin

// Function to get admin addresses from environment variable
export const getAdminAddresses = (): string[] => {
  const envValue = import.meta.env.VITE_ADMIN_WALLETS_FATIMAH; //fatimah je boleh tgk buat masa ni
  if (!envValue) return [];
  return envValue.split(',').map(addr => addr.trim().toLowerCase());
};

// Check if the given address is in the list of admin addresses
export const isAdmin = (address?: string): boolean => {
  if (!address) return false;
  const admins = getAdminAddresses();
  return admins.includes(address.toLowerCase());
};
