import React, { StrictMode } from 'react';
import 'polyfill';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';
import ScrollToTop from './layouts/ScrollToTop';
import App from './layouts/App';
import Keplr from 'libs/keplr';
import { network } from 'config/networks';
import { ToastProvider } from 'components/Toasts/context';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Metamask from 'libs/metamask';
import { KWT_SUBNETWORK_CHAIN_ID, ORAI_BRIDGE_CHAIN_ID } from 'config/constants';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { collectWallet } from 'libs/cosmjs';
import { GasPrice } from '@cosmjs/stargate';
import { Provider } from 'react-redux';
import { persistor, store } from 'store/configure';
import { PersistGate } from 'redux-persist/integration/react';

window.TronWeb = require('tronweb');
// enable Keplr
window.Keplr = new Keplr();
window.Metamask = new Metamask();
const queryClient = new QueryClient();

if (process.env.REACT_APP_SENTRY_ENVIRONMENT == 'production') {
  Sentry.init({
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
    dsn: 'https://763cf7889ff3440d86c7c1fbc72c8780@o1323226.ingest.sentry.io/6580749',
    integrations: [new BrowserTracing()],
    denyUrls: [
      /extensions\//i,
      /extension/i,
      /vendor/i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i
    ],
    ignoreErrors: ['Request rejected', 'Failed to fetch', 'Load failed'],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.7
  });
}

const startApp = async () => {
  try {
    const keplr = await window.Keplr.getKeplr();

    // suggest our chain
    if (keplr) {
      // always trigger suggest chain when users enter the webpage
      for (const networkId of [network.chainId, ORAI_BRIDGE_CHAIN_ID, KWT_SUBNETWORK_CHAIN_ID]) {
        try {
          await window.Keplr.suggestChain(networkId);
        } catch (error) {
          console.log({ error });
        }
      }

      const wallet = await collectWallet(network.chainId);
      window.client = await SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
        prefix: network.prefix,
        gasPrice: GasPrice.fromString(`0${network.denom}`)
      });
    } else {
      // can not signer
      window.client = await CosmWasmClient.connect(network.rpc);
    }
  } catch (ex) {
    window.client = await CosmWasmClient.connect(network.rpc);
    console.log(ex);
  } finally {
    render(
      <StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ToastProvider>
              <Router>
                <ScrollToTop />
                <QueryClientProvider client={queryClient}>
                  <App />
                </QueryClientProvider>
              </Router>
              <ToastContainer transition={Bounce} />
            </ToastProvider>
          </PersistGate>
        </Provider>
      </StrictMode>,
      document.getElementById('oraiswap')
    );
  }
};

startApp();
