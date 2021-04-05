import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";

import { Modal } from "react-responsive-modal";

// import CustomButton from "./CustomButton";
import SmallButtons from "./SmallButtons";
import useContracts from "../hooks/useContracts";
import ApproveButton from "./ApproveButton";
import { useStoreState } from "../store/globalStore";
import Swal from "sweetalert2";

const GasModal: React.FunctionComponent = () => {
  const { connected } = useStoreState((state) => state);
  const { checkAllowanceMR, approveTokenMR, depositMR, withDrawMR, checkReward, checkBalanceMR, checkBalanceMS } = useContracts();

  const [open, setOpen] = useState(false);
  const [checkingAllowance, setCheckingAllowance] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [claimableReward, setReward] = useState('0');
  const [msBalance, setMSBalance] = useState('0');
  const [mrBalance, setMRBalance] = useState('0');


  const [selectedToken, setSelectedToken] = useState<"DAI" | "USDC" | "USDT">(
    "USDC"
  );

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    const checkApproved = async () => {
      setCheckingAllowance(true);
      const isApproved = await checkAllowanceMR();
      setIsApproved(isApproved);
      setCheckingAllowance(false);
    };

    if (open) {
      checkApproved();
    }
  }, [selectedToken, open]);

  // useEffect(() => {
  //   const process = async () => {
  //     setCheckingAllowance(true);
  //     const reward = await checkReward();
  //     setReward(reward);
  //   };
  //   process()
  // }, [])

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

  return (
    <>
    <div className="checking-allowance">
      Claimable MS Reward: {parseFloat(claimableReward)/1e18} 
    </div>

    <div className="checking-allowance">
      Your current MS Balance: {parseFloat(msBalance)/1e18} 
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

    <div
      className="approve-token-button"
      onClick={() => depositMR('1000000000000000000', '0x2031d045f56e679925bFdCDa3416448Cc9B1b688')}
    >
      Deposit MR
    </div>

    <div
      className="approve-token-button"
      onClick={() => withDrawMR('1000000000000000000')}
    >
      Withdraw MR
    </div>

    
      {/* <CustomButton
        color="green"
        title="Pay Gas"
        description="Checkout estimated gas prices and pay"
        icon="dollar-sign"
        onClick={onOpenModal}
        disabled={!connected}
      />
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        classNames={{
          modal: "modal",
        }}
      >
        <div className="header">
          <div className="title">select tokens to pay gas fees</div>
          <div className="tabs">
            <div className="tab" onClick={onCloseModal}>
              Ether
            </div>
            <div className="tab active-tab">Stable Coins</div>
          </div>
        </div>

        <div className="body">
          <div className="token-container">
            <SmallButtons
              name="USDC"
              active={selectedToken === "USDC"}
              onClick={() => setSelectedToken("USDC")}
            />
            <SmallButtons
              name="USDT"
              active={selectedToken === "USDT"}
              onClick={() => setSelectedToken("USDT")}
            />
            <SmallButtons
              name="DAI"
              active={selectedToken === "DAI"}
              onClick={() => setSelectedToken("DAI")}
            />
          </div>

          <div className="token-action">
            {checkingAllowance ? (
              <div className="checking-allowance">
                Checking Allowance Status
              </div>
            ) : !isApproved ? (
              <div className="pay-tx">
                <div className="gas-amount">
                  Estimated Tx fee :{" "}
                  <strong>
                    {(Math.random() * 5).toFixed(3)} {selectedToken}
                  </strong>
                </div>
                <div className="buttons">
                  <div className="tx-button cancel" onClick={onCloseModal}>
                    Cancel
                  </div>
                  <div
                    className="tx-button proceed"
                    onClick={() => {
                      Swal.fire({
                        title: "Success!",
                        text: "Transaction went forward",
                        icon: "success",
                        confirmButtonText: "continue",
                      }).then((result) => {
                        if (result.value) {
                          onCloseModal();
                        }
                      });
                    }}
                  >
                    Proceed
                  </div>
                </div>
              </div>
            ) : (
              <div className="approve-token">
                <div className="note">
                  Note: Give approval to Smart MR ERC-20 Forwarder Contract, so
                  it can deduct fee in selected token.
                </div>
                <ApproveButton tokenName={selectedToken} />
              </div>
            )}
          </div>
        </div>
      </Modal> */}
    </>
  );
};

export default GasModal;
