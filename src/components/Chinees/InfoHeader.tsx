import React from "react";
import { useStoreState } from "../../store/globalStore";
import logo from "../../assets/images/logo.png";
import { createMuiTheme, ThemeProvider, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }),
);

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


const InfoHeader: React.FunctionComponent = () => {

  const classes = useStyles();

  const { account, network } = useStoreState((state) => state);

  return (
    <div className="header" style={{marginLeft: "10%"}}>
      <div className="title">
        {/* <img src={logo} style={{width: "30%", height: "30%", marginBottom:"0.1%"}}></img> */}
        <Avatar alt="Remy Sharp" src={logo} className={classes.large} 
          style={{width: "10%", height: "2%", padding: "20px", marginBottom:"0.1%", borderStyle: 'LightGray', backgroundColor: "LightGray"}} />
      </div>
      <div className="wallet-address">
        {/* {account ? `(${network}) ${account}` : "connect wallet to continue"} */}
        <ThemeProvider theme={theme}>
          <Typography variant="h3" style={{fontSize: '1rem', color: "#6C79D3"}}>
            {account ? `(${network}) ${account}` : "connect wallet to continue"}
          </Typography>
        </ThemeProvider>
      </div>

      <Grid spacing={3} style={{marginLeft:"70%"}}>    
        <Grid item xs={2}>
          <Link to="/english" style={{color:"#ffffff", textDecoration: "none"}}>
            <div
              className="approve-token-button"
              style={{width:"50px", borderStyle: 'solid', backgroundColor: "#ffffff", color: '#6C79D3'}}
            >
              EN
            </div>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default InfoHeader;
