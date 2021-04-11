import smartMr from "../contracts/smartMr.json";
import AIXT_KOVAN from "../contracts/AIXT_KOVAN.json";
import AIX_KOVAN from "../contracts/AIX_KOVAN.json";
import USDT_kovan_contract from "../contracts/USDT_kovan.json";
import buy_aix_contract from "../contracts/buy_aix.json";
import { useStoreState, useStoreActions } from "../store/globalStore";
import Swal from "sweetalert2";
import { BigNumber } from "bignumber.js";

const useContracts = () => {
  const { web3, account } = useStoreState((state) => state);
  const { setShouldUpdate } = useStoreActions((actions) => actions);

  function getContractInstance(): any {
    try {
      return new web3.eth.Contract(
        USDT_kovan_contract.abi,
        USDT_kovan_contract.address
      )
    } catch (error) {
      console.log('Error-getContractInstance: ', error)
    }
  }

  const getBuyMrContract = () => {
    try {
      return new web3.eth.Contract(
        buy_aix_contract.abi,
        buy_aix_contract.address
      );
    } catch (error) {
      
    }
  };

  const getSmartMr = () => {
    try {
      return new web3.eth.Contract(
        smartMr.abi,
        smartMr.address
      );
    } catch (error) {
      
    }
  };

  const geAIXToken = () => {
    try {
      return new web3.eth.Contract(
        AIX_KOVAN.abi,
        AIX_KOVAN.address
      );
    } catch (error) {
      
    }
};

const getAIXTToken = () => {
  try {
    return new web3.eth.Contract(
      AIXT_KOVAN.abi,
      AIXT_KOVAN.address
    );
  } catch (error) {
    
  }
};

const buyAIX = async (balance: string) => {
  try {
    let buyMrCntract = getBuyMrContract();
    if(buyMrCntract == undefined) {
      alert("Please Connect Metamask")
      return
    }

    if(new BigNumber(balance).toNumber() == 0) {
      alert("Please add Buy amount")
      return
    }

    const aixBalance = await checkBalanceAIXOfAny(buy_aix_contract.address);

    if(new BigNumber(aixBalance).gte(new BigNumber(balance).multipliedBy(1e18))) {
      if(new BigNumber(balance).multipliedBy(1e6).modulo(1e6).eq(0)) {
        buyMrCntract.methods
        .buyAIX(new BigNumber(balance).multipliedBy(1e6)) // usdt 1e6
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
      } else {
        alert("Amount should not be in fraction.")
      }

    } else {
      alert("Not Enough balance in AIX wallet!")
    }
  } catch (error) {
    console.log('depositAIX-Error: ', error)
  }
};

const depositAIX = async (balance: string, addressInvitor: string) => {
  try {
    console.log('balance', balance, addressInvitor)
    let SmartMrInstance = getSmartMr();
    if(SmartMrInstance == undefined) {
      alert("Please Connect Metamask")
      return
    }
    SmartMrInstance.methods
      .depositAIX(new BigNumber(balance).multipliedBy(1e18), addressInvitor)
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
    console.log('depositAIX-Error: ', error)
  }
};

const withDrawAIX = async (balance: string) => {
  try {
    let SmartMrInstance = getSmartMr();

    if(SmartMrInstance == undefined) {
      alert("Please Connect Metamask")
      return
    }
  
    SmartMrInstance.methods
      .withDrawAIX(new BigNumber(balance).multipliedBy(1e18))
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
    console.log('withDrawAIX-Error: ', error)
  }
};

  const approveToken = async () => {
    try {
      let maxValue =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
  
      let TokenContractInstance = getContractInstance();
      if(TokenContractInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
  
      TokenContractInstance.methods
        .approve(buy_aix_contract.address, maxValue)
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

  const approveTokenAIX = async () => {
    try {
      let maxValue =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

      let TokenContractInstance = geAIXToken();

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
      console.log('approveTokenAIX-Error: ', error)
    }
  };

  const checkAllowanceAIX = async () => {
    try {
      let TokenContractInstance = geAIXToken();
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

  const checkTotalReward = async () => {
    try {
      let SmartMrInstance = getSmartMr();
      if(SmartMrInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let rewards = await SmartMrInstance.methods
        .viewReward(account)
        .call();
      console.log('checkTotalReward: ', rewards)
      let reward: any = 0
      for (let i=0;i<3;i++) {
        reward = reward + parseInt(rewards[i])
      }
      return reward
    } catch (error) {
      console.log(error)
    } 
  };

  const checkViewStaticReward = async () => {
    try {
      let SmartMrInstance = getSmartMr();
      if(SmartMrInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let rewards = await SmartMrInstance.methods
        .viewStaicReward(account)
        .call();
      console.log('checkViewStaticReward: ', rewards)
      // let reward: any = 0
      // for (let i=0;i<3;i++) {
      //   reward = reward + parseInt(rewards[i])
      // }

      if(parseInt(rewards) > 0) {
        return rewards
      } else {
        return 0
      }
    } catch (error) {
      console.log(error)
    } 
  };

  const checkViewGreatReward = async () => {
    try {
      let SmartMrInstance = getSmartMr();
      if(SmartMrInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let rewards = await SmartMrInstance.methods
        .viewGreatReward(account)
        .call();
      console.log('checkViewGreatReward: ', rewards)
      // let reward: any = 0
      // for (let i=0;i<3;i++) {
      //   reward = reward + parseInt(rewards[i])
      // }
      if(parseInt(rewards) > 0) {
        return rewards
      } else {
        return 0
      }
    } catch (error) {
      console.log(error)
    } 
  };

  const checkViewTeamReward = async () => {
    try {
      let SmartMrInstance = getSmartMr();
      if(SmartMrInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }

      const teamReward = await checkUserInfo();
      let rewards = await SmartMrInstance.methods
        .backReward(account)
        .call();
      console.log('checkViewTeamReward: ', rewards)
      let reward: any = parseInt(teamReward) + parseInt(rewards)
      // return reward
      
      if(parseInt(rewards) > 0) {
        return rewards
      } else {
        return 0
      }
    } catch (error) {
      console.log(error)
    } 
  };

  const checkTotalDeposit = async () => {
    try {
      let SmartMrInstance = getSmartMr();
      if(SmartMrInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }

      let totalDeposit = await SmartMrInstance.methods
        .totalDeposit()
        .call();
      console.log('totalDeposit: ', totalDeposit)
      
      if(parseInt(totalDeposit) > 0) {
        return totalDeposit
      } else {
        return 0
      }
    } catch (error) {
      console.log(error)
    } 
  };

  const checkUserInfo = async () => {
    try {
      let SmartMrInstance = getSmartMr();
      if(SmartMrInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let userInfo = await SmartMrInstance.methods
        .userInfo(account)
        .call();

      console.log('userInfo: ', userInfo)
      return userInfo
    } catch (error) {
      console.log(error)
    } 
  };

  const checkBalanceAIXT = async () => {
    try {
      let AIXTInstance = getAIXTToken();
      if(AIXTInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let aixtBalance = await AIXTInstance.methods
        .balanceOf(account)
        .call();
      return aixtBalance 
    } catch (error) {
      
    }
  };

  const checkBalanceAIX = async () => {
    try {
      let AIXInstance = geAIXToken();
      if(AIXInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let aixBalance = await AIXInstance.methods
        .balanceOf(account)
        .call();
      return aixBalance
    } catch (error) {
      
    }
  };

  const checkBalanceAIXOfAny = async (address: string) => {
    try {
      let AIXInstance = geAIXToken();
      if(AIXInstance == undefined) {
        alert("Please Connect Metamask")
        return
      }
      let aixBalance = await AIXInstance.methods
        .balanceOf(address)
        .call();
      return aixBalance
    } catch (error) {
      
    }
  };

  return {
    approveToken,
    depositAIX,
    withDrawAIX,
    approveTokenAIX,
    checkAllowanceAIX,
    checkTotalReward,
    checkBalanceAIXT,
    checkBalanceAIX,
    checkUserInfo,
    buyAIX,
    checkViewTeamReward,
    checkViewGreatReward,
    checkViewStaticReward,
    checkTotalDeposit
    
  };
};

export default useContracts;
