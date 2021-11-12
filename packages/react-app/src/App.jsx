/* eslint-disable */
import "antd/dist/antd.css";
import { Button } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { ethers } from 'ethers';
import { Contract } from "./components";
import { Transactor } from "./helpers";
import { NETWORKS } from "./constants";
import Account from "./components/Account";
import TheLostKingdom from "./components/TheLostKingdom"

import {
  useContractLoader,
  useGasPrice,
  useUserSigner,
} from "./hooks";

// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Localhost Ethereum");

// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider =
  null && navigator.onLine ? new ethers.providers.JsonRpcProvider("https://rpc.scaffoldeth.io:48544") : null;

const mainnetInfura = navigator.onLine
  ? new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl)
  : null;

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrl);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrl);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

/*
  Web3 modal helps us "connect" external wallets:
*/

const web3Modal = new Web3Modal({
  network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: "dark", // optional. Change to "dark" for a dark theme.
});

const logoutOfWeb3Modal = () => {
  web3Modal.clearCachedProvider();

  setTimeout(() => {
    window.location.reload();
  }, 1);

};

function App() {

  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userSigner = useUserSigner(injectedProvider, localProvider);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;

  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notifications
  const tx = Transactor(userSigner, gasPrice);
  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, { chainId: selectedChainId });

  const loadWeb3Modal = useCallback(async () => {

    const provider = await web3Modal.connect();

    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });

  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }

  }, [loadWeb3Modal]);

  const myProps = {
    address,
    localProvider,
    userSigner,
    mainnetProvider,
    web3Modal,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    blockExplorer,
    readContracts,
    writeContracts,
    tx
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <h1>The Lost Kingdom</h1>
            <TheLostKingdom />
            <Account
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
            />
          </Route>
          <Route path="/faucet">
            <div style={{ padding: 32 }}>
              <Account
                address={address}
                localProvider={localProvider}
                userSigner={userSigner}
                mainnetProvider={mainnetProvider}
                web3Modal={web3Modal}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
                blockExplorer={blockExplorer}
              />
              <Button
                style={{ marginBottom: "4rem" }}
                type="primary"
                onClick={() => {
                  faucetTx({
                    to: address,
                    value: ethers.utils.parseEther("1"),
                  });
                }}
              >
                💰 Grab funds from the faucet ⛽️
              </Button>
            </div>
          </Route>
          <Route path="/contract">
            <Contract
              name="TenKLosers"
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
