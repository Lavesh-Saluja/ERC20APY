import './App.css';
import RewardWithdraw from './components/RewardWithdraw';
import StakeDeposit from './components/StakeDeposit';
import StakeWithdraw from './components/StakeWithdraw';

function App() {
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
