import React from "react";
import Web3Modal from "web3modal";
import Web3 from "web3";
import Authereum from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { useStoreActions, useStoreState } from "../../store/globalStore";
import CustomButton from "./CustomButton";
import Swal from "sweetalert2";

const ConnectWeb3: React.FunctionComponent = () => {
  const { setAccount, setNetwork, setWeb3, setConnected } = useStoreActions(
    (actions) => actions
  );

  let { web3, connected } = useStoreState((state) => state);

  // const onboard = Onboard({
  //   dappId: 'fd23905f-a384-4e42-8183-1cf2be825e95',       // [String] The API key created by step one above
  //   networkId: 42,  // [Integer] The Ethereum network ID your Dapp uses.
  //   subscriptions: {
  //     wallet: wallet => {
  //        web3 = new Web3(wallet.provider)
  //     }
  //   }
  // });

  let providerOptions = {
    metamask: {
      id: "injected",
      name: "MetaMask",
      type: "injected",
      check: "isMetaMask",
      package: null,
    },
    // authereum: {
    //   package: Authereum,
    // },
    // walletconnect: {
    //   package: WalletConnectProvider,
    //   options: {
    //     infuraId: "INFURA_ID",
    //     network: "rinkeby",
    //     qrcodeModalOptions: {
    //       mobileLinks: [
    //         "rainbow",
    //         "metamask",
    //         "argent",
    //         "trust",
    //         "imtoken",
    //         "pillar",
    //       ],
    //     },
    //   },
    // },
  };

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setAccount("");
    setWeb3(null);
    setNetwork("");
    setConnected(false);
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await setAccount(accounts[0]);
    });
    provider.on("networkChanged", async (network: any) => {
      if (network !== "42") {
        Swal.fire("Wrong Network", "Please switch to Kovan Testnet", "error");
      }
    });
  };

  const onLoginMetamask = async () => {
    try {
      
    // const provider = await web3Modal.connect();
    // web3 = new Web3(window.web3.currentProvider);
    const provider: any = window?.web3.currentProvider;
    await subscribeProvider(provider);
    const web3: any = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const network = await web3.eth.net.getNetworkType();

    await setWeb3(web3);
    await setAccount(address);
    await setNetwork(network);
    await setConnected(true);
    } catch (error) {
      alert("Something went wrong or metamask is not available.")
    }
  };

  const onLoginWalletConnect = async () => {
    try {
      //  Create WalletConnect Provider
      const provider: any = new WalletConnectProvider({
        infuraId: "37bd907f93a146679960d54e729cd51a", // Required
        // qrcodeModalOptions: {
        //   mobileLinks: [
        //     "rainbow",
        //     "metamask",
        //     "argent",
        //     "trust",
        //     "imtoken",
        //     "pillar"
        //   ]
        // }
      });

      // //  Enable session (triggers QR Code modal)
      await provider.enable();

      await subscribeProvider(provider);
      const web3: any = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const network = await web3.eth.net.getNetworkType();

      await setWeb3(web3);
      await setAccount(address);
      await setNetwork(network);
      await setConnected(true);
    } catch (error) {
      alert("Something went wrong or walletconnect is not available.")
    }
  }

  return connected ? (
    <div />
  ) : (
    <div>
      <div>
        <CustomButton
          color="blue"
          title={"連接Metamask"}
          description="Enable web3 wallet to perform Tx"
          icon="grid"
          onClick={connected ? resetApp : onLoginMetamask}
        />
      </div>
      <div style = {{marginTop: "30px"}}>      
        <CustomButton
          color="blue"
          title={"連接其他通用錢包"}
          description="Enable web3 wallet to perform Tx"
          icon="grid"
          onClick={connected ? resetApp : onLoginWalletConnect}
        />
      </div>
    </div>
    
    
  );
};

export default ConnectWeb3;
