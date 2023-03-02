import { isMobile } from '@walletconnect/browser-utils';
import { Web3ReactProvider } from '@web3-react/core';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import {
  COSMOS_TYPE,
  EVM_TYPE,
  NOTI_INSTALL_OWALLET,
  ORAICHAIN_ID,
  WEBSOCKET_RECONNECT_ATTEMPTS,
  WEBSOCKET_RECONNECT_INTERVAL
} from 'config/constants';
import { Contract } from 'config/contracts';
import { network } from 'config/networks';
import { ThemeProvider } from 'context/theme-context';
import { getNetworkGasPrice } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEagerConnect } from 'hooks/useMetamask';
import { CacheTokens } from 'libs/token';
import { buildUnsubscribeMessage, buildWebsocketSendMessage, processWsResponseMsg } from 'libs/utils';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { ChainInfoType } from 'reducer/config';
import routes from 'routes';
import { PERSIST_CONFIG_KEY, PERSIST_VER } from 'store/constants';
import Web3 from 'web3';
import './index.scss';
import Menu from './Menu';

const App = () => {
  const [address, setAddress] = useConfigReducer('address');
  const [_, setChainId] = useConfigReducer('chainId');
  const [_$, setChainInfo] = useConfigReducer('chainInfo');
  const [_$$, setStatusChangeAccount] = useConfigReducer('statusChangeAccount');
  const [infoEvm, setInfoEvm] = useConfigReducer('infoEvm');
  const [_$$$, setInfoCosmos] = useConfigReducer('infoCosmos');
  const [persistVersion, setPersistVersion] = useConfigReducer('persistVersion');
  const dispatch = useDispatch();
  const cacheTokens = useMemo(() => CacheTokens.factory({ dispatch, address }), [dispatch, address]);
  const [metamaskAddress] = useConfigReducer('metamaskAddress');

  //Public API that will echo messages sent to it back to the client

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    `wss://${new URL(network.rpc).host}/websocket`, // only get rpc.orai.io
    {
      onOpen: () => {
        console.log('opened websocket, subscribing...');
        // subscribe to IBC Wasm case
        sendJsonMessage(
          buildWebsocketSendMessage(
            `wasm._contract_address = '${process.env.REACT_APP_IBC_WASM_CONTRACT}' AND wasm.action = 'receive_native' AND wasm.receiver = '${address}'`
          ),
          true
        );
        // sendJsonMessage(buildWebsocketSendMessage(`coin_received.receiver = '${address}'`), true);
        // subscribe to MsgSend and MsgTransfer event case
        // sendJsonMessage(buildWebsocketSendMessage(`coin_spent.spender = '${address}'`, 2), true);
        // subscribe to cw20 contract transfer & send case
        // sendJsonMessage(buildWebsocketSendMessage(`wasm.to = '${address}'`, 3), true);
        // sendJsonMessage(buildWebsocketSendMessage(`wasm.from = '${address}'`, 4), true);
      },
      onClose: () => {
        console.log('unsubscribe all clients');
        sendJsonMessage(buildUnsubscribeMessage());
      },
      onReconnectStop(numAttempts) {
        // if cannot reconnect then we unsubscribe all
        if (numAttempts === WEBSOCKET_RECONNECT_ATTEMPTS) {
          console.log('reconnection reaches above limit. Unsubscribe to all!');
          sendJsonMessage(buildUnsubscribeMessage());
        }
      },
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: WEBSOCKET_RECONNECT_ATTEMPTS,
      reconnectInterval: WEBSOCKET_RECONNECT_INTERVAL
    }
  );

  // this is used for debugging only
  useEffect(() => {
    const tokenDisplay = processWsResponseMsg(lastJsonMessage);
    if (tokenDisplay) {
      displayToast(TToastType.TX_INFO, {
        message: `You have received ${tokenDisplay}`
      });
      cacheTokens.loadTokensCosmosKwt();
    }
  }, [lastJsonMessage]);

  // clear persist storage when update version
  useEffect(() => {
    const isClearPersistStorage = persistVersion === undefined || persistVersion !== PERSIST_VER;
    const clearPersistStorage = () => {
      localStorage.removeItem(`persist:${PERSIST_CONFIG_KEY}`);
      setPersistVersion(PERSIST_VER);
    };

    if (isClearPersistStorage) clearPersistStorage();
  }, []);

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
      if (newAddress === address) {
        // same address, trigger update by clear address then re-update
        setAddress('');
      } else {
        const accounts = (window?.ethereum &&
          (await window.ethereum.request({
            method: 'eth_accounts',
            params: [60]
          }))) || [''];
        cacheTokens.loadAllToken(accounts?.[0] || metamaskAddress);
      }
      // finally update new address
      if (!chainInfo?.chainId) {
        setStatusChangeAccount(true);
      }

      Contract.sender = newAddress;
      setAddress(newAddress);
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
      console.log('Key store in Keplr is changed. You may need to refetch the account info.');
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
