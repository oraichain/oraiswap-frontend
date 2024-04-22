import {
  IBC_WASM_CONTRACT,
  WEBSOCKET_RECONNECT_ATTEMPTS,
  WEBSOCKET_RECONNECT_INTERVAL
} from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { ThemeProvider } from 'context/theme-context';
import { getListAddressCosmos, interfaceRequestTron } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import useWalletReducer from 'hooks/useWalletReducer';
import Keplr from 'libs/keplr';
import Metamask from 'libs/metamask';
import { buildUnsubscribeMessage, buildWebsocketSendMessage, processWsResponseMsg } from 'libs/utils';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import routes from 'routes';
import { persistor } from 'store/configure';
import { PERSIST_VER } from 'store/constants';
import Menu from './Menu';
import './index.scss';
import { NoticeBanner } from './NoticeBanner';
import Sidebar from './Sidebar';
import { ORAI_GATEWAY_CONTRACT_ADDRESS } from 'pages/Vaults/constants';
import FutureCompetition from 'components/FutureCompetitionModal';

const App = () => {
  const [address, setOraiAddress] = useConfigReducer('address');
  const [, setTronAddress] = useConfigReducer('tronAddress');
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [, setBtcAddress] = useConfigReducer('btcAddress');
  const [, setStatusChangeAccount] = useConfigReducer('statusChangeAccount');
  const loadTokenAmounts = useLoadTokens();
  const [persistVersion, setPersistVersion] = useConfigReducer('persistVersion');
  const [theme] = useConfigReducer('theme');
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const [, setCosmosAddress] = useConfigReducer('cosmosAddress');
  const mobileMode = isMobile();
  const ethOwallet = window.eth_owallet;
  // useTronEventListener();

  // TODO: polyfill evm, tron, need refactor
  useEffect(() => {
    if (walletByNetworks.tron === 'owallet') {
      window.tronWebDapp = window.tronWeb_owallet;
      window.tronLinkDapp = window.tronLink_owallet;
      window.Metamask = new Metamask(window.tronWebDapp);
    }
    if (walletByNetworks.evm === 'owallet' && ethOwallet) {
      window.ethereumDapp = ethOwallet;
    }
  }, [walletByNetworks, ethOwallet]);

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

        sendJsonMessage(
          buildWebsocketSendMessage(
            `wasm._contract_address = '${ORAI_GATEWAY_CONTRACT_ADDRESS}' AND wasm.action = 'fulfill_deposit_order' AND wasm.depositor = '${address}'`
          ),
          true
        );
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
    (async () => {
      if (!lastJsonMessage) return;
      const tokenDisplay = await processWsResponseMsg(lastJsonMessage);
      if (tokenDisplay) {
        displayToast(TToastType.TX_INFO, {
          message: `You have received ${tokenDisplay}`
        });
        loadTokenAmounts({ oraiAddress: address });
      }
    })();
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

    // if (window.keplr && !isMobile()) {
    //   keplrGasPriceCheck();
    // }
  }, []);

  useEffect(() => {
    // just auto connect keplr in mobile mode
    mobileMode && keplrHandler();
  }, [mobileMode]);

  useEffect(() => {
    window.addEventListener('keplr_keystorechange', keplrHandler);
    return () => {
      window.removeEventListener('keplr_keystorechange', keplrHandler);
    };
  }, []);

  const keplrHandler = async () => {
    try {
      let metamaskAddress, oraiAddress, tronAddress, btcAddress;

      if (mobileMode) {
        window.tronWebDapp = window.tronWeb;
        window.tronLinkDapp = window.tronLink;
        window.ethereumDapp = window.ethereum;
        window.Keplr = new Keplr('owallet');
        window.Metamask = new Metamask(window.tronWebDapp);
      }

      if (walletByNetworks.cosmos || mobileMode) {
        oraiAddress = await window.Keplr.getKeplrAddr();
        if (oraiAddress) {
          const { listAddressCosmos } = await getListAddressCosmos(oraiAddress, walletByNetworks.cosmos);
          setCosmosAddress(listAddressCosmos);
          setOraiAddress(oraiAddress);
        }
      }

      if (walletByNetworks.evm === 'owallet' || mobileMode) {
        if (mobileMode) await window.Metamask.switchNetwork(Networks.bsc);
        metamaskAddress = await window.Metamask.getEthAddress();
        if (metamaskAddress) setMetamaskAddress(metamaskAddress);
      }
      if (walletByNetworks.bitcoin === 'owallet' || mobileMode) {
        btcAddress = await window.Bitcoin.getAddress();
        if (btcAddress) setBtcAddress(btcAddress);
      }
      if (walletByNetworks.tron === 'owallet' || mobileMode) {
        const res: interfaceRequestTron = await window.tronLinkDapp.request({
          method: 'tron_requestAccounts'
        });
        tronAddress = res?.base58;
        if (tronAddress) setTronAddress(tronAddress);
      }

      loadTokenAmounts({
        oraiAddress,
        metamaskAddress,
        tronAddress,
        btcAddress
      });
    } catch (error) {
      console.log('Error: ', error.message);
      setStatusChangeAccount(false);
      displayToast(TToastType.TX_INFO, {
        message: `There is an unexpected error with Cosmos wallet. Please try again!`
      });
    }
  };

  const [openBanner, setOpenBanner] = useState(false);

  return (
    <ThemeProvider>
      <div className={`app ${theme}`}>
        <Menu />
        <NoticeBanner openBanner={openBanner} setOpenBanner={setOpenBanner} />
        <FutureCompetition />
        <div className="main">
          <Sidebar />
          <div className={openBanner ? `bannerWithContent appRight` : 'appRight'}>{routes()}</div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
