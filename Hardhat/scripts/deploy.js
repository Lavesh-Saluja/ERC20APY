// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

  const APYContract=await hre.ethers.getContractFactory("StakingPoolContract");
  // initial 10% monthly interest

  const tokenAddress = "0xC0c150707a8C72f9F7277c4649685C0F22731c0a";
  const fixedAPY = 12;
  const minDays = 30;
  const contract=await APYContract.deploy(tokenAddress,fixedAPY,minDays);
  await contract.deployed();

  console.log("Contract Address", contract.address);//0xEA62d0e0631a98F115bB6d71DE3145B9443F3413
  
   console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(40000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: "0xEA62d0e0631a98F115bB6d71DE3145B9443F3413",
      constructorArguments: [tokenAddress,fixedAPY,minDays],
    contract: "contracts/StakingPoolContract.sol:StakingPoolContract"
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});