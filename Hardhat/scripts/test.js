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

    const Token = await ethers.getContractFactory("0xC0c150707a8C72f9F7277c4649685C0F22731c0a"); // Replace with your ERC20 token contract
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

  it("should set the correct values in the constructor", async function () {
    expect(await stakingPool.token()).to.equal(token.address);
    expect(await stakingPool.MINIMUM_STAKING_TIME()).to.equal(MINIMUM_STAKING_TIME);
    expect(await stakingPool.FIXED_APY()).to.equal(FIXED_APY);
    expect(await stakingPool.getOwner()).to.equal(owner.address);
  });
});
