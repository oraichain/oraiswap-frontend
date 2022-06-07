import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import routes from 'routes';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import { ThemeProvider } from 'context/theme-context';
import './index.scss';
import Menu from './Menu';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import useGlobalState from 'hooks/useGlobalState';

const queryClient = new QueryClient();

const App = () => {
  const [address, setAddress] = useGlobalState('address');

  const updateAddress = async () => {
    // automatically update. If user is also using Oraichain wallet => dont update
    const owallet = await window.OWallet.getOWallet();
    if (!owallet) throw 'You must install OWallet to continue';
    const newAddress = await window.OWallet.getOWalletAddr();
    if (newAddress) {
      if (newAddress === address) {
        // same address, trigger update by clear address then re-update
        setAddress('');
      }
      // finally update new address
      setAddress(newAddress as string);
    }
  };

  useEffect(() => {
    // add event listener here to prevent adding the same one everytime App.tsx re-renders
    // try to set it again
    if (!address) {
      owalletHandler();
    }
    window.addEventListener('owallet_keystorechange', owalletHandler);
  }, []);

  const owalletHandler = async () => {
    try {
      console.log(
        'Key store in OWallet is changed. You may need to refetch the account info.'
      );
      await updateAddress();
      // window.location.reload();
    } catch (error) {
      console.log('Error: ', error);
      // displayToast(TToastType.TX_INFO, {
      //   message: `There is an unexpected error with OWallet wallet. Please try again!`
      // });
    }
  };

  // can use ether.js as well, but ether.js is better for nodejs
  return (
    <ThemeProvider>
      <Web3ReactProvider getLibrary={(provider) => new Web3(provider)}>
        <QueryClientProvider client={queryClient}>
          <Menu />
          {routes()}
        </QueryClientProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
};

export default App;
