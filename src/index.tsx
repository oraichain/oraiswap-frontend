import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'components/Toasts/context';
import { network } from 'config/networks';
import { DuckDb } from 'libs/duckdb';
import { initClient } from 'libs/utils';
import 'polyfill';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'store/configure';
import './index.scss';
import App from './layouts/App';
import ScrollToTop from './layouts/ScrollToTop';

const queryClient = new QueryClient();

if (process.env.REACT_APP_SENTRY_ENVIRONMENT === 'production') {
  Sentry.init({
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
    dsn: 'https://763cf7889ff3440d86c7c1fbc72c8780@o1323226.ingest.sentry.io/6580749',
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
    tracesSampleRate: 1
  });
}

const initApp = async () => {
  // @ts-ignore
  window.client = await SigningCosmWasmClient.connect(network.rpc);

  await DuckDb.create();
  window.duckDb = DuckDb.instance;

  const root = createRoot(document.getElementById('oraiswap'));
  root.render(
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
  );

  await initClient();
};

initApp();
