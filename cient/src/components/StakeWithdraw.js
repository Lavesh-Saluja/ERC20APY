const StakeWithdraw=({state}) => {

    const withdrawStake = async(event)=> {};
    return(
        <>
        <form onSubmit ={withdrawStake}>
            <label>Amount</label>
            <input type="number" id="amt" placeholder="Enter the amount to withdraw"></input>
            <label>StakeID</label>
            <input type="number" id="WithdrawID" placeholder="Enter the tokenID you want to withdraw from"></input>
            {/* <button type="submit" disabled={!state.contract}>Withdraw</button> */}
        </form>
        </>
    );
};

export default StakeWithdraw;