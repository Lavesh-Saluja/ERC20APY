const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("StakingPoolContract", function () {
  let StakingPoolContract;
  let stakingPool;
  let owner;
  let addr1;
  let addr2;
  let token;

  const FIXED_APY = 5;
  const MINIMUM_STAKING_TIME = 30 * 24 * 60 * 60; // 30 days

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("APYToken"); 
    token = await Token.deploy();

    StakingPoolContract = await ethers.getContractFactory("StakingPoolContract");
    stakingPool = await StakingPoolContract.deploy(token.address, FIXED_APY, MINIMUM_STAKING_TIME);
  });

  it("should allow depositing stake", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));

    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    expect(await token.balanceOf(stakingPool.address)).to.equal(ethers.utils.parseEther("10"));
  });

  it("should allow withdrawing stake after minimum staking time", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));
    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    // Increase time to pass the minimum staking time
    await network.provider.send("evm_increaseTime", [MINIMUM_STAKING_TIME + 1]);

    await stakingPool.withdrawStake(ethers.utils.parseEther("5"), 1);

    expect(await token.balanceOf(stakingPool.address)).to.equal(ethers.utils.parseEther("5"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("5"));
  });

  it("should not allow withdrawing stake before minimum staking time", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));
    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    await expect(stakingPool.withdrawStake(ethers.utils.parseEther("5"), 1)).to.be.revertedWith(
      "MINIMUM STAKING TIME is not passed"
    );
  });

  it("should allow withdrawing rewards", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));
    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    // Increase time to pass the minimum staking time
    await network.provider.send("evm_increaseTime", [MINIMUM_STAKING_TIME + 1]);

    await stakingPool.withdrawStake(ethers.utils.parseEther("5"), 1);

    await stakingPool.withdrawReward(ethers.utils.parseEther("2.5"));

    expect(await token.balanceOf(stakingPool.address)).to.equal(ethers.utils.parseEther("2.5"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("7.5"));
  });

  it("should not allow withdrawing more rewards than earned", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));
    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    // Increase time to pass the minimum staking time
    await network.provider.send("evm_increaseTime", [MINIMUM_STAKING_TIME + 1]);

    await stakingPool.withdrawStake(ethers.utils.parseEther("5"), 1);

    await expect(stakingPool.withdrawReward(ethers.utils.parseEther("7.5"))).to.be.revertedWith(
      "It is more than current reward earned."
    );
  });

  it("should update the minimum staking time by the owner", async function () {
    await stakingPool.updateMinimumStakingTime(60); // 60 days

    expect(await stakingPool.MINIMUM_STAKING_TIME()).to.equal(60 * 24 * 60 * 60);
  });

  it("should allow toggling instant withdrawal or monthly withdrawal by the owner", async function () {
    await stakingPool.toggleWithdrawlInstantOrMonthly();

    expect(await stakingPool.instant_withdrawl_allowed()).to.equal(true);
  });

  it("should return the correct stake amount", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));
    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    expect(await stakingPool.getStakeAmount(addr1.address, 1)).to.equal(ethers.utils.parseEther("10"));
  });

  it("should return the correct stake timestamp", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));
    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    const blockTimestamp = await ethers.provider.getBlock("latest").timestamp;
    expect(await stakingPool.getStakeTimestamp(addr1.address, 1)).to.equal(blockTimestamp);
  });

  it("should return the correct rewards withdrawable amount", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));
    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    // Increase time to pass the minimum staking time
    await network.provider.send("evm_increaseTime", [MINIMUM_STAKING_TIME + 1]);

    await stakingPool.withdrawStake(ethers.utils.parseEther("5"), 1);

    expect(await stakingPool.getRewardsWithdrawable(addr1.address)).to.equal(ethers.utils.parseEther("2.5"));
  });

  it("should return the correct total stakes count", async function () {
    await token.approve(stakingPool.address, ethers.utils.parseEther("10"));
    await stakingPool.depositStake(ethers.utils.parseEther("10"));

    expect(await stakingPool.getTotalStakesCount(addr1.address)).to.equal(1);
  });

  it("should allow changing the owner by the current owner", async function () {
    await stakingPool.changeOwner(addr2.address);

    expect(await stakingPool.getOwner()).to.equal(addr2.address);
  });

  it("should not allow changing the owner by a non-owner", async function () {
    await expect(stakingPool.connect(addr1).changeOwner(addr2.address)).to.be.revertedWith("Not the owner");
  });

  it("should allow setting the FIXED_APY by the owner", async function () {
    await stakingPool.set_FIXED_APY(10);

    expect(await stakingPool.get_FIXED_APY()).to.equal(10);
  });

  it("should not allow setting the FIXED_APY by a non-owner", async function () {
    await expect(stakingPool.connect(addr1).set_FIXED_APY(10)).to.be.revertedWith("Not the owner");
  });

  it("should set the correct values in the constructor", async function () {
    expect(await stakingPool.token()).to.equal(token.address);
    expect(await stakingPool.MINIMUM_STAKING_TIME()).to.equal(MINIMUM_STAKING_TIME);
    expect(await stakingPool.FIXED_APY()).to.equal(FIXED_APY);
    expect(await stakingPool.getOwner()).to.equal(owner.address);
  });
});


// describe ("StackingPoolContract", function(){
//   async function beforeEach (){
//   const tokenAddress = "0xC0c150707a8C72f9F7277c4649685C0F22731c0a";
//   const fixedAPY = 12;
//   const minDays = 30;

//   console.log(tokenAddress, fixedAPY, minDays);
//   }
//   beforeEach();
// })
// describe("StakingPool Contract", function () {
//   let StakingPoolContract;
//   let hardhatStakingPoolContract;
//   let owner;
//   let addr1;
//   let addr2;
//   let addrs;


//   beforeEach(async function(){
//     StakingPoolContract = await ether.getContractFactory(StakingPoolContract);
//     [owner,addr1,addr2,...addrs] = await ethers.getSigners();
//     hardhatStakingPoolContract = await StakingPoolContract.deploy();
//   });

//   describe ("Deployment",function(){
//     it("Should be the write owner", async function (){
//       expect (await hardhatStakingPoolContract.owner()).to.equal(owner.address)
//     });
//   });

//   describe ("Transactions",function(){
//     it("Should transfer tokens between accounts", async function(){
//       await hardhatStakingPoolContract.transfer(addr1.address,2);
//       const addr1Balance = await hardhatStakingPoolContract.getBalance(addr1.address);
//       expect(addr1Balance).to.equal(2);
//     });

//     it("Should fail if sender does not have enough tokens",async function(){
//       const intialOwnerBalance = await hardhatStakingPoolContract.getBalance(owner.address);
//       await expect (hardhatStakingPoolContract.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("Not enough tokens");
//     })
//   })
// })