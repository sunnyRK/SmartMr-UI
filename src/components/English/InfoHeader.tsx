import React from "react";
import { useStoreState } from "../../store/globalStore";
import logo from "../../assets/images/logo.png";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
            {account ? `(${network}) ${account}` : "connect wallet to continue"}
          </Typography>
        </ThemeProvider> 
      </div>
    </div>
  );
};

export default InfoHeader;
