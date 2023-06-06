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

  const TokenContract=await hre.ethers.getContractFactory("APYToken");


  const contract=await TokenContract.deploy();
  await contract.deployed();

    console.log("Contract Address", contract.address);//0xC0c150707a8C72f9F7277c4649685C0F22731c0a
    

    console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(40000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: "0xC0c150707a8C72f9F7277c4649685C0F22731c0a",
      constructorArguments: [],
    contract: "contracts/APYToken.sol:APYToken"
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