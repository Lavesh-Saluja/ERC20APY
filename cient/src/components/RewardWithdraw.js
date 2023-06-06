import React from 'react'

const RewardWithdraw = ({state}) => {

    const withdrawReward = async(event)=>{};
    return(
        <>
        <form onSubmit={withdrawReward}>
            <label>Amount</label>
            <input type="number" id="amt1" placeholder="Enter the amount"></input>
            <button type="submit" disabled={!state.contract}>Withdraw</button>
        </form>
        </>
    );
};

export default RewardWithdraw;