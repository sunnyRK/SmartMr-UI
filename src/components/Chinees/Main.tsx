import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";

import buy_aix_contract from "../../contracts/buy_aix.json";
import smart_aix_contract from "../../contracts/smartAIX.json";

import useContracts from "../../hooks/useContracts";
import { useStoreState } from "../../store/globalStore";
import ConnectWeb3 from "./ConnectWeb3";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { BigNumber } from "bignumber.js";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
}));

// Input
const useStyles2 = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const theme = createMuiTheme();

theme.typography.h3 = {
  fontSize: '1rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
  },
};

const MainChinese: React.FunctionComponent = () => {

  const classes = useStyles();

  const { connected } = useStoreState((state) => state);
  const { approveTokenAIX, depositAIX, withDrawAIX, 
    checkTotalReward, checkBalanceAIX, checkBalanceAIXT, approveToken, 
    buyAIX, sellAIX, checkUserInfo, checkInvitorReward, checkViewStaticReward, checkViewTeamReward,
    checkTotalDeposit } = useContracts();

  const [open, setOpen] = useState(false);
  const [claimableReward, setReward] = useState('0');
  const [claimableTeamReward, setTeamReward] = useState('0');
  const [claimableStaticReward, setStaticReward] = useState('0');
  const [claimableInvitorReward, setInvitorReward] = useState('0');

  const [stackedTeamPercent, setTeamPercent] = useState('0');
  const [stackedStaticPercent, setStaticPercent] = useState('0');
  const [stackedInvitorPercent, setInvitorPercent] = useState('0');

  const [totalDeposit, setTotalDeposit] = useState('0');

  const [aixtBalance, setAIXTBalance] = useState('0');
  const [aixBalance, setAIXBalance] = useState('0');
  const [aixDepositAmount, setDepositAmount] = useState('0');
  const [aixWithdrawAmount, setWithdrawAmount] = useState('0');
  const [aixBuyAmount, setBuyAIXAmount] = useState('0');
  const [aixSellAmount, setSellAIXAmount] = useState('0');
  const [invitorAddress, setInvitorAddress] = useState('');
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    async function process() {
      try {
        await checkRewardOfClaim()
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
      const reward = await checkTotalReward();
      const staticReward = await checkViewStaticReward();
      const invitorReward = await checkInvitorReward();
      const teamReward = await checkViewTeamReward();
      const aixBal = await checkBalanceAIX();
      const aixtBal = await checkBalanceAIXT();
      const _totalDeposit = await checkTotalDeposit()
      const userInfoDetails: any = await checkUserInfo()
      console.log('userInfoDetails: ', userInfoDetails, parseFloat(userInfoDetails[0])/1e18)

      setReward(reward)
      setStaticReward(staticReward)
      setInvitorReward(invitorReward)
      setTeamReward(teamReward)
      setAIXBalance(aixBal)
      setAIXTBalance(aixtBal)
      setTotalDeposit(_totalDeposit)
      setUserInfo(userInfoDetails)
      if(userInfoDetails[2] != '0x0000000000000000000000000000000000000000') {
        setInvitorAddress(userInfoDetails[2]);
      }

      const staticPercent = new BigNumber(userInfoDetails[0]).multipliedBy(100).div(new BigNumber(_totalDeposit))
      // const invitorPercent = new BigNumber(invitorReward).multipliedBy(100).div(new BigNumber(_totalDeposit))
      const teamPercent = new BigNumber(userInfoDetails[5]).multipliedBy(100).div(new BigNumber(_totalDeposit))

      setStaticPercent(staticPercent.toString())
      // setInvitorPercent(invitorPercent.toString())
      setTeamPercent(teamPercent.toString())

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

  const handleBuyAIXAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyAIXAmount(event.target.value);
  };

  const handleSellAIXAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSellAIXAmount(event.target.value);
  };

  return (
    !connected ? ( 
      <div style={{margin: "auto", width: "50%", padding: "0px", marginLeft: "0%"}}>
        <ConnectWeb3 />
      </div>
      ) : (
    <>
    <Container>
      <div>
        <Grid container spacing={3} >
        <Grid item xs={12}>
            <Paper className={classes.paper}>
            <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>AIX??????????????????</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(totalDeposit)/1e18} AIX</Typography>
                </ThemeProvider>
              </div>

              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>????????????AIX</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(userInfo[0])/1e18} AIX  ({parseFloat(stackedStaticPercent)}%)</Typography>
                </ThemeProvider>
              </div>

              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>????????????????????????</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(userInfo[5])/1e18} AIX  ({parseFloat(stackedTeamPercent)}%)</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>????????????AIXT????????????</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(claimableReward)/1e18} AIXT</Typography>
                </ThemeProvider>
              </div>

              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>????????????</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(claimableStaticReward)/1e18} AIXT</Typography>
                </ThemeProvider>
              </div>
 
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>????????????</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(claimableTeamReward)/1e18} AIXT</Typography>
                </ThemeProvider>
              </div>

              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>????????????</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(claimableInvitorReward)/1e18} AIXT</Typography>
                </ThemeProvider>
              </div>

            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>???????????????AIXT??????</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(aixtBalance)/1e18} AIXT</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000", textAlign: "left"}}>???????????????AIX??????</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '0.9rem', textAlign: "left"}}>{parseFloat(aixBalance)/1e18} AIX</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000"}}>??????AIX</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1" style={{fontSize: '0.9rem'}}>??????AIX?????????AIXT</Typography>
                </ThemeProvider>
              </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="?????????????????????AIX??????" 
                    type="search" 
                    variant="outlined" 
                    onChange={handleDepositAmount}  
                  />
                  {/* <input style={{width: "100%", height: '40px'}} onChange={handleDepositAmount} placeholder="Add Deposit AIX amount"></input> */}
                </Grid>
                <Grid item xs={12}>
                  {
                    userInfo[2] == '0x0000000000000000000000000000000000000000' ? 
                    <TextField 
                      style={{width: "100%", height: '40px'}} 
                      id="outlined-search" 
                      label="????????????????????????????????????" 
                      type="search" 
                      variant="outlined" 
                      onChange={handleInvitorAddress}  
                    /> :
                    // <input style={{width: "100%", height: '40px'}} onChange={handleInvitorAddress} placeholder="Invitor Address"></input> :
                    <TextField 
                      disabled
                      style={{width: "100%", height: '40px'}} 
                      id="outlined-search" 
                      type="search" 
                      variant="outlined" 
                      value={userInfo[2]}
                      onChange={handleInvitorAddress}  
                    />
                    // <input disabled style={{width: "100%", height: '40px'}} onChange={handleInvitorAddress} placeholder="Invitor Address" value={userInfo[2]}></input>
                  }
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => approveTokenAIX(smart_aix_contract.address)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>????????????AIX</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => depositAIX(aixDepositAmount, invitorAddress)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>??????AIX</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container spacing={3}>
              <Grid item xs={12}>
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000"}}>????????????AIX</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1" style={{fontSize: '0.9rem'}}>????????????AIX????????????????????????AIXT</Typography>
                </ThemeProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="???????????????????????????AIX??????" 
                    type="search" 
                    variant="outlined" 
                    onChange={handleWithdrawAmount}  
                  />
                  {/* <input style={{width: "100%", height: '40px'}} onChange={handleWithdrawAmount} placeholder="Add Withdraw AIX amount"></input> */}
                </Grid>
                <Grid item xs={12}>
                  <div
                    className="approve-token-button"
                    onClick={() => withDrawAIX(aixWithdrawAmount)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>????????????AIX</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1rem', color: "#000000"}}>??????AIX??????</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1" style={{fontSize: '0.9rem'}}>??????USDT??????AIX??????</Typography>
                </ThemeProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="?????????????????????AIX?????????" 
                    type="search" 
                    variant="outlined" 
                    onChange={handleBuyAIXAmount}  
                  />
                  {/* <input style={{width: "100%", height: '40px'}} onChange={handleBuyAIXAmount} placeholder="Add Buy AIX amount"></input> */}
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => approveToken()}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>????????????USDT</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => buyAIX(aixBuyAmount)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>??????AIX</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="Add Buy AIX amount" 
                    type="search" 
                    variant="outlined" 
                    onChange={handleSellAIXAmount}  
                  />
                  {/* <input style={{width: "100%", height: '40px'}} onChange={handleBuyAIXAmount} placeholder="Add Buy AIX amount"></input> */}
                </Grid>
                
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => approveTokenAIX(buy_aix_contract.address)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>?????? AIX</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => sellAIX(aixSellAmount)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>Sell AIX</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
      </Container>
    </>
  ));
};

export default MainChinese;
