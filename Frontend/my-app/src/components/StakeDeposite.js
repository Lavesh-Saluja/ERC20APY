import React from 'react'

const StakeDeposit = () => {

    const depositStake = async(event)=>{
        
    };
    return(
        <>
        <form onSubmit={depositStake}>
            <label>Amount</label>
            <input type="number" id="amount" placeholder="Enter the amount"></input>
            <button type="submit" >Pay</button>
        </form>
        <div>{}</div>
        </>
    );
};

export default StakeDeposit;