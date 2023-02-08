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
import {
  KWT_SUBNETWORK_CHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
} from 'config/constants';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { collectWallet } from 'libs/cosmjs';
import { GasPrice } from '@cosmjs/stargate';

// enable Keplr
window.Keplr = new Keplr();
window.Metamask = new Metamask();
const queryClient = new QueryClient();

if (process.env.REACT_APP_SENTRY_ENVIRONMENT) {
  Sentry.init({
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
    dsn: 'https://763cf7889ff3440d86c7c1fbc72c8780@o1323226.ingest.sentry.io/6580749',
    integrations: [new BrowserTracing()],
    denyUrls: [/extensions\//i, /^chrome:\/\//i, /^chrome-extension:\/\//i],
    ignoreErrors: ['Request rejected'],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const startApp = async () => {
  try {
    const keplr = await window.Keplr.getKeplr();

    // suggest our chain
    if (keplr) {
      // always trigger suggest chain when users enter the webpage
      for (const networkId of [
        network.chainId,
        ORAI_BRIDGE_CHAIN_ID,
        KWT_SUBNETWORK_CHAIN_ID,
      ]) {
        try {
          await window.Keplr.suggestChain(networkId);
        } catch (error) {
          console.log({ error });
        }
      }

      const wallet = await collectWallet(network.chainId);

      window.client = await SigningCosmWasmClient.connectWithSigner(
        network.rpc,
        wallet,
        {
          prefix: network.prefix,
          gasPrice: GasPrice.fromString(`0${network.denom}`),
        }
      );
    }
  } catch (ex) {
    console.log(ex);
  } finally {
    render(
      <StrictMode>
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </Router>
          <ToastContainer transition={Bounce} />
        </ToastProvider>
      </StrictMode>,
      document.getElementById('oraiswap')
    );
  }
};

startApp();
