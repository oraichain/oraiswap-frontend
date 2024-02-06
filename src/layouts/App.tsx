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
import { useEffect, useState } from 'react';
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
import FutureCompetition from 'components/FutureCompetitionModal';
import { persistor } from 'store/configure';
import { MaintainModeBanner } from './MaintainModeBanner';

const App = () => {
  const [address, setAddress] = useConfigReducer('address');
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [walletTypeStore] = useConfigReducer('walletTypeStore');
  const [, setStatusChangeAccount] = useConfigReducer('statusChangeAccount');
  const loadTokenAmounts = useLoadTokens();
  const [persistVersion, setPersistVersion] = useConfigReducer('persistVersion');
  const [theme] = useConfigReducer('theme');
  const mobileMode = isMobile();
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
    const isClearPersistStorage = persistVersion === undefined || persistVersion !== PERSIST_VER;
    const clearPersistStorage = () => {
      persistor.pause();
      persistor.flush().then(() => {
        return persistor.purge();
      });
      setPersistVersion(PERSIST_VER);
    };

    if (isClearPersistStorage) clearPersistStorage();

    // TODO: dont need to check keplr gas price when user not connect to wallet
    // if (window.keplr && !isMobile()) {
    //   keplrGasPriceCheck();
    // }
  }, []);

  useEffect(() => {
    // just auto connect keplr in mobile mode
    mobileMode && keplrHandler();
  }, [mobileMode]);

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
      console.log('Error keplrGasPriceCheck: ', error);
    }
  };

  const keplrHandler = async () => {
    try {
      const typeWallet = getStorageKey();
      const isSnap = await getSnap();
      if (!typeWallet) {
        const vs = window?.keplr?.version;
        const isCheckKeplr = !!vs && keplrCheck('keplr');
        if (checkVersionWallet()) {
          setStorageKey('typeWallet', 'owallet');
        } else if (isCheckKeplr) {
          setStorageKey('typeWallet', 'keplr' as WalletType);
        } else if (isSnap) {
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
      loadTokenAmounts({
        oraiAddress,
        metamaskAddress: metamaskAddr,
        tronAddress: tronAddr
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

  const { REACT_APP_IS_MAINTAIN_MODE = false } = process.env;
  const [openBanner, setOpenBanner] = useState(REACT_APP_IS_MAINTAIN_MODE);

  return (
    <ThemeProvider>
      <div className={`app ${theme}`}>
        <Menu />
        <MaintainModeBanner openBanner={openBanner} setOpenBanner={setOpenBanner} />
        <div className={openBanner ? 'contentWithBanner' : ''}>{routes()}</div>
        {!isMobile() && <Instruct />}
        {!isMobile() && <FutureCompetition />}
      </div>
    </ThemeProvider>
  );
};

export default App;
