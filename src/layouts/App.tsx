import React, { useEffect } from 'react';
import routes from 'routes';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import { ThemeProvider } from 'context/theme-context';
import './index.scss';
import Menu from './Menu';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import useGlobalState from 'hooks/useGlobalState';
import { useEagerConnect } from 'hooks/useMetamask';
import { isMobile } from '@walletconnect/browser-utils';
import { ORAICHAIN_ID } from 'config/constants';

const App = () => {
  const [address, setAddress] = useGlobalState('address');
  const [_, setChainId] = useGlobalState('chainId');
  const [_$, setChainInfo] = useGlobalState('chainInfo');
  const [_$$,setStatusChangeAccount] = useGlobalState('statusChangeAccount');
  const [infoEvm, setInfoEvm] = useGlobalState('infoEvm');
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

    if (isMobile()) {
      setInfoEvm({
        ...infoEvm,
        chainId: window.ethereum.chainId,
      });
    }

    if (chainInfos) {
      setStatusChangeAccount(false);
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
      if (!chainInfos?.chainId) {
        setStatusChangeAccount(true);
      }
      setAddress(newAddress as string);
    }
  };
  useEagerConnect(false, true);
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

  useEffect(() => {
    if(window.keplr) {
      keplrGasPriceCheck();
    }
  },[])

  const keplrGasPriceCheck = async () => {
    try {
      const chainInfosWithoutEndpoints = await window.Keplr.getChainInfosWithoutEndpoints();
      const gasPriceStep = chainInfosWithoutEndpoints.find(e => e.chainId == ORAICHAIN_ID)?.feeCurrencies[0]?.gasPriceStep
      if (gasPriceStep && !gasPriceStep.low) {
        displayToast(TToastType.TX_INFO, {
          message: `In order to update new fee settings, you need to remove Oraichain network and refresh OraiDEX to re-add the network.`,
          customLink: "https://www.youtube.com/watch?v=QMqCVUfxDAk"
        });
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  const keplrHandler = async (event?: CustomEvent) => {
    try {
      console.log(
        'Key store in Keplr is changed. You may need to refetch the account info.'
      );
      await updateAddress(event?.detail?.data);
      // window.location.reload();
    } catch (error) {
      console.log('Error: ', error.message);
      setStatusChangeAccount(false);
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
