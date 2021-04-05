import smartMr from "../contracts/smartMr.json";
import MS_KOVAN from "../contracts/MS_KOVAN.json";
import MR_KOVAN from "../contracts/MR_KOVAN.json";
import { useStoreState, useStoreActions } from "../store/globalStore";
import Swal from "sweetalert2";
import { BigNumber } from "bignumber.js";

const useContracts = () => {
  const { web3, account } = useStoreState((state) => state);
  const { setShouldUpdate } = useStoreActions((actions) => actions);

  const getSmartMr = () => {
    try {
      return new web3.eth.Contract(
        smartMr.abi,
        smartMr.address
      );
    } catch (error) {
      
    }
  };

  const geMRToken = () => {
    try {
      return new web3.eth.Contract(
        MR_KOVAN.abi,
        MR_KOVAN.address
      );
    } catch (error) {
      
    }
};

const getMSToken = () => {
  try {
    return new web3.eth.Contract(
      MS_KOVAN.abi,
      MS_KOVAN.address
    );
  } catch (error) {
    
  }
};

const depositMR = async (balance: string, addressInvitor: string) => {
  try {
    let SmartMrInstance = getSmartMr();
    if(SmartMrInstance == undefined) {
      alert("Please Connect Metamask")
      return
    }
    console.log(parseFloat(balance)*1e18, addressInvitor, SmartMrInstance)
    SmartMrInstance.methods
      .depositMR(new BigNumber(balance).multipliedBy(1e18), addressInvitor)
      .send({
        from: account,
      })
      .on("error", function () {
        Swal.fire("reverted", "Tx has been cancelled by user", "error");
      })
      .on("transactionHash", function (hash: any) {
        Swal.fire("Success!", "Tx Submitted", "success");
      })
      .on("receipt", function (receipt: any) {
        setShouldUpdate(true);
      });
    
  } catch (error) {
    console.log('depositMR-Error: ', error)
  }
};

const withDrawMR = async (balance: string) => {
  try {
    let SmartMrInstance = getSmartMr();

    if(SmartMrInstance == undefined) {
      alert("Please Connect Metamask")
      return
    }
  
    SmartMrInstance.methods
      .withDrawMR(new BigNumber(balance).multipliedBy(1e18))
      .send({
        from: account,
      })
      .on("error", function () {
        Swal.fire("reverted", "Tx has been cancelled by user", "error");
      })
      .on("transactionHash", function (hash: any) {
        Swal.fire("Success!", "Tx Submitted", "success");
      })
      .on("receipt", function (receipt: any) {
        setShouldUpdate(true);
      });
    
  } catch (error) {
    console.log('withDrawMR-Error: ', error)
  }
};

  const approveToken = async (erc20token: "DAI" | "USDT" | "USDC") => {
    try {
      let maxValue =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
  
      let TokenContractInstance = geMRToken();
      if(TokenContractInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
  
      TokenContractInstance.methods
        .approve(smartMr.address, maxValue)
        .send({
          from: account,
        })
        .on("error", function () {
          Swal.fire("reverted", "Tx has been cancelled by user", "error");
        })
        .on("transactionHash", function (hash: any) {
          Swal.fire("Success!", "Allowance Tx Submitted", "success");
        })
        .on("receipt", function (receipt: any) {
          setShouldUpdate(true);
        });
      
    } catch (error) {
      console.log('approveToken-Error: ', error)
    }
  };

  const approveTokenMR = async () => {
    try {
      let maxValue =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

      let TokenContractInstance = geMRToken();

      if(TokenContractInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }

      TokenContractInstance.methods
        .approve(smartMr.address, maxValue)
        .send({
          from: account,
        })
        .on("error", function () {
          Swal.fire("reverted", "Tx has been cancelled by user", "error");
        })
        .on("transactionHash", function (hash: any) {
          Swal.fire("Success!", "Allowance Tx Submitted", "success");
        })
        .on("receipt", function (receipt: any) {
          setShouldUpdate(true);
        });
    } catch (error) {
      console.log('approveTokenMR-Error: ', error)
    }
  };

  const checkAllowanceMR = async () => {
    try {
      let TokenContractInstance = geMRToken();
      if(TokenContractInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let allowance = await TokenContractInstance.methods
        .allowance(account, smartMr.address)
        .call();
      if (allowance > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      
    }
  };

  const checkReward = async () => {
    try {
      let SmartMrInstance = getSmartMr();
      if(SmartMrInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let rewards = await SmartMrInstance.methods
        .viewReward(account)
        .call();
      console.log('rewards: ', rewards)
      let reward: any = 0
      for (let i=0;i<3;i++) {
        reward = reward + parseInt(rewards[i])
      }
      return reward
    } catch (error) {
      
    }
  };

  const checkBalanceMS = async () => {
    try {
      let MSInstance = getMSToken();
      if(MSInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let msBalance = await MSInstance.methods
        .balanceOf(account)
        .call();
      console.log('msBalance: ', msBalance)
      return msBalance 
    } catch (error) {
      
    }
  };

  const checkBalanceMR = async () => {
    try {
      let MRInstance = geMRToken();
      if(MRInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let mrBalance = await MRInstance.methods
        .balanceOf(account)
        .call();
      console.log('msBalance: ', mrBalance)
      return mrBalance
    } catch (error) {
      
    }
  };

  return {
    approveToken,
    depositMR,
    withDrawMR,
    approveTokenMR,
    checkAllowanceMR,
    checkReward,
    checkBalanceMS,
    checkBalanceMR
  };
};

export default useContracts;
