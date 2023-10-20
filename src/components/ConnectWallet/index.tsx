import { FC, useEffect, useState } from 'react';
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
import { displayInstallWallet, setStorageKey, cosmosNetworks, tronNetworks, isEmptyObject } from 'helper';
import { collectWallet } from 'libs/cosmjs';
import { getTotalUsd } from 'libs/utils';
import { isMobile } from '@walletconnect/browser-utils';
import { network } from 'config/networks';
import Keplr from 'libs/keplr';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import MetamaskImage from 'assets/images/metamask.png';
import OwalletImage from 'assets/images/owallet-logo.png';
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

const ConnectWallet: FC<ModalProps> = ({}) => {
  const [theme] = useConfigReducer('theme');
  const [isShowConnectWallet, setIsShowConnectWallet] = useState(false);
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [isShowMyWallet, setIsShowMyWallet] = useState(false);
  const [isShowChooseWallet, setIsShowChooseWallet] = useState(false);
  const [oraiAddressWallet, setOraiAddressWallet] = useConfigReducer('address');
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [cosmosAddress, setCosmosAddress] = useConfigReducer('cosmosAddress');
  console.log('🚀 ~ file: index.tsx:68 ~ cosmosAddress:', cosmosAddress);
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const loadTokenAmounts = useLoadTokens();
  const connect = useInactiveConnect();
  const [QRUrlInfo, setQRUrlInfo] = useState<QRGeneratorInfo>({ url: '', icon: null, name: '', address: '' });
  const connectMetamask = async () => {
    try {
      // if chain id empty, we switch to default network which is BSC
      if (!window?.ethereum?.chainId) {
        await window.Metamask.switchNetwork(Networks.bsc);
      }
      const isMetamask = !!window?.ethereum?.isMetaMask;
      if (isMetamask) {
        const isUnlock = await window.ethereum._metamask.isUnlocked();
        if (!isUnlock) {
          displayToast(TToastType.METAMASK_FAILED, { message: 'Please unlock metamask wallet' });
          return;
        }
      }
      await connect();
    } catch (ex) {
      console.log('error in connecting metamask: ', ex);
    }
  };
  const isConnected = !!metamaskAddress || !!tronAddress || isEmptyObject(cosmosAddress);
  console.log('🚀 ~ file: index.tsx:85 ~ metamaskAddress:', metamaskAddress);
  console.log('🚀 ~ file: index.tsx:85 ~ isConnected:', isConnected);

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
              displayToast(TToastType.TRONLINK_FAILED, { message });
              return;
            }
          }

          tronAddress = window.tronWeb.defaultAddress.base58;
        }
        loadTokenAmounts({ tronAddress });
        setTronAddress(tronAddress);
      }
    } catch (ex) {
      console.log('error in connecting tron link: ', ex);
      displayToast(TToastType.TRONLINK_FAILED, { message: JSON.stringify(ex) });
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
      setOraiAddressWallet(oraiAddress);
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:193 ~ connectKeplr ~ error: 222', error);
    }
  };

  const disconnectKeplr = async () => {
    try {
      window.Keplr.disconnect();
      setOraiAddressWallet('');
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleLoginWallets = async (walletType) => {
    switch (walletType) {
      case WALLET_TYPES.METAMASK:
        await connectMetamask();
        break;
      case WALLET_TYPES.OWALLET:
        await connectKeplr('owallet');
        break;
      case WALLET_TYPES.KEPLR:
        await connectKeplr('keplr');
        break;
      case WALLET_TYPES.TRON:
        await connectTronLink();
        break;
      default:
        break;
    }
    const walletsModified = wallets.map((w) => {
      if (w.code === walletType) {
        w.isConnect = !!w.address;
        w.isOpen = true;
      }
      return w;
    });
    setWallets(walletsModified);
  };

  const handleLogoutWallets = async (walletType) => {
    switch (walletType) {
      case WALLET_TYPES.METAMASK:
        await disconnectMetamask();
        break;
      case WALLET_TYPES.OWALLET:
      case WALLET_TYPES.KEPLR:
        await disconnectKeplr();
        break;
      case WALLET_TYPES.TRON:
        await disconnectTronLink();
        break;
      default:
        break;
    }
    const walletsModified = wallets.map((w) => {
      if (w.code === walletType) {
        w.isConnect = false;
        w.isOpen = true;
      }
      return w;
    });
    setWallets(walletsModified);
  };

  const toggleShowNetworks = (id: number) => {
    const walletsModified = wallets.map((w) => {
      if (w.id === id) w.isOpen = !w.isOpen;
      return w;
    });
    setWallets(walletsModified);
  };

  const { data: prices } = useCoinGeckoPrices();
  const amounts = useSelector((state: RootState) => state.token.amounts);

  const handleGetTotalUsd = (typeWallet: 'evm' | 'trx' | 'cosmos' = 'cosmos') => {
    let subAmounts = null;
    if (typeWallet === 'cosmos') {
      subAmounts = Object.fromEntries(Object.entries(amounts).filter(([denom]) => tokenMap?.[denom]?.cosmosBased));
    } else if (typeWallet === 'evm') {
      subAmounts = Object.fromEntries(
        Object.entries(amounts).filter(
          ([denom]) => tokenMap?.[denom]?.cosmosBased === false && tokenMap?.[denom].chainId !== '0x2b6653dc'
        )
      );
    } else if (typeWallet === 'trx') {
      subAmounts = Object.fromEntries(
        Object.entries(amounts).filter(([denom]) => tokenMap?.[denom].chainId === '0x2b6653dc')
      );
    }

    const totalUsd = getTotalUsd(subAmounts, prices);
    return totalUsd;
  };
  const MetamaskInfo = {
    id: 1,
    name: 'Metamask',
    code: WALLET_TYPES.METAMASK,
    icon: MetamaskImage,
    totalUsd: handleGetTotalUsd('evm'),
    isOpen: false,
    address: metamaskAddress,
    isConnect: !!metamaskAddress,
    networks: evmChains.map((item, index) => {
      (item as any).address = metamaskAddress;
      return item;
    })
  };

  const OwalletInfo = {
    id: 2,
    name: 'Owallet',
    code: WALLET_TYPES.OWALLET,
    icon: OwalletImage,
    totalUsd: handleGetTotalUsd('cosmos'),
    isOpen: false,
    address: cosmosAddress,
    isConnect: !!oraiAddressWallet,
    networks: cosmosNetworks.map((item, index) => {
      (item as any).address = cosmosAddress[item.chainId];
      return item;
    })
  };

  const TronInfo = {
    id: 3,
    name: 'TronLink',
    code: WALLET_TYPES.TRON,
    icon: TronWalletImage,
    totalUsd: handleGetTotalUsd('trx'),
    isOpen: false,
    address: tronAddress,
    isConnect: !!tronAddress,
    networks: tronNetworks.map((item, index) => {
      (item as any).address = tronAddress;
      return item;
    })
  };

  useEffect(() => {
    const infoWallet = [MetamaskInfo, OwalletInfo, TronInfo];
    setWallets(infoWallet as any);
  }, [tronAddress, metamaskAddress, oraiAddressWallet]);
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
                setIsShowChooseWallet(true);
                setIsShowMyWallet(false);
              }}
              wallets={wallets}
              toggleShowNetworks={toggleShowNetworks}
              handleLogoutWallets={handleLogoutWallets}
              handleLoginWallets={handleLoginWallets}
              setQRUrlInfo={setQRUrlInfo}
              setIsShowMyWallet={setIsShowMyWallet}
            />
          }
        >
          <Connected setIsShowMyWallet={() => setIsShowMyWallet(true)} />
        </TooltipContainer>
      )}
      {isShowChooseWallet ? (
        <ChooseWalletModal connectToWallet={handleLoginWallets} close={() => setIsShowChooseWallet(false)} />
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
