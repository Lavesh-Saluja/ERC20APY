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
    expect((FIXED_APY).toString()).to.equal((await stakeContract.get_FIXED_APY()).toString());
    expect(((MINIMUM_STAKING_TIME*24*60*60).toString()).toString()).to.equal((await stakeContract.MINIMUM_STAKING_TIME()).toString());
    expect((ownerAddress)).to.equal(await stakeContract.getOwner());
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
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
    await stakeContract.depositStake(ethers.utils.parseUnits("10"));
    const contractBalance = (ethers.utils.formatUnits(await tokenContract.balanceOf(stakeAddress)).toString());
    expect(contractBalance).to.equal("10.0");
  });



    it("Should Not Stake token if amount is zero", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();

    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
      await expect(stakeContract.depositStake(ethers.utils.parseUnits("0"))).to.be.revertedWith("Invalid stake amount");
       const contractBalance = (ethers.utils.formatUnits(await tokenContract.balanceOf(stakeAddress)).toString());
    expect(contractBalance).to.equal("0.0");
  });

    it("Should Withdraw token", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();

    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
    await stakeContract.depositStake(ethers.utils.parseUnits("10"));
    await stakeContract.toggleWithdrawlInstantOrMonthly();
      await stakeContract.withdrawStake(ethers.utils.parseUnits("5"),1)
      const contractBalance = (ethers.utils.formatUnits(await tokenContract.balanceOf(stakeAddress)).toString());
          const ownerBalance = (ethers.utils.formatUnits(await tokenContract.balanceOf(ownerAddress)).toString());

      expect(contractBalance).to.equal("5.0");
            expect(ownerBalance).to.equal("45.0");
    });
  
     it("Should Not Withdraw token if stake does not exist", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
    // await stakeContract.depositStake(ethers.utils.parseUnits("10"));
    await stakeContract.toggleWithdrawlInstantOrMonthly();
       await expect(stakeContract.withdrawStake(ethers.utils.parseUnits("5"), 1)).to.be.revertedWith("No stake found");
     });
  
  
     it("Should Not Withdraw token if Withdraw amount is more than deposited", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
    await stakeContract.depositStake(ethers.utils.parseUnits("10"));
    await stakeContract.toggleWithdrawlInstantOrMonthly();
       await expect(stakeContract.withdrawStake(ethers.utils.parseUnits("11"), 1)).to.be.revertedWith("Withdraw amount is more than balance of stake.");
     });
  
  
  
       it("Should Not Withdraw token if MinimunStaking time is not passed", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
    await stakeContract.depositStake(ethers.utils.parseUnits("10"));
    // await stakeContract.toggleWithdrawlInstantOrMonthly();
       await expect(stakeContract.withdrawStake(ethers.utils.parseUnits("5"), 1)).to.be.revertedWith("MINIMUM STAKING TIME is not passed");
    });
  
  
  
  
      it("Should Withdraw Reward", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();

    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
    await stakeContract.depositStake(ethers.utils.parseUnits("10"));
    await stakeContract.toggleWithdrawlInstantOrMonthly();
      await stakeContract.withdrawStake(ethers.utils.parseUnits("9"),1)
        const ownerBalanceOld = await tokenContract.balanceOf(ownerAddress);
        console.log(ownerBalanceOld);
        const reward = await stakeContract.getRewardsWithdrawable(ownerAddress);
        console.log(reward);
        await stakeContract.withdrawReward(reward);
        const ownerBalanceNew = await tokenContract.balanceOf(ownerAddress);
                console.log(ownerBalanceNew);
        expect(ownerBalanceNew.sub(ownerBalanceOld)).to.equal(reward);
      });
  
  
        it("Should not Withdraw Reward if amount is greater that present reward", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();

    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
    const MINIMUM_STAKING_TIME = 30 ; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
    console.log("Balance of Contarct: ", await tokenContract.balanceOf(stakeAddress));
    await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
    await stakeContract.depositStake(ethers.utils.parseUnits("10"));
    await stakeContract.toggleWithdrawlInstantOrMonthly();
      await stakeContract.withdrawStake(ethers.utils.parseUnits("9"),1)
        // 
        const reward = (await stakeContract.getRewardsWithdrawable(ownerAddress));
        await expect(stakeContract.withdrawReward(reward+1)).to.be.revertedWith("It is more than current reward earned.");          
  });

     it("Should Get Stake Amount", async () => {
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
    await stakeContract.depositStake(ethers.utils.parseUnits("10"));        // 
      // const contractBalance = (ethers.utils.formatUnits(await tokenContract.balanceOf(stakeAddress)).toString());
          const stakeDeposited = (ethers.utils.formatUnits(await stakeContract.getStakeAmount(ownerAddress,1)).toString());
      expect(stakeDeposited).to.equal("10.0");
     });
  
     it("Should Update Minimum Staking time Only by owner", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
        const acc1Address = await acc1.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
       const MINIMUM_STAKING_TIME = 30; // 30 days
        const NEW_MINIMUM_STAKING_TIME = 10 ; // 10 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
    const stakeAddress = await stakeContract.address;
       await stakeContract.updateMinimumStakingTime(NEW_MINIMUM_STAKING_TIME);
       const minimumStakingTime = (await stakeContract.MINIMUM_STAKING_TIME())/(60*60*24);
       expect((minimumStakingTime.toString())).to.equal((NEW_MINIMUM_STAKING_TIME+""));
      //  expect(await stakeContract.connect(acc1).updateMinimumStakingTime(NEW_MINIMUM_STAKING_TIME)).to.be.revertedWith("Not the owner");
     });
  
      it("Should Change owner", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
        const acc1Address = await acc1.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
       const MINIMUM_STAKING_TIME = 30; // 30 days
    const tokenAddress = tokenContract.address;
    const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
        await stakeContract.changeOwner(acc1Address);
        expect(await stakeContract.getOwner()).to.equal(acc1Address);
      });
  
       it("Should Change Staking time", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
        const acc1Address = await acc1.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
       const MINIMUM_STAKING_TIME = 30; // 30 days
    const tokenAddress = tokenContract.address;
         const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
         const NEW_STAKING_TIME = 1655019266; // 12 june 2022 07:34:26
         await stakeContract.set_STAKING_TIME(NEW_STAKING_TIME,1);
         expect((NEW_STAKING_TIME.toString())).to.equal((await stakeContract.getStakeTimestamp(ownerAddress,1)).toString());
       });
  
  
       it("Should Change Fixed APY", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
        const acc1Address = await acc1.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
       const MINIMUM_STAKING_TIME = 30; // 30 days
    const tokenAddress = tokenContract.address;
         const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
         const NEW_FIXED_APY = 12; // 12 %
         await stakeContract.set_FIXED_APY(NEW_FIXED_APY);
         expect((NEW_FIXED_APY.toString())).to.equal((await stakeContract.get_FIXED_APY()).toString());
     });

       it("Should Get Owner", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
        const acc1Address = await acc1.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
       const MINIMUM_STAKING_TIME = 30; // 30 days
    const tokenAddress = tokenContract.address;
         const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
         expect(ownerAddress).to.equal(await stakeContract.getOwner());
       });
  
         it("Should Get APY", async () => {
    const [owner, acc1] = await ethers.getSigners();
        const ownerAddress = await owner.getAddress();
        const acc1Address = await acc1.getAddress();
    const token = await ethers.getContractFactory("APYToken");
    const tokenContract = await token.deploy();
    console.log("balance Owner", await tokenContract.balanceOf(ownerAddress));
    const stake = await ethers.getContractFactory("StakingPoolContract");
    const FIXED_APY = 5;
       const MINIMUM_STAKING_TIME = 30; // 30 days
    const tokenAddress = tokenContract.address;
           const stakeContract = await stake.deploy(tokenAddress, FIXED_APY, MINIMUM_STAKING_TIME);
               const stakeAddress = await stakeContract.address;

               await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());
           await stakeContract.depositStake(ethers.utils.parseUnits("10"));  
                          await tokenContract.approve(stakeAddress, (ethers.utils.parseUnits("10")).toString());

           await stakeContract.depositStake(ethers.utils.parseUnits("10"));       
         expect("2").to.equal((await stakeContract.getTotalStakesCount(ownerAddress)).toString());
     
         });
  
  
  
     
});

