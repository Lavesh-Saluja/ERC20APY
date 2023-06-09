const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("StakingPool Contract", function () {
  let StakingPoolContract;
  let hardhatStakingPoolContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;


  beforeEach(async function(){
    StakingPoolContract = await ether.getContractFactory(StakingPoolContract);
    [owner,addr1,addr2,...addrs] = await ethers.getSigners();
    hardhatStakingPoolContract = await StakingPoolContract.deploy();
  });

  describe ("Deployment",function(){
    it("Should be the write owner", async function (){
      expect (await hardhatStakingPoolContract.owner()).to.equal(owner.address)
    });
  });

  describe ("Transactions",function(){
    it("Should transfer tokens between accounts", async function(){
      await hardhatStakingPoolContract.transfer(addr1.address,2);
      const addr1Balance = await hardhatStakingPoolContract.getBalance(addr1.address);
      expect(addr1Balance).to.equal(2);
    });

    it("Should fail if sender does not have enough tokens",async function(){
      const intialOwnerBalance = await hardhatStakingPoolContract.getBalance(owner.address);
      await expect (hardhatStakingPoolContract.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("Not enough tokens");
    })
  })
})