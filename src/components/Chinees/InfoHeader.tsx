import React from "react";
import { useStoreState } from "../../store/globalStore";
import logo from "../../assets/images/logo.png";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
  const { account, network } = useStoreState((state) => state);

  return (
    <div className="header" style={{marginLeft: "10%"}}>
      <div className="title">
        <img src={logo} style={{width: "30%", height: "30%", marginBottom:"0.1%"}}></img>
      </div>
      <div className="wallet-address">
        {/* {account ? `(${network}) ${account}` : "connect wallet to continue"} */}
        <ThemeProvider theme={theme}>
          <Typography variant="caption" style={{fontSize: '0.6rem'}}>
            {account ? `(${network}) ${account}` : "連接錢包進行下一步"}
          </Typography>
        </ThemeProvider> 
      </div>

      <Grid container spacing={3} style={{marginLeft:"70%"}}>    
        <Grid item xs={2}>
          <Link to="/english" style={{color:"#ffffff", textDecoration: "none"}}>
            <div
              className="approve-token-button"
              style={{width:"70%"}}
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
