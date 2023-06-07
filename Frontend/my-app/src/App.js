import './App.css';
import StakeDeposit from './components/StakeDeposite';
import { Contract, providers, utils } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { APYCONTRACT_ADDRESS,abiAPY,abiTOKEN,TOKEN_CONTRACT_ADDRESS } from "./constants";
function App() {
  const [walletConnected, setWalletConnected] = useState(false);  
  const [amountStake, setAmountStake] = useState(0);
  const [amountWithdraw, setAmountWithdraw] = useState(0);
  const [stakeId, setStakeId] = useState(0);
  const [rewardEarned, setRewardEarned] = useState(0);
  const [loading,setLoading]=useState(false);
  const web3ModalRef = useRef();


    const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };
const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 97) {
      window.alert("Change the network to Binance");
      throw new Error("Change network to Binance");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
};
  
  
  async function depositeStake() {
    if (amountStake <= 0) {
      window.alert("Enter a valid amount");
    }
    else {
      try {
        const signer = await getProviderOrSigner(true);
        const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, abiTOKEN, signer);
        const amountWei = utils.parseEther(amountStake.toString());
        console.log(amountWei);
        let tx = await tokenContract.approve(
          APYCONTRACT_ADDRESS,
          amountWei.toString()
        );
      setLoading(true);
      await tx.wait();
        tx=await APYcontract.depositStake(amountWei);
        await tx.wait();
        setLoading(false);
      window.alert("Transaction successful");
        
      } catch (e) {
        console.log(e);
      }
    
      
    }

  }
  
  async function withdraw() {
    if (Number(stakeId) > 0 && Number(amountWithdraw) > 0) {
      try {
        const signer = await getProviderOrSigner(true);
        const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
        const amountWei = utils.parseEther(amountWithdraw.toString());
        console.log(amountWei);
        const tx = await APYcontract.withdrawStake(amountWei, stakeId);
        setLoading(true);
        await tx.wait();
        setLoading(false);
        window.alert("Transaction successful");
      } catch (e) {
        console.log(e);
      }
    }
    else {
      window.alert("Enter valid Amount");
    }
  }
  
  useEffect(() => {
    if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  },[walletConnected]);


  const renderButton = () => {
    if (!walletConnected) {
      return (
        <>
         <button onClick={connectWallet}>Connect Wallet</button>
        </>
       
    )
    }
}

  return (
    <div>
      {renderButton()}
      <input onChange={(e) => { setAmountStake(e.target.value); console.log(amountStake) }}></input>
      <button onClick={depositeStake} disabled={loading}>{loading ? "loading..." : "stake"}</button> <br /> 
      <input placeholder="Stake Id" onChange={(e) =>{setStakeId(e.target.value);console.log(stakeId) }} />
       <input placeholder="Withdraw Amount" onChange={(e) => { setAmountWithdraw(e.target.value); console.log(amountWithdraw) }}></input>
       <button placeholder="Withdraw Amount" onClick={withdraw} disabled={loading}>{loading?"loading...":"withdraw"}</button>
      
    </div>
  );
}

export default App;
