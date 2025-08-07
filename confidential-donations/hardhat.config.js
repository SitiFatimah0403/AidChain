require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.28", 
  networks: {
    sapphireTestnet: {
      url: "https://testnet.sapphire.oasis.dev",
      accounts: [PRIVATE_KEY],
    },
  },
};
