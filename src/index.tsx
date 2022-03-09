import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'hooks/useContractsAddress';
import './index.scss';
// import ScrollToTop from './layouts/ScrollToTop';
import Contract from './layouts/Contract';
import App from './layouts/App';
import Keplr from 'libs/keplr';
import { network } from 'constants/networks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { StoreProvider } from 'stores';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from 'components/common/toasts';
import { IBCHistoryNotifier } from 'provider';
import { AccountConnectionProvider } from 'hooks/account/context';

// enable Keplr
window.Keplr = new Keplr();

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);

const queryClient = new QueryClient();

const checkKeplr = async () => {
  const keplr = await window.Keplr.getKeplr();
  if (keplr) {
    // always trigger suggest chain when users enter the webpage
    await window.Keplr.suggestChain(network.chainId);
  }
  render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <ToastProvider>
            <AccountConnectionProvider>
              <IBCHistoryNotifier />
              <Contract>
                <Router>
                  {/* <ScrollToTop /> */}
                  <App />
                </Router>
              </Contract>
              <ToastContainer transition={Bounce} />
            </AccountConnectionProvider>
          </ToastProvider>
        </StoreProvider>
      </QueryClientProvider>
    </StrictMode>,
    document.getElementById('oraiswap')
  );
};

checkKeplr();
