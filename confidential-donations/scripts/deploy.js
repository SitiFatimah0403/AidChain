const hre = require("hardhat");

async function main() {
  const ConfidentialDonations = await hre.ethers.getContractFactory("ConfidentialDonations");
  const contract = await ConfidentialDonations.deploy();

  // Wait for deployment to be mined
  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log("Contract deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
