const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const {ethers} = require("hardhat");

console.log(expect);


describe ("StakingPoolContract", function(){

  async function beforeEach (){
  const tokenAddress = "0xC0c150707a8C72f9F7277c4649685C0F22731c0a";
  const fixedAPY = 12;
  const minDays = 30;

  const [owner, user1] = await ethers.getSigners(); 

  const StakingPoolContract = await ethers.getContractFactory("StakingPoolContract");
  const stakingPoolContract = await StakingPoolContract.deployed(tokenAddress,fixedAPY, minDays);

  console.log(stakingPoolContract, tokenAddress, fixedAPY, minDays, owner, user1);
  return {stakingPoolContract, tokenAddress, fixedAPY, minDays, owner, user1};

  }

  describe("Deployment",function(){
    //Checking variables on deployment
    it ("Should check the fixedapy", async function(){
      const {stakingPoolContract, fixedAPY} = await loadFixture(beforeEach);

      expect(await stakingPoolContract.FIXED_APY()).to.equal(fixedAPY);
    });

    it("Should be the write correct owner", async function (){
      const {stakingPoolContract, owner} = await loadFixture(runEveryTime);
      
      expect (await stakingPoolContract.owner()).to.equal(owner.address)
    });

    it ("Should check minimum stacking time", async function(){
      const {stakingPoolContract, minDays} = await loadFixture(runEveryTime);

      expect (await (stakingPoolContract.minDays)* 24 * 60 * 60).to.equal(MINIMUM_STAKING_TIME);
    });

  });

  beforeEach();

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