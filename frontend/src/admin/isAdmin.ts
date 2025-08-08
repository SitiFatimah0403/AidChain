//Handle logic for checking if a wallet is an admin

// Function to get admin addresses from environment variable
/*export const getAdminAddresses = (): string[] => {
const envValue = import.meta.env.VITE_ADMIN_WALLETS_FATIMAH; //fatimah je boleh tgk buat masa ni
//const envValue = import.meta.env.VITE_ADMIN_WALLETS; //FOR TESTING

  if (!envValue) return [];
  return envValue.split(',').map(addr => addr.trim().toLowerCase());
};*/


// Check if the given address is in the list of admin addresses
export const isAdmin = (address?: string): boolean => {
  if (!address) return false;
  const admins = getAdminAddresses();
  return admins.includes(address.toLowerCase());
};

//TEMP FOR TESTING! 
export const getAdminAddresses = (): string[] => {
  const envValue = "0x018eD13f8a0bA3CB6e50c14a4A39E7b3929BF53c"; // tester's wallet

  return envValue.split(',').map(addr => addr.trim().toLowerCase());
};

