import { displayToast, TToastType } from 'components/Toasts/Toast';
import {
  IBC_WASM_CONTRACT,
  WalletType,
  WEBSOCKET_RECONNECT_ATTEMPTS,
  WEBSOCKET_RECONNECT_INTERVAL
} from '@oraichain/oraidex-common';
import { network } from 'config/networks';
import { ThemeProvider } from 'context/theme-context';
import { checkVersionWallet, getNetworkGasPrice, getStorageKey, keplrCheck, setStorageKey, switchWallet } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { useTronEventListener } from 'hooks/useTronLink';
import useLoadTokens from 'hooks/useLoadTokens';
import { buildUnsubscribeMessage, buildWebsocketSendMessage, processWsResponseMsg } from 'libs/utils';
import { useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import routes from 'routes';
import { PERSIST_CONFIG_KEY, PERSIST_VER } from 'store/constants';
import { isMobile } from '@walletconnect/browser-utils';
import { ethers } from 'ethers';
import Menu from './Menu';
import Instruct from './Instruct';
import './index.scss';
import { getSnap } from '@leapwallet/cosmos-snap-provider';
import { leapWalletType } from 'helper/constants';
import { NomicContext } from 'context/nomic-context';

const App = () => {
  const [address, setAddress] = useConfigReducer('address');
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const [btcAddress, setBtcAddress] = useConfigReducer('btcAddress');
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [walletTypeStore, setWalletTypeStore] = useConfigReducer('walletTypeStore');
  const [, setStatusChangeAccount] = useConfigReducer('statusChangeAccount');
  const loadTokenAmounts = useLoadTokens();
  const [persistVersion, setPersistVersion] = useConfigReducer('persistVersion');
  const [theme] = useConfigReducer('theme');
  const nomic = useContext(NomicContext);
  useTronEventListener();

  //Public API that will echo messages sent to it back to the client
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    `wss://${new URL(network.rpc).host}/websocket`, // only get rpc.orai.io
    {
      onOpen: () => {
        console.log('opened websocket, subscribing...');
        // subscribe to IBC Wasm case
        sendJsonMessage(
          buildWebsocketSendMessage(
            `wasm._contract_address = '${IBC_WASM_CONTRACT}' AND wasm.action = 'receive_native' AND wasm.receiver = '${address}'`
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
      // no metamaskAddress, only reload cosmos
      loadTokenAmounts({ oraiAddress: address });
    }
  }, [lastJsonMessage]);

  // clear persist storage when update version
  useEffect(() => {
    nomic.init();
    const isClearPersistStorage = persistVersion === undefined || persistVersion !== PERSIST_VER;
    const clearPersistStorage = () => {
      localStorage.removeItem(`persist:${PERSIST_CONFIG_KEY}`);
      setPersistVersion(PERSIST_VER);
    };

    if (isClearPersistStorage) clearPersistStorage();

    if (window.keplr && !isMobile()) {
      keplrGasPriceCheck();
    }

    // add event listener here to prevent adding the same one everytime App.tsx re-renders
    // try to set it again
    keplrHandler();
  }, []);
  useEffect(() => {
    (async () => {
      if (walletTypeStore !== leapWalletType || isMobile()) {
        window.addEventListener('keplr_keystorechange', keplrHandler);
      }
    })();
    return () => {
      window.removeEventListener('keplr_keystorechange', keplrHandler);
    };
  }, [walletTypeStore]);

  const keplrGasPriceCheck = async () => {
    try {
      const gasPrice = await getNetworkGasPrice(network.chainId);
      if (!gasPrice) {
        displayToast(TToastType.TX_INFO, {
          message: `In order to update new fee settings, you need to remove Oraichain network and refresh OraiDEX to re-add the network.`,
          customLink: 'https://www.youtube.com/watch?v=QMqCVUfxDAk'
        });
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const keplrHandler = async () => {
    try {
      console.log('Key store in Keplr is changed. You may need to refetch the account info.');
      // automatically update. If user is also using Oraichain wallet => dont update
      // const keplr = await window.Keplr.getKeplr();
      // if (!keplr) {
      //   return displayInstallWallet();
      // }
      const typeWallet = getStorageKey();
      const isSnap = await getSnap();
      if (!typeWallet) {
        const vs = window?.keplr?.version;
        const isCheckKeplr = !!vs && keplrCheck('keplr');
        if (checkVersionWallet()) {
          setWalletTypeStore('owallet');
          setStorageKey('typeWallet', 'owallet');
        } else if (isCheckKeplr) {
          setWalletTypeStore('keplr');
          setStorageKey('typeWallet', 'keplr' as WalletType);
        } else if (isSnap) {
          setWalletTypeStore(leapWalletType);
          setStorageKey('typeWallet', leapWalletType);
        }
      }

      let metamaskAddr = undefined,
        tronAddr = undefined;
      // TODO: owallet get address tron
      if (!isMobile()) {
        if (window.tronWeb && window.tronLink) {
          await window.tronLink.request({
            method: 'tron_requestAccounts'
          });
          const base58Address = window.tronWeb?.defaultAddress?.base58;
          if (base58Address && base58Address !== tronAddress) {
            tronAddr = base58Address;
            setTronAddress(base58Address);
          }
        }
        // TODO: owallet get address evm
        if (window.ethereum) {
          try {
            const [address] = await window.ethereum!.request({
              method: 'eth_requestAccounts',
              params: []
            });
            if (address && address !== metamaskAddress) {
              metamaskAddr = address;
              setMetamaskAddress(ethers.utils.getAddress(address));
            }
          } catch (error) {
            if (error?.code === -32002) {
              displayToast(TToastType.METAMASK_FAILED, {
                message: ' Already processing request Ethereum account. Please wait'
              });
            }
          }
        }
      }

      switchWallet(walletTypeStore as WalletType);

      const oraiAddress = await window.Keplr.getKeplrAddr();
      const btcAddress = walletTypeStore === 'owallet' ? await window.Bitcoin.getAddress() : null;
      setBtcAddress(btcAddress);
      loadTokenAmounts({
        oraiAddress,
        metamaskAddress: metamaskAddr,
        tronAddress: tronAddr,
        btcAddress
      });
      setAddress(oraiAddress);
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
      <div className={`app ${theme}`}>
        <Menu />
        {routes()}
        {!isMobile() && <Instruct />}
      </div>
    </ThemeProvider>
  );
};

export default App;
