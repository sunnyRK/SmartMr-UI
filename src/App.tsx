import React from "react";
import ReactDOM from 'react-dom';
import "./App.css";

import globalStore, { IGlobalStore } from "./store/globalStore";
import { createStore, StoreProvider } from "easy-peasy";

import InfoHeader from "./components/English/InfoHeader";
import InfoHeader2 from "./components/Chinees/InfoHeader";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Main2 from "../src/components/Chinees/Main";
import Main from "../src/components/English/Main";
import { Grid } from "@material-ui/core";

const store = createStore<IGlobalStore>(globalStore);

function App() {
// const App: React.FunctionComponent = () => {

  // const { connected } = useStoreState((state) => state);

  return (
    <StoreProvider store={store}>
      <Router>
        <div style={{margin: "20px"}}>
          <Grid container spacing={3}>
              <Grid item xs={2}>
                <Link to="/chinees" style={{color:"#ffffff", textDecoration: "none"}}>
                  <div
                    className="approve-token-button"
                    style={{width:"70%"}}
                  >
                    CN
                  </div>
                </Link>
              </Grid>
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
          {/* <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/chinees">Chinees</Link>
            </li>
            <li>
              <Link to="/english">English</Link>
            </li>
          </ul> */}

          <hr />
          </div>
          
          <Switch>
            <Route exact path="/">
              <div className="App">
                <div className="main-card">
                  <InfoHeader2 />
                  <div className="body">
                    <Main2 /> 
                  </div>
                </div>
              </div>
            </Route>
            <Route path="/chinees">
              <div className="App">
                <div className="main-card">
                  <InfoHeader2 />
                  <div className="body">
                    <Main2 /> 
                  </div>
                </div>
              </div>
            </Route>
            <Route path="/english">
              <div className="App">
                <div className="main-card">
                  <InfoHeader />
                  <div className="body">
                    <Main /> 
                  </div>
                </div>
              </div>
            </Route>
          </Switch>
      </Router>
      {/* <div className="App">
        <div className="main-card">
          <InfoHeader />
          <div className="body">
            <GasModal /> 
          </div>
        </div>
      </div> */}
    </StoreProvider>
  );
}

export default App;
