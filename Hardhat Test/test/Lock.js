const {expect} =require ("chai");
const { utils } = require("ethers");
describe("Greeter", function () {

  it("Checking deployment", async () => {
    const [owner, acc1] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", );
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    console.log('------------------------------------');
    console.log(tokenAddress);
    console.log('------------------------------------');
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    // expect((FIXED_APY).toString()).to.equal((await stakeContract.get_FIXED_APY()).toString());
    // console.log(await stakeContract.MINIMUM_STAKING_TIME());
    // expect(((MINIMUM_STAKING_TIME*24*60*60).toString()).toString()).to.equal((await stakeContract.MINIMUM_STAKING_TIME()).toString());
    // expect((ownerAddress)).to.equal(await stakeContract.getOwner());
       expect("50.0").to.equal((ethers.utils.formatUnits(await tokenContract.balanceOf(ownerAddress))).toString());
      

  })

  it("Should Stake token", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();

    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 * 24 * 60 * 60; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
    await stakeContract.depositStake(ethers.utils.parseUnits("10"));
    const contractBalance = (ethers.utils.formatUnits(await tokenContract.balanceOf(stakeAddress)).toString());
    expect(contractBalance).to.equal("10.0");
  });
});

