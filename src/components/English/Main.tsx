import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";

import { Modal } from "react-responsive-modal";

// import CustomButton from "./CustomButton";
import SmallButtons from "./SmallButtons";
import useContracts from "../../hooks/useContracts";
import ApproveButton from "./ApproveButton";
import { useStoreState } from "../../store/globalStore";
import Swal from "sweetalert2";
import ConnectWeb3 from "./ConnectWeb3";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';


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
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
  },
};

const Main: React.FunctionComponent = () => {

  const classes = useStyles();
  const matches = useMediaQuery('(min-width:600px)');

  const { connected } = useStoreState((state) => state);
  const { checkAllowanceAIX, approveTokenAIX, depositAIX, withDrawAIX, checkReward, checkBalanceAIX, checkBalanceAIXT, approveToken, buyAIX, checkUserInfo } = useContracts();

  const [open, setOpen] = useState(false);
  const [claimableReward, setReward] = useState('0');
  const [aixtBalance, setAIXTBalance] = useState('0');
  const [aixBalance, setAIXBalance] = useState('0');
  const [aixDepositAmount, setDepositAmount] = useState('0');
  const [aixWithdrawAmount, setWithdrawAmount] = useState('0');
  const [aixBuyAmount, setBuyAIXAmount] = useState('0');
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
        if(userInfoDetails[2] != '0x0000000000000000000000000000000000000000') {
          setInvitorAddress(userInfoDetails[2]);
        }
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
      const aixBal = await checkBalanceAIX();
      const aixtBal = await checkBalanceAIXT();
      setReward(reward);
      setAIXBalance(aixBal)
      setAIXTBalance(aixtBal)
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
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Claimable AIXT Reward</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '1.2rem'}}>{parseFloat(claimableReward)/1e18} AIXT</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Your current AIXT Balance</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '1.2rem'}}>{parseFloat(aixtBalance)/1e18} AIXT</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Your Stacked AIX Balance</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '1.2rem'}}>{parseFloat(userInfo[0])/1e18} AIX</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Your current AIX Balance</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '1.2rem'}}>{parseFloat(aixBalance)/1e18} AIX</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Deposit AIX</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1">Stake AIX token to earn AIXT token</Typography>
                </ThemeProvider>
              </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="Add Deposit AIX amount" 
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
                      label="Invitor Address" 
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
                    onClick={() => approveTokenAIX()}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>Approve AIX</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => depositAIX(aixDepositAmount, invitorAddress)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>Deposit AIX</Typography>
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
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Withdraw AIX</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1">Withdraw AIX token and harvest all earned AIXT token</Typography>
                </ThemeProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="Add Withdraw AIX amount" 
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
                      <Typography variant="button" display="block" gutterBottom>Withdraw AIX</Typography>
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
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Marketplace of AIX token</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1">Buy AIX token by depositing USDT token</Typography>
                </ThemeProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="Add Buy AIX amount" 
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
                      <Typography variant="button" display="block" gutterBottom>Approve USDT</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => buyAIX(aixBuyAmount)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>BUY AIX</Typography>
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

export default Main;
