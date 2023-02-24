import React, { useEffect } from 'react';
import routes from 'routes';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import { ThemeProvider } from 'context/theme-context';
import './index.scss';
import Menu from './Menu';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { useEagerConnect } from 'hooks/useMetamask';
import { isMobile } from '@walletconnect/browser-utils';
import {
  COSMOS_TYPE,
  EVM_TYPE,
  NOTI_INSTALL_OWALLET,
  ORAICHAIN_ID
} from 'config/constants';
import useConfigReducer from 'hooks/useConfigReducer';
import { getNetworkGasPrice } from 'helper';
import { ChainInfoType } from 'reducer/config';
import { useDispatch } from 'react-redux';
import { removeToken } from 'reducer/token';

const App = () => {
  const [address, setAddress] = useConfigReducer('address');
  const [_, setChainId] = useConfigReducer('chainId');
  const [_$, setChainInfo] = useConfigReducer('chainInfo');
  const [_$$, setStatusChangeAccount] = useConfigReducer('statusChangeAccount');
  const [infoEvm, setInfoEvm] = useConfigReducer('infoEvm');
  const [_$$$, setInfoCosmos] = useConfigReducer('infoCosmos');
  const dispatch = useDispatch();
  const updateAddress = async (chainInfo: ChainInfoType) => {
    // automatically update. If user is also using Oraichain wallet => dont update
    const keplr = await window.Keplr.getKeplr();
    if (!keplr) {
      return displayToast(TToastType.TX_INFO, NOTI_INSTALL_OWALLET, {
        toastId: 'install_keplr'
      });
    }

    let newAddress = await window.Keplr.getKeplrAddr(chainInfo?.chainId);

    if (isMobile()) {
      setInfoEvm({
        ...infoEvm,
        chainId: window.ethereum.chainId
      });
    }

    if (chainInfo) {
      setStatusChangeAccount(false);
      setChainId(chainInfo.chainId ?? ORAICHAIN_ID);
      setChainInfo(chainInfo);
      if (chainInfo?.networkType === EVM_TYPE) {
        window.ethereum.chainId = chainInfo.chainId;
        setInfoEvm(chainInfo);
      }
      if (chainInfo?.networkType === COSMOS_TYPE) setInfoCosmos(chainInfo);
    }

    if (newAddress) {
      if (newAddress !== address) {
        dispatch(removeToken());
      }
      if (newAddress === address) {
        // same address, trigger update by clear address then re-update
        setAddress('');
      }
      // finally update new address
      if (!chainInfo?.chainId) {
        setStatusChangeAccount(true);
      }
      setAddress(newAddress as string);
    }
  };
  useEagerConnect(false, true);
  useEffect(() => {
    // add event listener here to prevent adding the same one everytime App.tsx re-renders
    // try to set it again
    keplrHandler();
    window.addEventListener('keplr_keystorechange', keplrHandler);
    return () => {
      window.removeEventListener('keplr_keystorechange', keplrHandler);
    };
  }, []);

  useEffect(() => {
    if (window.keplr) {
      keplrGasPriceCheck();
    }
  }, []);

  const keplrGasPriceCheck = async () => {
    try {
      const gasPriceStep = await getNetworkGasPrice();
      if (gasPriceStep && !gasPriceStep.low) {
        displayToast(TToastType.TX_INFO, {
          message: `In order to update new fee settings, you need to remove Oraichain network and refresh OraiDEX to re-add the network.`,
          customLink: 'https://www.youtube.com/watch?v=QMqCVUfxDAk'
        });
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

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
