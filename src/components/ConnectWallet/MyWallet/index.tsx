import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import cn from 'classnames/bind';
import { isMobile } from '@walletconnect/browser-utils';
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import copy from 'copy-to-clipboard';

import { ReactComponent as AddIcon } from 'assets/icons/Add-icon-black-only.svg';
import { ReactComponent as AddWalletIcon } from 'assets/icons/Add.svg';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as QRCodeIcon } from 'assets/icons/qr-code.svg';
import { ReactComponent as TrashIcon } from 'assets/icons/trash_icon.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import { ReactComponent as UpArrowIcon } from 'assets/icons/up-arrow.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/down-arrow-v2.svg';
import { ReactComponent as UnavailableCloudIcon } from 'assets/icons/unavailable-cloud.svg';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { displayInstallWallet, setStorageKey } from 'helper';
import { useInactiveConnect } from 'hooks/useMetamask';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { collectWallet } from 'libs/cosmjs';
import { reduceString } from 'libs/utils';
import { network } from 'config/networks';
import Keplr from 'libs/keplr';
import MetamaskImage from 'assets/images/metamask.png';
import EvmIcon from 'assets/icons/icon_evm.svg';
import TronWalletImage from 'assets/images/tronlink.jpg';
import TronlinkImage from 'assets/images/tron-link-logo.png';
import InjectiveImage from 'assets/images/injective-logo.png';
import OraichainImage from 'assets/images/oraichain-logo.png';
import OwalletImage from 'assets/images/owallet-logo.png';
import OsmosImage from 'assets/images/osmos-logo.png';
import KawwaiImage from 'assets/images/Kawwai-logo.png';
import CosmosImage from 'assets/images/cosmos-logo.png';

import { QRGeneratorInfo } from '../QRGenerator';
import styles from './index.module.scss';
import { WalletType } from '@oraichain/oraidex-common';

const cx = cn.bind(styles);

enum WALLET_TYPES {
  METAMASK = 'METAMASK',
  KPLER = 'KPLER',
  OWALLET = 'OWALLET',
  TRON = 'TRON'
}

interface NetworkItem {
  name: string;
  icon: string;
  id: number;
  address: string;
}

