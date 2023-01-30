import React, { useEffect } from 'react';
import routes from 'routes';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import { ThemeProvider } from 'context/theme-context';
import './index.scss';
import Menu from './Menu';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import useGlobalState from 'hooks/useGlobalState';

const App = () => {
  const [address, setAddress] = useGlobalState('address');
  const [_, setChainId] = useGlobalState('chainId');
  const [_$, setChainInfo] = useGlobalState('chainInfo');
  const [_$$, setInfoEvm] = useGlobalState('infoEvm');
  const [_$$$, setInfoCosmos] = useGlobalState('infoCosmos');
  const updateAddress = async (chainInfos) => {
    // automatically update. If user is also using Oraichain wallet => dont update
    const keplr = await window.Keplr.getKeplr();
    if (!keplr) {
      return displayToast(
        TToastType.TX_INFO,
        {
          message: 'You must install Keplr to continue'
        },
        { toastId: 'install_keplr' }
      );
    }

    let newAddress = await window.Keplr.getKeplrAddr(chainInfos?.chainId);

    if (chainInfos) {
      setChainId(chainInfos.chainId);
      setChainInfo(chainInfos);
      if (chainInfos?.networkType === 'evm') {
        window.ethereum.chainId = chainInfos.chainId;
        setInfoEvm(chainInfos);
      }
      if (chainInfos?.networkType === 'cosmos') setInfoCosmos(chainInfos);
    }

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
      keplrHandler();
    }
    window.addEventListener('keplr_keystorechange', keplrHandler);
    return () => {
      window.removeEventListener('keplr_keystorechange', keplrHandler);
    };
  }, []);

  const keplrHandler = async (event?: CustomEvent) => {
    try {
      console.log(
        'Key store in Keplr is changed. You may need to refetch the account info.'
      );
      await updateAddress(event?.detail?.data);
      // window.location.reload();
    } catch (error) {
      console.log('Error: ', error.message);
      displayToast(TToastType.TX_INFO, {
        message: `There is an unexpected error with Keplr wallet. Please try again!`
      });
    }
  };

  // can use ether.js as well, but ether.js is better for nodejs
  return (
    <ThemeProvider>
      <Web3ReactProvider getLibrary={(provider) => new Web3(provider)}>
        <Menu />
        {routes()}
      </Web3ReactProvider>
    </ThemeProvider>
  );
};

export default App;
