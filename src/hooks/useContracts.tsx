import DAI_kovan_contract from "../contracts/DAI_kovan.json";
import USDT_kovan_contract from "../contracts/USDT_kovan.json";
import USDC_kovan_contract from "../contracts/USDC_kovan.json";
import smartMr from "../contracts/smartMr.json";
import MS_KOVAN from "../contracts/MS_KOVAN.json";
import MR_KOVAN from "../contracts/MR_KOVAN.json";
import { useStoreState, useStoreActions } from "../store/globalStore";
import Swal from "sweetalert2";

const useContracts = () => {
  const { web3, account } = useStoreState((state) => state);
  const { setShouldUpdate } = useStoreActions((actions) => actions);

  const getContractInstance = (erc20token: "DAI" | "USDT" | "USDC") => {
    if (erc20token === "USDC") {
      return new web3.eth.Contract(
        USDC_kovan_contract.abi,
        USDC_kovan_contract.address
      );
    } else if (erc20token === "USDT") {
      return new web3.eth.Contract(
        USDT_kovan_contract.abi,
        USDC_kovan_contract.address
      );
    } else if (erc20token === "DAI") {
      return new web3.eth.Contract(
        DAI_kovan_contract.abi,
        DAI_kovan_contract.address
      );
    }
  };

  const getSmartMr = () => {
      return new web3.eth.Contract(
        smartMr.abi,
        smartMr.address
      );
  };

  const geMRToken = () => {
    return new web3.eth.Contract(
      MR_KOVAN.abi,
      MR_KOVAN.address
    );
};

const getMSToken = () => {
  return new web3.eth.Contract(
    MS_KOVAN.abi,
    MS_KOVAN.address
  );
};

const depositMR = async (balance: string, addressInvitor: string) => {
  let SmartMrInstance = getSmartMr();

  SmartMrInstance.methods
    .depositMR(balance, addressInvitor)
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
};

const withDrawMR = async (balance: string) => {
  let SmartMrInstance = getSmartMr();

  SmartMrInstance.methods
    .withDrawMR(balance)
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
};

  const approveToken = async (erc20token: "DAI" | "USDT" | "USDC") => {
    let maxValue =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    let TokenContractInstance = geMRToken();

    TokenContractInstance.methods
      .approve(MR_KOVAN.address, maxValue)
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
  };

  const approveTokenMR = async () => {
    let maxValue =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    let TokenContractInstance = geMRToken();

    TokenContractInstance.methods
      .approve(MR_KOVAN.address, maxValue)
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
  };

  const checkAllowanceMR = async () => {
    let TokenContractInstance = geMRToken();
    let allowance = await TokenContractInstance.methods
      .allowance(account, MR_KOVAN.address)
      .call();
    if (allowance > 0) {
      return true;
    } else {
      return false;
    }
  };

  const checkReward = async () => {
    let SmartMrInstance = getSmartMr();
    let rewards = await SmartMrInstance.methods
      .viewReward(account)
      .call();
    console.log('rewards: ', rewards)
    let reward: any = 0
    for (let i=0;i<3;i++) {
      reward = reward + parseInt(rewards[i])
    }
    return reward
  };

  const checkBalanceMS = async () => {
    let MSInstance = getMSToken();
    let msBalance = await MSInstance.methods
      .balanceOf(account)
      .call();
    console.log('msBalance: ', msBalance)
    return msBalance
  };

  const checkBalanceMR = async () => {
    let MRInstance = geMRToken();
    let mrBalance = await MRInstance.methods
      .balanceOf(account)
      .call();
    console.log('msBalance: ', mrBalance)
    return mrBalance
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
