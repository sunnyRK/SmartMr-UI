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

const GasModal: React.FunctionComponent = () => {

  const classes = useStyles();
  const matches = useMediaQuery('(min-width:600px)');

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
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Claimable MS Reward</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '1.2rem'}}>{parseFloat(claimableReward)/1e18} MS</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Your current MS Balance</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '1.2rem'}}>{parseFloat(msBalance)/1e18} MS</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Your Stacked MR Balance</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '1.2rem'}}>{parseFloat(userInfo[0])/1e18} MR</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Your current MR Balance</Typography>
                </ThemeProvider> 
              </div>
              <div className="checking-allowance">
                <ThemeProvider theme={theme}>
                  <Typography variant="h5" style={{fontSize: '1.2rem'}}>{parseFloat(mrBalance)/1e18} MR</Typography>
                </ThemeProvider>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ThemeProvider theme={theme}>
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Deposit MR</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1">Stake MR token to earn MS token</Typography>
                </ThemeProvider>
              </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="Add Deposit MR amount" 
                    type="search" 
                    variant="outlined" 
                    onChange={handleDepositAmount}  
                  />
                  {/* <input style={{width: "100%", height: '40px'}} onChange={handleDepositAmount} placeholder="Add Deposit MR amount"></input> */}
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
                    onClick={() => approveTokenMR()}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>Approve MR</Typography>
                    </ThemeProvider> 
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="approve-token-button"
                    onClick={() => depositMR(mrDepositAmount, invitorAddress)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>Deposit MR</Typography>
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
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Withdraw MR</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1">Withdraw MR token and harvest all earned MS token</Typography>
                </ThemeProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="Add Withdraw MR amount" 
                    type="search" 
                    variant="outlined" 
                    onChange={handleWithdrawAmount}  
                  />
                  {/* <input style={{width: "100%", height: '40px'}} onChange={handleWithdrawAmount} placeholder="Add Withdraw MR amount"></input> */}
                </Grid>
                <Grid item xs={12}>
                  <div
                    className="approve-token-button"
                    onClick={() => withDrawMR(mrWithdrawAmount)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>Withdraw MR</Typography>
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
                  <Typography variant="h3" style={{fontSize: '1.2rem'}}>Marketplace of MR token</Typography>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Typography variant="subtitle1">Buy MR token by depositing USDT token</Typography>
                </ThemeProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    style={{width: "100%", height: '40px'}} 
                    id="outlined-search" 
                    label="Add Buy MR amount" 
                    type="search" 
                    variant="outlined" 
                    onChange={handleBuyMRAmount}  
                  />
                  {/* <input style={{width: "100%", height: '40px'}} onChange={handleBuyMRAmount} placeholder="Add Buy MR amount"></input> */}
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
                    onClick={() => buyMR(mrBuyAmount)}
                  >
                    <ThemeProvider theme={theme}>
                      <Typography variant="button" display="block" gutterBottom>BUY MR</Typography>
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

export default GasModal;
