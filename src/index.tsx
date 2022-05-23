import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';
import ScrollToTop from './layouts/ScrollToTop';
import App from './layouts/App';
import OWallet from 'libs/owallet';
import { network } from 'config/networks';
import { ToastProvider } from 'components/Toasts/context';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import Metamask from 'libs/metamask';

// enable OWallet
window.OWallet = new OWallet();
window.Metamask = new Metamask();
const queryClient = new QueryClient();

const startApp = async () => {
  try {
    const owallet = await window.OWallet.getOWallet();
    // suggest our chain
    if (owallet) {
      // always trigger suggest chain when users enter the webpage
      await window.OWallet.suggestChain(network.chainId);
      await window.OWallet.suggestChain('columbus-5');
      await window.OWallet.suggestChain('oraibridge-subnet');
    }
  } catch (ex) {
    console.log(ex);
  }

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
};

startApp();
