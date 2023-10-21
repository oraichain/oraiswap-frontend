import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames/bind';

import { Button } from 'components/Button';
import TooltipContainer from 'components/ConnectWallet/TooltipContainer';
import useConfigReducer from 'hooks/useConfigReducer';

import styles from './index.module.scss';
import MyWallets from './MyWallet';
import QRGeneratorModal, { QRGeneratorInfo } from './QRGenerator';
import Connected from './Connected';
import ChooseWalletModal from './ChooseWallet';
import useLoadTokens from 'hooks/useLoadTokens';
import { useInactiveConnect } from 'hooks/useMetamask';
import { CustomChainInfo, NetworkChainId, WalletType } from '@oraichain/oraidex-common';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { evmChains } from 'config/chainInfos';
import { tokenMap } from 'config/bridgeTokens';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import {
  displayInstallWallet,
  setStorageKey,
  cosmosNetworks,
  tronNetworks,
  isEmptyObject,
  getStorageKey,
  keplrCheck,
  owalletCheck,
  isUnlockMetamask,
  sleep
} from 'helper';
import { collectWallet } from 'libs/cosmjs';
import { getTotalUsd } from 'libs/utils';
import { isMobile } from '@walletconnect/browser-utils';
import { network } from 'config/networks';
import Keplr from 'libs/keplr';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import MetamaskImage from 'assets/images/metamask.png';
import OwalletImage from 'assets/images/owallet-logo.png';
import KeplrImage from 'assets/images/keplr.png';
import TronWalletImage from 'assets/images/tronlink.jpg';
const cx = cn.bind(styles);

interface ModalProps {}
export enum WALLET_TYPES {
  METAMASK = 'METAMASK',
  KEPLR = 'KEPLR',
  OWALLET = 'OWALLET',
  TRON = 'TRON',
  PHANTOM = 'PHANTOM',
  LEDGER = 'LEDGER',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  PHONE = 'PHONE'
}

interface NetworkItem extends CustomChainInfo {
  address: string;
}

export interface WalletItem {
  id: number;
  name: string;
  code: WALLET_TYPES;
  icon: string;
  totalUsd: number;
  isOpen: boolean;
  isConnect: boolean;
  networks: NetworkItem[];
  address?: string;
}

