import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";

import { Modal } from "react-responsive-modal";

// import CustomButton from "./CustomButton";
import SmallButtons from "./SmallButtons";
import useContracts from "../hooks/useContracts";
import ApproveButton from "./ApproveButton";
import { useStoreState } from "../store/globalStore";
import Swal from "sweetalert2";
import ConnectWeb3 from "./ConnectWeb3";


const GasModal: React.FunctionComponent = () => {
  const { connected } = useStoreState((state) => state);
  const { checkAllowanceMR, approveTokenMR, depositMR, withDrawMR, checkReward, checkBalanceMR, checkBalanceMS, approveToken, buyMR, checkUserInfo } = useContracts();

  const [open, setOpen] = useState(false);
  const [claimableReward, setReward] = useState('0');
  const [msBalance, setMSBalance] = useState('0');
  const [mrBalance, setMRBalance] = useState('0');
  const [mrDepositAmount, setDepositAmount] = useState('0');
  const [mrWithdrawAmount, setWithdrawAmount] = useState('0');
  const [mrBuyAmount, setBuyMRAmount] = useState('0');
  const [invitorAddress, setInvitorAddress] = useState('');
  const [userInfo, setUserInfo] = useState([]);

  const [selectedToken, setSelectedToken] = useState<"DAI" | "USDC" | "USDT">(
    "USDC"
  );

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    async function process() {
      try {
        await checkRewardOfClaim()
        const userInfoDetails: any = await checkUserInfo()
        console.log('userInfoDetails: ', userInfoDetails, parseFloat(userInfoDetails[0])/1e18)
        setUserInfo(userInfoDetails)
      } catch (error) {
        console.log(error)
      }
    }
    if(connected){
      process()
    }
  },  [connected])

  const checkRewardOfClaim = async () => {
    try {
      const reward = await checkReward();
      const mrBal = await checkBalanceMR();
      const msBal = await checkBalanceMS();
      setReward(reward);
      setMRBalance(mrBal)
      setMSBalance(msBal)
    } catch (error) {
      console.log('checkRewardOfClaim-error', error)
    }
  }

  const handleDepositAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(event.target.value);
  };

  const handleWithdrawAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawAmount(event.target.value);
  };

  const handleInvitorAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvitorAddress(event.target.value);
  };

  const handleBuyMRAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyMRAmount(event.target.value);
  };


  return (
    !connected ? ( <ConnectWeb3 /> ) : (
      <>
    <div className="checking-allowance">
      Claimable MS Reward: {parseFloat(claimableReward)/1e18} 
    </div>
    

    <div className="checking-allowance">
      Your current MS Balance: {parseFloat(msBalance)/1e18} 
    </div>

    <div className="checking-allowance">
      Your Stacked MR Balance: {parseFloat(userInfo[0])/1e18} 
    </div>

    <div className="checking-allowance">
      Your current MR Balance: {parseFloat(mrBalance)/1e18} 
    </div>

    <div
      className="approve-token-button"
      onClick={() => checkRewardOfClaim()}
    >
      Clieck here to Check Claimable Reward and Balance
    </div>

    <div
      className="approve-token-button"
      onClick={() => approveTokenMR()}
    >
      Approve MR
    </div>

    <input style={{height: '40px'}} onChange={handleDepositAmount} placeholder="Add Deposit MR amount"></input>
    
    {
      userInfo[2] == '0x0000000000000000000000000000000000000000' ? 
      <input style={{height: '40px'}} onChange={handleInvitorAddress} placeholder="Invitor Address"></input> :
      <input disabled style={{height: '40px'}} onChange={handleInvitorAddress} placeholder="Invitor Address" value={userInfo[2]}></input>
    }

    <div
      className="approve-token-button"
      onClick={() => depositMR(mrDepositAmount, invitorAddress)}
    >
      Deposit MR
    </div>

    <input style={{height: '40px'}} onChange={handleWithdrawAmount} placeholder="Add Withdraw MR amount"></input>

    <div
      className="approve-token-button"
      onClick={() => withDrawMR(mrWithdrawAmount)}
    >
      Withdraw MR
    </div>


    <div
      className="approve-token-button"
      onClick={() => approveToken()}
    >
      Approve USDT
    </div>

    <input style={{height: '40px'}} onChange={handleBuyMRAmount} placeholder="Add Buy MR amount"></input>

    <div
      className="approve-token-button"
      onClick={() => buyMR(mrBuyAmount)}
    >
      Buy MR
    </div>
    </>
  ));
};

export default GasModal;