interface WalletItem {
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

const MyWallets: React.FC<{
  setQRUrlInfo: (qRGeneratorInfo: QRGeneratorInfo) => void;
  setIsShowMyWallet: (isShow: boolean) => void;
  handleAddWallet: () => void;
}> = ({ setQRUrlInfo, setIsShowMyWallet, handleAddWallet }) => {
  const [oraiAddressWallet, setOraiAddressWallet] = useConfigReducer('address');
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [cosmosAddress] = useConfigReducer('cosmosAddress');
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const loadTokenAmounts = useLoadTokens();
  const connect = useInactiveConnect();
  const [theme] = useConfigReducer('theme');
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [timeoutCopyId, setTimeoutCopyId] = useState<number>(0);
  const [copiedAddressCoordinates, setCopiedAddressCoordinates] = useState<{ networkId: number; walletId: number }>({
    networkId: 0,
    walletId: 0
  });

  const connectMetamask = async () => {
    console.log('connectMetamask', metamaskAddress);
    try {
      // if chain id empty, we switch to default network which is BSC
      if (!window.ethereum.chainId) {
        await window.Metamask.switchNetwork(Networks.bsc);
      }
      await connect();
    } catch (ex) {
      console.log('error in connecting metamask: ', ex);
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
      case WALLET_TYPES.KPLER:
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
        w.isConnect = true;
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
      case WALLET_TYPES.KPLER:
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

  const getUrlQrCode = async ({ address, icon, name }) => {
    try {
      const url = await QRCode.toDataURL(address);
      setQRUrlInfo({ url, icon, name, address });
      setIsShowMyWallet(false);
    } catch (err) {
      console.error('ERROR getUrlQrCode:', err);
    }
  };

  const toggleShowNetworks = (id: number) => {
    const walletsModified = wallets.map((w) => {
      if (w.id === id) w.isOpen = !w.isOpen;
      return w;
    });
    setWallets(walletsModified);
  };

  const copyWalletAddress = (e, address: string, walletId: number, networkId: number) => {
    timeoutCopyId && clearTimeout(timeoutCopyId);
    if (address) {
      e.stopPropagation();
      copy(address);
      setCopiedAddressCoordinates({ walletId, networkId });
    }
  };

  useEffect(() => {
    if (copiedAddressCoordinates.networkId && copiedAddressCoordinates.walletId) {
      const TIMEOUT_COPY = 2000;
      const timeoutId = setTimeout(() => {
        setCopiedAddressCoordinates({ walletId: 0, networkId: 0 });
      }, TIMEOUT_COPY);

      setTimeoutCopyId(Number(timeoutId));
      return () => clearTimeout(timeoutId);
    }
  }, [copiedAddressCoordinates]);

  const MetamaskInfo = {
    id: 1,
    name: 'Metamask',
    code: WALLET_TYPES.METAMASK,
    icon: MetamaskImage,
    totalUsd: 0,
    isOpen: false,
    isConnect: !!metamaskAddress,
    networks: [
      {
        id: 1,
        name: 'Ethereum, BNB Chain',
        address: metamaskAddress,
        icon: EvmIcon
      }
    ]
  };

  const OwalletInfo = {
    id: 2,
    name: 'Owallet',
    code: WALLET_TYPES.OWALLET,
    icon: OwalletImage,
    totalUsd: 0,
    isOpen: false,
    isConnect: !!oraiAddressWallet,
    networks: [
      {
        id: 1,
        name: 'Oraichain',
        address: cosmosAddress['Oraichain'],
        icon: OraichainImage
      },
      {
        id: 2,
        name: 'Injective',
        address: cosmosAddress['injective-1'],
        icon: InjectiveImage
      },
      {
        id: 3,
        name: 'Cosmos Hub',
        address: cosmosAddress['cosmoshub-4'],
        icon: CosmosImage
      },
      {
        id: 4,
        name: 'Osmosis',
        address: cosmosAddress['osmosis-1'],
        icon: OsmosImage
      }
    ]
  };

  const TronInfo = {
    id: 3,
    name: 'TronLink',
    code: WALLET_TYPES.TRON,
    icon: TronWalletImage,
    totalUsd: 0,
    isOpen: false,
    isConnect: !!tronAddress,
    networks: [
      {
        id: 1,
        name: 'Tron network',
        address: tronAddress,
        icon: TronlinkImage
      }
    ]
  };

  useEffect(() => {
    const infoWallet = [MetamaskInfo, OwalletInfo, TronInfo];
    setWallets(infoWallet);
  }, [tronAddress, metamaskAddress, oraiAddressWallet]);

  return (
    <div className={cx('my_wallets_container', theme)}>
      <div className={cx('wallet_wrapper')}>
        {wallets.map((wallet, index) => {
          return (
            <div key={index} className={cx('wallet_container')}>
              <div className={cx('wallet_info')}>
                <div className={cx('logo')}>
                  {wallet.isConnect ? (
                    <div className={cx('remove')} onClick={() => handleLogoutWallets(wallet.code)}>
                      <TrashIcon />
                    </div>
                  ) : (
                    <div className={cx('add')} onClick={() => handleLoginWallets(wallet.code)}>
                      <AddWalletIcon />
                    </div>
                  )}
                  <img src={wallet.icon} alt="wallet icon" />
                </div>
                <div className={cx('info')}>
                  <div className={cx('name')}>{wallet.name}</div>
                </div>
                <div className={cx('control')} onClick={() => toggleShowNetworks(wallet.id)}>
                  {wallet.isOpen ? <UpArrowIcon /> : <DownArrowIcon />}
                </div>
              </div>
              {wallet.isOpen ? (
                <div className={cx('networks_container')}>
                  {wallet.networks.map((network, index) => {
                    return (
                      <div key={'network' + index} className={cx('network_container')}>
                        <div className={cx('logo')}>
                          <img src={network.icon} alt="wallet icon" />
                        </div>
                        <div className={cx('info')}>
                          <div className={cx('name')}>{network.name}</div>
                          {network.address ? (
                            <div className={cx('address')}>{reduceString(network.address, 5, 5)}</div>
                          ) : null}
                        </div>
                        <div className={cx('actions')}>
                          {network.address ? (
                            <>
                              <div
                                className={cx('copy')}
                                onClick={(e) => copyWalletAddress(e, network.address, wallet.id, network.id)}
                              >
                                {copiedAddressCoordinates.networkId === network.id &&
                                copiedAddressCoordinates.walletId === wallet.id ? (
                                  <SuccessIcon width={20} height={20} />
                                ) : (
                                  <CopyIcon />
                                )}
                              </div>
                              <div
                                className={cx('qr_code')}
                                onClick={() =>
                                  getUrlQrCode({ address: network.address, name: network.name, icon: network.icon })
                                }
                              >
                                <QRCodeIcon />
                              </div>
                            </>
                          ) : (
                            <div>
                              <UnavailableCloudIcon />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={cx('btn')} onClick={handleAddWallet}>
        <AddIcon />
        <div className={cx('content')}>Add Wallet</div>
      </div>
    </div>
  );
};

export default MyWallets;
