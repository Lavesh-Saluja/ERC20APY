import './App.css';
import RewardWithdraw from './components/RewardWithdraw';
import StakeDeposit from './components/StakeDeposit';
import StakeWithdraw from './components/StakeWithdraw';

import {useState,useEffect} from 'react';
// import abi from "./contracts/";
import {ethers} from "ethers";

function App() {
  const [state,setState]=useState({//state set as null 
    provider:null,
    signer:null,
    contarct:null,
  });

  const [account, setAccount]=useState("None");
  useEffect(() => {
    const connectWallet = async () => {
    const contractAddress = "0x835189fa0e82a06549c030341949d2cec40b04fb"; //contarct address
    const contractABI = abi.abi;// contract abi 
    try{
      const {ethereum}=window;

      if (ethereum){
      const account = await ethereum.request({method:"eth_requestAccounts",})// metamask code
      
      window.ethereum.on("chainChanged",()=> {
        window.location.reload();
      })  

      window.ethereum.on("accountsChanged",()=> {
        window.location.reload();
      })  

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress,contractABI,signer);// creating a instance of contact using provider and signer
      setState({provider,signer,contract})// set new state
      setAccount(account);
      } else {
        alert("Please install metamask");
      }
    }catch(error){
      console.log(error);
    }
  };
  connectWallet(); //calling connectWallet to run 
  }, []);
  return (
    <div className="App">
      {/* <p>Connected Account -{account}</p> */}
      <p>Connected Account</p>
      <StakeDeposit state={state}></StakeDeposit>
      <StakeWithdraw state={state}></StakeWithdraw>
      <RewardWithdraw state={state}></RewardWithdraw>
    </div>
  );
}

export default App;