export enum METHOD_WALLET_TYPES {
  START = 'START',
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  PROCESSING = 'PROCESSING'
}
export enum CONNECT_STATUS {
  SELECTING = 'SELECTING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR'
}
const ConnectWallet: FC<ModalProps> = ({}) => {
  const [theme] = useConfigReducer('theme');
  const [isShowMyWallet, setIsShowMyWallet] = useState(false);
  const [isShowChooseWallet, setIsShowChooseWallet] = useState(false);
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [cosmosAddress, setCosmosAddress] = useConfigReducer('cosmosAddress');
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const walletType = getStorageKey() as WalletType;
  const walletInit = [
    {
      id: 1,
      name: 'Metamask',
      code: WALLET_TYPES.METAMASK,
      icon: MetamaskImage,
      totalUsd: 0,
      isOpen: false,
      isConnect: !!metamaskAddress,
      networks: [{ ...evmChains[0], address: metamaskAddress, chainName: 'Ethereum, BNB Chain' as any }]
    },
    {
      id: 2,
      name: walletType === 'keplr' ? 'Keplr' : 'Owallet',
      code: walletType === 'keplr' ? WALLET_TYPES.KEPLR : WALLET_TYPES.OWALLET,
      icon: walletType === 'keplr' ? KeplrImage : OwalletImage,
      totalUsd: 0,
      isOpen: false,
      isConnect: !!isEmptyObject(cosmosAddress) === false,
      networks: cosmosNetworks.map((item: any, index) => {
        if (!!isEmptyObject(cosmosAddress) === false) {
          item.address = cosmosAddress[item.chainId];
          return item;
        } else {
          item.address = undefined;
          return item;
        }
      })
    },
    {
      id: 3,
      name: 'TronLink',
      code: WALLET_TYPES.TRON,
      icon: TronWalletImage,
      totalUsd: 0,
      isOpen: false,
      isConnect: !!tronAddress,
      networks: tronNetworks.map((item: any, index) => {
        item.address = tronAddress;
        return item;
      })
    }
  ];
  const [wallets, setWallets] = useState<WalletItem[]>(walletInit);
  const [connectStatus, setConnectStatus] = useState(CONNECT_STATUS.SELECTING);
  const loadTokenAmounts = useLoadTokens();
  const connect = useInactiveConnect();
  const [QRUrlInfo, setQRUrlInfo] = useState<QRGeneratorInfo>({ url: '', icon: null, name: '', address: '' });
  const [walletTypeActive, setWalletTypeActive] = useState(null);
  const isCheckKeplr = !!isEmptyObject(cosmosAddress) === false && keplrCheck('keplr');
  const isCheckOwallet = !!isEmptyObject(cosmosAddress) === false && owalletCheck(walletType);
  const connectMetamask = async () => {
    try {
      // if chain id empty, we switch to default network which is BSC
      if (!window?.ethereum?.chainId) {
        await window.Metamask.switchNetwork(Networks.bsc);
      }

      const isMetamask = !!window?.ethereum?.isMetaMask;
      if (!isMetamask) {
        displayToast(TToastType.METAMASK_FAILED, { message: 'Please install Metamask wallet' });
        throw Error('Please install Metamask wallet');
      }
      const isUnlock = await isUnlockMetamask();
      if (!isUnlock) {
        displayToast(TToastType.METAMASK_FAILED, { message: 'Please unlock Metamask wallet' });
        throw Error('Please unlock Metamask wallet');
      }
      await connect();
    } catch (ex) {
      console.log('error in connecting metamask: ', ex);
      throw Error('Connect Metamask failed');
    }
  };

  const isConnected = !!metamaskAddress || !!tronAddress || !!isEmptyObject(cosmosAddress) === false;

  useEffect(() => {
    getListAddressCosmos();
  }, []);

  const getListAddressCosmos = async () => {
    try {
      let listAddressCosmos = {};
      for (const info of cosmosNetworks) {
        const address = await window.Keplr.getKeplrAddr(info.chainId as NetworkChainId);
        listAddressCosmos = {
          ...listAddressCosmos,
          [info.chainId]: address
        };
      }
      setCosmosAddress(listAddressCosmos);
    } catch (error) {
      console.log({ error });
    }
  };

  const disconnectMetamask = async () => {
    try {
      setMetamaskAddress(undefined);
    } catch (ex) {
      console.log(ex);
    }
  };
  useEffect(() => {
    const walletData = walletInit.map((item, index) => {
      if (item.code === walletTypeActive) {
        item.isOpen = true;
        return item;
      }
      return item;
    });
    setWallets(walletData);
    return () => {};
  }, [metamaskAddress, cosmosAddress, tronAddress, walletTypeActive]);

  const connectTronLink = async () => {
    try {
      // if not requestAccounts before
      if (window.Metamask.checkTron()) {
        // TODO: Check owallet mobile
        let tronAddress: string;
        if (isMobile()) {
          const addressTronMobile = await window.tronLink.request({
            method: 'tron_requestAccounts'
          });
          //@ts-ignore
          tronAddress = addressTronMobile?.base58;
        } else {
          if (!window.tronWeb.defaultAddress?.base58) {
            const { code, message = 'Tronlink is not ready' } = await window.tronLink.request({
              method: 'tron_requestAccounts'
            });
            // throw error when not connected
            if (code !== 200) {
              throw Error(message);
            }
          }

          tronAddress = window.tronWeb.defaultAddress.base58;
        }
        loadTokenAmounts({ tronAddress });
        setTronAddress(tronAddress);
      }
    } catch (ex) {
      let msg = typeof ex.message === 'string' ? ex.message : JSON.stringify(ex);
      displayToast(TToastType.TRONLINK_FAILED, { message: msg });
      throw Error(msg);
    }
  };

  const disconnectTronLink = async () => {
    try {
      setTronAddress(undefined);

      // remove account storage tron owallet
      localStorage.removeItem('tronWeb.defaultAddress');
    } catch (ex) {
      console.log(ex);
    }
  };

  const connectKeplr = async (type: WalletType) => {
    try {
      window.Keplr = new Keplr(type);
      setStorageKey('typeWallet', type);
      if (!(await window.Keplr.getKeplr())) {
        return displayInstallWallet();
      }
      const wallet = await collectWallet(network.chainId);
      window.client = await SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
        gasPrice: GasPrice.fromString(`0.002${network.denom}`)
      });
      await window.Keplr.suggestChain(network.chainId);
      const oraiAddress = await window.Keplr.getKeplrAddr();
      loadTokenAmounts({ oraiAddress });
      getListAddressCosmos();
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:193 ~ connectKeplr ~ error: 222', error);
    }
  };

  const disconnectKeplr = async () => {
    try {
      window.Keplr.disconnect();
      setCosmosAddress({});
    } catch (ex) {
      console.log(ex);
    }
  };

  const startMetamask = async () => {
    const isUnlock = await isUnlockMetamask();
    if (!!isUnlock && !!metamaskAddress) {
      setConnectStatus(CONNECT_STATUS.DONE);
      return;
    }
    await requestMethod(WALLET_TYPES.METAMASK, METHOD_WALLET_TYPES.CONNECT);
    return;
  };
  const startKeplr = async () => {
    if (!isEmptyObject(cosmosAddress) && walletTypeActive === WALLET_TYPES.KEPLR && isCheckKeplr) {
      setConnectStatus(CONNECT_STATUS.DONE);
      return;
    }
    await requestMethod(WALLET_TYPES.KEPLR, METHOD_WALLET_TYPES.CONNECT);
    return;
  };
  const startOwallet = async () => {
    if (!isEmptyObject(cosmosAddress) && walletTypeActive === WALLET_TYPES.OWALLET && isCheckOwallet) {
      setConnectStatus(CONNECT_STATUS.DONE);
      return;
    }
    await requestMethod(WALLET_TYPES.OWALLET, METHOD_WALLET_TYPES.CONNECT);
    return;
  };
  const startTron = async () => {
    if (!!tronAddress) {
      setConnectStatus(CONNECT_STATUS.DONE);
      return;
    }
    await requestMethod(WALLET_TYPES.TRON, METHOD_WALLET_TYPES.CONNECT);
    return;
  };
  const handleConnectWallet = async (cb) => {
    try {
      setConnectStatus(CONNECT_STATUS.PROCESSING);
      await sleep(2000);
      await cb();
      setConnectStatus(CONNECT_STATUS.DONE);
      setIsShowMyWallet(true);
      return;
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:350 ~ handleConnectWal ~ error:', error);
      setConnectStatus(CONNECT_STATUS.ERROR);
    }
  };

  const connectDetectOwallet = async () => {
    await connectKeplr('owallet');
  };
  const connectDetectKeplr = async () => {
    await connectKeplr('keplr');
  };
  const requestMethod = async (walletType: WALLET_TYPES, method: METHOD_WALLET_TYPES) => {
    setWalletTypeActive(walletType);
    switch (walletType) {
      case WALLET_TYPES.METAMASK:
        if (method === METHOD_WALLET_TYPES.START) {
          await startMetamask();
        } else if (method === METHOD_WALLET_TYPES.CONNECT) {
          await handleConnectWallet(connectMetamask);
        } else if (method === METHOD_WALLET_TYPES.DISCONNECT) {
          await disconnectMetamask();
        }
        break;
      case WALLET_TYPES.OWALLET:
        if (method === METHOD_WALLET_TYPES.START) {
          await startOwallet();
        } else if (method === METHOD_WALLET_TYPES.CONNECT) {
          await handleConnectWallet(connectDetectOwallet);
        } else if (method === METHOD_WALLET_TYPES.DISCONNECT) {
          await disconnectKeplr();
        }
        break;
      case WALLET_TYPES.KEPLR:
        if (method === METHOD_WALLET_TYPES.START) {
          await startKeplr();
        } else if (method === METHOD_WALLET_TYPES.CONNECT) {
          await handleConnectWallet(connectDetectKeplr);
        } else if (method === METHOD_WALLET_TYPES.DISCONNECT) {
          await disconnectKeplr();
        }
        break;
      case WALLET_TYPES.TRON:
        if (method === METHOD_WALLET_TYPES.START) {
          await startTron();
        } else if (method === METHOD_WALLET_TYPES.CONNECT) {
          await handleConnectWallet(connectTronLink);
        } else if (method === METHOD_WALLET_TYPES.DISCONNECT) {
          await disconnectTronLink();
        }
        break;
      default:
        break;
    }
  };

  const toggleShowNetworks = (id: number) => {
    const walletsModified = wallets.map((w) => {
      if (w.id === id) w.isOpen = !w.isOpen;
      return w;
    });
    setWallets(walletsModified);
  };

  return (
    <div className={cx('connect-wallet-container', theme)}>
      {!isConnected ? (
        <Button type="primary" onClick={() => setIsShowChooseWallet(true)}>
          Connect Wallet
        </Button>
      ) : (
        <TooltipContainer
          placement="bottom-end"
          visible={isShowMyWallet}
          setVisible={setIsShowMyWallet}
          content={
            <MyWallets
              handleAddWallet={() => {
                setConnectStatus(CONNECT_STATUS.SELECTING);
                setIsShowChooseWallet(true);
                setIsShowMyWallet(false);
                setWalletTypeActive(null);
              }}
              toggleShowNetworks={toggleShowNetworks}
              handleLogoutWallets={(walletType) => requestMethod(walletType, METHOD_WALLET_TYPES.DISCONNECT)}
              handleLoginWallets={(walletType) => requestMethod(walletType, METHOD_WALLET_TYPES.CONNECT)}
              setQRUrlInfo={setQRUrlInfo}
              setIsShowMyWallet={setIsShowMyWallet}
              wallets={wallets}
            />
          }
        >
          <Connected
            setIsShowMyWallet={() => {
              setWalletTypeActive(null);
              setIsShowMyWallet(true);
            }}
          />
        </TooltipContainer>
      )}
      {isShowChooseWallet ? (
        <ChooseWalletModal
          connectStatus={connectStatus}
          connectToWallet={(walletType) => requestMethod(walletType, METHOD_WALLET_TYPES.START)}
          close={() => {
            setIsShowChooseWallet(false);
          }}
          cancel={() => {
            setConnectStatus(CONNECT_STATUS.SELECTING);
          }}
          tryAgain={async (walletType) => {
            await requestMethod(walletType, METHOD_WALLET_TYPES.CONNECT);
          }}
        />
      ) : null}

      {QRUrlInfo.url ? (
        <QRGeneratorModal
          url={QRUrlInfo.url}
          name={QRUrlInfo.name}
          icon={QRUrlInfo.icon}
          address={QRUrlInfo.address}
          close={() => setQRUrlInfo({ ...QRUrlInfo, url: '' })}
        />
      ) : null}
    </div>
  );
};

export default ConnectWallet;
