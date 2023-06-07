import React from 'react'

const StakeDeposit = ({state}) => {

    const depositStake = async(event)=>{
        
    };
    return(
        <>
        <form onSubmit={depositStake}>
            <label>Amount</label>
            <input type="number" id="amount" placeholder="Enter the amount"></input>
            <button type="submit" disabled={!state.contract}>Pay</button>
        </form>
        <div>{stake_id}</div>
        </>
    );
};

export default StakeDeposit;