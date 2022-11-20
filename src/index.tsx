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
import Banner from 'components/Banner';

// enable Keplr
window.Keplr = new Keplr();
window.Metamask = new Metamask();
const queryClient = new QueryClient();

if (process.env.REACT_APP_SENTRY_ENVIRONMENT) {
  Sentry.init({
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
    dsn: 'https://763cf7889ff3440d86c7c1fbc72c8780@o1323226.ingest.sentry.io/6580749',
    integrations: [new BrowserTracing()],

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

      await Promise.race([
        Promise.all([
          window.Keplr.suggestChain(network.chainId),
          window.Keplr.suggestChain(ORAI_BRIDGE_CHAIN_ID),
          window.Keplr.suggestChain(KWT_SUBNETWORK_CHAIN_ID)
          // window.Keplr.suggestChain(ORAI_BRIDGE_ETHER_CHAIN_ID),
        ]),
        new Promise((resolve) => {
          setTimeout(resolve, 10000);
        })
      ]);

      const wallet = await collectWallet(network.chainId);

      window.client = await SigningCosmWasmClient.connectWithSigner(
        network.rpc,
        wallet,
        {
          prefix: network.prefix
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
              {/* <App /> */}
              <Banner />
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
