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
  isUnlockMetamask
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
import { delay } from 'lodash';
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
  // const [isShowConnectWallet, setIsShowConnectWallet] = useState(false);

  const [isShowMyWallet, setIsShowMyWallet] = useState(false);
  const [isShowChooseWallet, setIsShowChooseWallet] = useState(false);
  // const [oraiAddressWallet, setOraiAddressWallet] = useConfigReducer('address');
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  console.log('🚀 ~ file: index.tsx:96 ~ metamaskAddress:', metamaskAddress);

  const [cosmosAddress, setCosmosAddress] = useConfigReducer('cosmosAddress');
  console.log('🚀 ~ file: index.tsx:99 ~ cosmosAddress:', cosmosAddress);

  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  console.log('🚀 ~ file: index.tsx:101 ~ tronAddress:', tronAddress);
  const walletType = getStorageKey() as WalletType;
  const walletInit = [
    {
      id: 1,
      name: 'Metamask',
      code: WALLET_TYPES.METAMASK,
      icon: MetamaskImage,
      totalUsd: 0,
      isOpen: false,
      // address: metamaskAddress,
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
      // address: '',
      isConnect: !!isEmptyObject(cosmosAddress) === false,
      networks: cosmosNetworks.map((item: any, index) => {
        item.address = cosmosAddress[item.chainId];
        return item;
      })
    },
    {
      id: 3,
      name: 'TronLink',
      code: WALLET_TYPES.TRON,
      icon: TronWalletImage,
      totalUsd: 0,
      isOpen: false,
      // address: tronAddress,
      isConnect: !!tronAddress,
      networks: tronNetworks.map((item: any, index) => {
        item.address = tronAddress;
        return item;
      })
    }
  ];
  const [wallets, setWallets] = useState<WalletItem[]>(walletInit);

  const [connectStatus, setConnectStatus] = useState(CONNECT_STATUS.SELECTING);
  // const loadTokenAmounts = useLoadTokens();
  const connect = useInactiveConnect();
  const [QRUrlInfo, setQRUrlInfo] = useState<QRGeneratorInfo>({ url: '', icon: null, name: '', address: '' });
  // const [walletTypeActive, setWalletTypeActive] = useState(null);
  // const walletType = getStorageKey() as WalletType;
  // console.log('🚀 ~ file: index.tsx:104 ~ walletType:', walletType);
  // const isCheckKeplr = !isEmptyObject(cosmosAddress) && keplrCheck(walletType);
  // console.log('🚀 ~ file: index.tsx:105 ~ isCheckKeplr:', isCheckKeplr);
  // const isCheckOwallet = !isEmptyObject(cosmosAddress) && owalletCheck(walletType);
  // console.log('🚀 ~ file: index.tsx:107 ~ isCheckOwallet:', isCheckOwallet);
  const connectMetamask = async () => {
    try {
      // setWalletTypeActive(WALLET_TYPES.METAMASK);
      // if chain id empty, we switch to default network which is BSC
      if (!window?.ethereum?.chainId) {
        await window.Metamask.switchNetwork(Networks.bsc);
      }

      const isMetamask = !!window?.ethereum?.isMetaMask;
      console.log('🚀 ~ file: index.tsx:167 ~ connectMetamask ~ isMetamask:', isMetamask);
      if (!isMetamask) {
        displayToast(TToastType.METAMASK_FAILED, { message: 'Please install Metamask wallet' });
        return;
      }
      const isUnlock = await isUnlockMetamask();
      if (!isUnlock) {
        displayToast(TToastType.METAMASK_FAILED, { message: 'Please unlock Metamask wallet' });
        return;
      }
      await connect();
    } catch (ex) {
      setConnectStatus(CONNECT_STATUS.ERROR);
      console.log('error in connecting metamask: ', ex);
    } finally {
      console.log('🚀 ~ file: index.tsx:117 ~ metamaskAddress:', metamaskAddress);
      // setWalletTypeActive(null);
    }
  };

  const isConnected = !!metamaskAddress || !!tronAddress || !!isEmptyObject(cosmosAddress) === false;
  console.log('🚀 ~ file: index.tsx:137 ~ isEmptyObject(cosmosAddress):', !!isEmptyObject(cosmosAddress));

  // useEffect(() => {
  //   (async () => {
  //     if (connectStatus === CONNECT_STATUS.PROCESSING) {
  //       const isUnlock = await isUnlockMetamask();
  //       if (walletTypeActive === WALLET_TYPES.METAMASK && !!isUnlock && !!metamaskAddress) {
  //         delay(() => {
  //           setConnectStatus(CONNECT_STATUS.DONE);
  //         }, 2000);
  //       } else if (walletTypeActive === WALLET_TYPES.OWALLET && !isEmptyObject(cosmosAddress)) {
  //         delay(() => {
  //           setConnectStatus(CONNECT_STATUS.DONE);
  //         }, 2000);
  //       } else if (walletTypeActive === WALLET_TYPES.KEPLR && !isEmptyObject(cosmosAddress)) {
  //         delay(() => {
  //           setConnectStatus(CONNECT_STATUS.DONE);
  //         }, 2000);
  //       }
  //     }
  //   })();
  //   return () => {};
  // }, [metamaskAddress, connectStatus, walletTypeActive]);

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
    setWallets(walletInit);

    return () => {};
  }, [metamaskAddress, cosmosAddress, tronAddress]);

  // const connectTronLink = async () => {
  //   try {
  //     // if not requestAccounts before
  //     if (window.Metamask.checkTron()) {
  //       // TODO: Check owallet mobile
  //       let tronAddress: string;
  //       if (isMobile()) {
  //         const addressTronMobile = await window.tronLink.request({
  //           method: 'tron_requestAccounts'
  //         });
  //         //@ts-ignore
  //         tronAddress = addressTronMobile?.base58;
  //       } else {
  //         if (!window.tronWeb.defaultAddress?.base58) {
  //           const { code, message = 'Tronlink is not ready' } = await window.tronLink.request({
  //             method: 'tron_requestAccounts'
  //           });
  //           // throw error when not connected
  //           if (code !== 200) {
  //             displayToast(TToastType.TRONLINK_FAILED, { message });
  //             return;
  //           }
  //         }

  //         tronAddress = window.tronWeb.defaultAddress.base58;
  //       }
  //       loadTokenAmounts({ tronAddress });
  //       setTronAddress(tronAddress);
  //     }
  //   } catch (ex) {
  //     console.log('error in connecting tron link: ', ex);
  //     displayToast(TToastType.TRONLINK_FAILED, { message: JSON.stringify(ex) });
  //   }
  // };

  // const disconnectTronLink = async () => {
  //   try {
  //     setTronAddress(undefined);
  //     // remove account storage tron owallet
  //     localStorage.removeItem('tronWeb.defaultAddress');
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // };

  const connectKeplr = async (type: WalletType) => {
    try {
      console.log('🚀 ~ file: index.tsx:230 ~ connectKeplr ~ type:', type);
      window.Keplr = new Keplr(type);
      // setWalletTypeActive(type === 'keplr' ? WALLET_TYPES.KEPLR : WALLET_TYPES.OWALLET);
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
      // loadTokenAmounts({ oraiAddress });
      // setOraiAddressWallet(oraiAddress);
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:193 ~ connectKeplr ~ error: 222', error);
    }
  };

  const disconnectKeplr = async () => {
    try {
      window.Keplr.disconnect();
      // setOraiAddressWallet('');
    } catch (ex) {
      console.log(ex);
    }
  };

  // const startMetamask = async () => {
  //   const isUnlock = await isUnlockMetamask();
  //   console.log('🚀 ~ file: index.tsx:272 ~ isUnlock ~ isUnlock:', !!isUnlock);
  //   if (!!isUnlock && metamaskAddress) {
  //     setConnectStatus(CONNECT_STATUS.DONE);
  //     return;
  //   }
  //   await requestMethod(WALLET_TYPES.METAMASK, METHOD_WALLET_TYPES.CONNECT);
  //   return;
  // };
  // const startKeplr = async () => {
  //   if (!isEmptyObject(cosmosAddress) && walletTypeActive === WALLET_TYPES.KEPLR) {
  //     setConnectStatus(CONNECT_STATUS.DONE);
  //     return;
  //   }
  //   await requestMethod(WALLET_TYPES.KEPLR, METHOD_WALLET_TYPES.CONNECT);
  //   return;
  // };
  // const startOwallet = async () => {
  //   if (!isEmptyObject(cosmosAddress) && walletTypeActive === WALLET_TYPES.OWALLET) {
  //     setConnectStatus(CONNECT_STATUS.DONE);
  //     return;
  //   }
  //   await requestMethod(WALLET_TYPES.OWALLET, METHOD_WALLET_TYPES.CONNECT);
  //   return;
  // };
  const requestMethod = async (walletType: WALLET_TYPES, method: METHOD_WALLET_TYPES) => {
    switch (walletType) {
      case WALLET_TYPES.METAMASK:
        if (method === METHOD_WALLET_TYPES.START) {
          // await startMetamask();
        } else if (method === METHOD_WALLET_TYPES.CONNECT) {
          setConnectStatus(CONNECT_STATUS.PROCESSING);
          await connectMetamask();
        } else if (method === METHOD_WALLET_TYPES.DISCONNECT) {
          await disconnectMetamask();
        }
        break;
        // case WALLET_TYPES.OWALLET:
        //   if (method === METHOD_WALLET_TYPES.START) {
        //     // await startOwallet();
        //   } else if (method === METHOD_WALLET_TYPES.CONNECT) {
        //     setConnectStatus(CONNECT_STATUS.PROCESSING);
        //     await connectKeplr('owallet');
        //   } else if (method === METHOD_WALLET_TYPES.DISCONNECT) {
        //     await disconnectKeplr();
        //   }

        //   break;
        // case WALLET_TYPES.KEPLR:
        //   if (method === METHOD_WALLET_TYPES.START) {
        //     // await startKeplr();
        //   } else if (method === METHOD_WALLET_TYPES.CONNECT) {
        //     setConnectStatus(CONNECT_STATUS.PROCESSING);
        //     await connectKeplr('keplr');
        //   } else if (method === METHOD_WALLET_TYPES.DISCONNECT) {
        //     await disconnectKeplr();
        //   }

        //   break;
        // case WALLET_TYPES.TRON:
        //   if (method === METHOD_WALLET_TYPES.CONNECT) {
        //     setConnectStatus(CONNECT_STATUS.PROCESSING);
        //     await connectTronLink();
        //   } else if (method === METHOD_WALLET_TYPES.DISCONNECT) {
        //     await disconnectTronLink();
        //   }

        break;
      default:
        break;
    }
  };
  // const walletsModified = wallets.map((w) => {
  //   if (w.code === walletType) {
  //     w.isConnect = !!w.address;
  //     w.isOpen = true;
  //   }
  //   return w;
  // });
  // setWallets(walletsModified);

  const toggleShowNetworks = (id: number) => {
    const walletsModified = wallets.map((w) => {
      if (w.id === id) w.isOpen = !w.isOpen;
      return w;
    });
    setWallets(walletsModified);
  };

  // const { data: prices } = useCoinGeckoPrices();
  // const amounts = useSelector((state: RootState) => state.token.amounts);

  // const handleGetTotalUsd = (typeWallet: 'evm' | 'trx' | 'cosmos' = 'cosmos') => {
  //   let subAmounts = null;
  //   if (typeWallet === 'cosmos') {
  //     subAmounts = Object.fromEntries(Object.entries(amounts).filter(([denom]) => tokenMap?.[denom]?.cosmosBased));
  //   } else if (typeWallet === 'evm') {
  //     subAmounts = Object.fromEntries(
  //       Object.entries(amounts).filter(
  //         ([denom]) => tokenMap?.[denom]?.cosmosBased === false && tokenMap?.[denom].chainId !== '0x2b6653dc'
  //       )
  //     );
  //   } else if (typeWallet === 'trx') {
  //     subAmounts = Object.fromEntries(
  //       Object.entries(amounts).filter(([denom]) => tokenMap?.[denom].chainId === '0x2b6653dc')
  //     );
  //   }

  //   const totalUsd = getTotalUsd(subAmounts, prices);
  //   return totalUsd;
  // };
  // const isKeplr = () => {
  //   if (!!walletTypeActive && walletTypeActive === WALLET_TYPES.KEPLR) {
  //     return true;
  //   } else if (isCheckKeplr && !!walletTypeActive === false) {
  //     return true;
  //   }

  //   return false;
  // };
  // console.log('🚀 ~ file: index.tsx:379 ~ isKeplr ~ isKeplr:', isKeplr());
  // const MetamaskInfo = {
  //   id: 1,
  //   name: 'Metamask',
  //   code: WALLET_TYPES.METAMASK,
  //   icon: MetamaskImage,
  //   totalUsd: handleGetTotalUsd('evm'),
  //   isOpen: false,
  //   address: metamaskAddress,
  //   isConnect: !!metamaskAddress,
  //   networks: evmChains.map((item, index) => {
  //     (item as any).address = metamaskAddress;
  //     return item;
  //   })
  // };
  // const keplrChecked = isKeplr();
  // const OwalletInfo = {
  //   id: 2,
  //   name: 'Owallet',
  //   code: WALLET_TYPES.OWALLET,
  //   icon: OwalletImage,
  //   totalUsd: handleGetTotalUsd('cosmos'),
  //   isOpen: false,
  //   address: cosmosAddress,
  //   isConnect: !!oraiAddressWallet,
  //   networks: cosmosNetworks.map((item, index) => {
  //     (item as any).address = cosmosAddress[item.chainId];
  //     return item;
  //   })
  // };

  // const TronInfo = {
  //   id: 3,
  //   name: 'TronLink',
  //   code: WALLET_TYPES.TRON,
  //   icon: TronWalletImage,
  //   totalUsd: handleGetTotalUsd('trx'),
  //   isOpen: false,
  //   address: tronAddress,
  //   isConnect: !!tronAddress,
  //   networks: tronNetworks.map((item, index) => {
  //     (item as any).address = tronAddress;
  //     return item;
  //   })
  // };

  // useEffect(() => {
  //   const infoWallet = [MetamaskInfo, OwalletInfo, TronInfo];
  //   setWallets(infoWallet as any);
  // }, [tronAddress, metamaskAddress, oraiAddressWallet]);

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
              // handleAddWallet={() => {
              //   setConnectStatus(CONNECT_STATUS.SELECTING);
              //   setIsShowChooseWallet(true);
              //   setIsShowMyWallet(false);
              // }}
              toggleShowNetworks={toggleShowNetworks}
              handleLogoutWallets={(walletType) => requestMethod(walletType, METHOD_WALLET_TYPES.DISCONNECT)}
              handleLoginWallets={(walletType) => requestMethod(walletType, METHOD_WALLET_TYPES.CONNECT)}
              setQRUrlInfo={setQRUrlInfo}
              // setIsShowMyWallet={setIsShowMyWallet}
              handleAddWallet={null}
              wallets={wallets}
              setIsShowMyWallet={null}
            />
          }
        >
          <Connected setIsShowMyWallet={() => setIsShowMyWallet(true)} />
        </TooltipContainer>
      )}
      {/* {isShowChooseWallet ? (
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
     */}
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
