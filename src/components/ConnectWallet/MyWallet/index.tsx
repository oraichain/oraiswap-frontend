import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import cn from 'classnames/bind';
import { isMobile } from '@walletconnect/browser-utils';
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import copy from 'copy-to-clipboard';

import { reduceString } from 'libs/utils';
import { WalletType } from 'config/constants';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import MetamaskImage from 'assets/images/metamask.png';
import { displayInstallWallet, setStorageKey } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { useInactiveConnect } from 'hooks/useMetamask';
import { collectWallet } from 'libs/cosmjs';
import Keplr from 'libs/keplr';
import Metamask from 'libs/metamask';
import { ReactComponent as AddIcon } from 'assets/icons/Add-icon-black-only.svg';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as QRCodeIcon } from 'assets/icons/qr-code.svg';
import { ReactComponent as TrashIcon } from 'assets/icons/trash_icon.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import { ReactComponent as UpArrowIcon } from 'assets/icons/up-arrow.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/down-arrow-v2.svg';

import { QRGeneratorInfo } from '../QRGenerator';
import styles from './index.module.scss';

const cx = cn.bind(styles);

interface NetworkItem {
  name: string;
  icon: string;
  id: number;
  copied: boolean;
  address: string;
}

interface WalletItem {
  id: number;
  name: string;
  icon: string;
  totalUsd: number;
  isOpen: boolean;
  networks: NetworkItem[];
}

const MyWallets: React.FC<{
  setQRUrlInfo: (qRGeneratorInfo: QRGeneratorInfo) => void;
  setIsShowMyWallet: (isShow: boolean) => void;
}> = ({ setQRUrlInfo, setIsShowMyWallet }) => {
  const [, setIsInactiveMetamask] = useState(false);
  const [address, setAddress] = useConfigReducer('address');
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const loadTokenAmounts = useLoadTokens();
  const connect = useInactiveConnect();
  const [theme] = useConfigReducer('theme');
  const [wallets, setWallets] = useState<WalletItem[]>([]);

  const connectMetamask = async () => {
    try {
      setIsInactiveMetamask(false);

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
      setIsInactiveMetamask(true);
      setMetamaskAddress(undefined);
    } catch (ex) {
      console.log(ex);
    }
  };

  const connectTronLink = async () => {
    try {
      // if not requestAccounts before
      if (Metamask.checkTron()) {
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
    if (oraiAddress === address) {
      setIsSameAddress(!isSameAddress);
    }
    loadTokenAmounts({ oraiAddress });
    setAddress(oraiAddress);
  };

  const disconnectKeplr = async () => {
    try {
      window.Keplr.disconnect();
      setAddress('');
    } catch (ex) {
      console.log(ex);
    }
  };

  const switchHandleWallets = () => {};

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
    if (address) {
      e.stopPropagation();
      copy(address);
    }

    const walletsModified = wallets.map((w) => {
      const networksModified = w.networks.map((network) => {
        network.copied = network.id === networkId && w.id === walletId;
        return network;
      });
      w.networks = networksModified;
      return w;
    });

    setWallets(walletsModified);
  };

  useEffect(() => {
    const initWallets = [
      {
        id: 1,
        name: 'Owallet',
        icon: MetamaskImage,
        totalUsd: 1,
        isOpen: false,
        networks: [
          {
            id: 1,
            name: 'Oraichain',
            address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            icon: MetamaskImage,
            copied: false
          },
          {
            id: 2,
            name: 'Oraichain',
            address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            icon: MetamaskImage,
            copied: false
          },
          {
            id: 3,
            name: 'Oraichain',
            address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            icon: MetamaskImage,
            copied: false
          }
        ]
      },
      {
        id: 2,
        name: 'Owallet 2',
        icon: MetamaskImage,
        totalUsd: 42342.342121221,
        isOpen: false,
        networks: [
          {
            id: 1,
            name: 'Oraichain',
            address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            icon: MetamaskImage,
            copied: false
          },
          {
            id: 2,
            name: 'Oraichain',
            address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            icon: MetamaskImage,
            copied: false
          },
          {
            id: 3,
            name: 'Oraichain',
            address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            icon: MetamaskImage,
            copied: false
          },
          {
            id: 4,
            name: 'Oraichain',
            address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            icon: MetamaskImage,
            copied: false
          },
          {
            id: 5,
            name: 'Oraichain',
            address: '0xf0592A133Fe439D281f42Dcb24E06C9d2De3c1B8',
            icon: MetamaskImage,
            copied: false
          },
          {
            id: 6,
            name: 'Oraichain',
            address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
            icon: MetamaskImage,
            copied: false
          }
        ]
      }
    ];
    setWallets(initWallets);
  }, []);

  return (
    <div className={cx('my_wallets_container', theme)}>
      <div className={cx('wallet_wrapper')}>
        {wallets.map((wallet, index) => {
          return (
            <div key={index} className={cx('wallet_container')}>
              <div className={cx('wallet_info')} onClick={() => toggleShowNetworks(wallet.id)}>
                <div className={cx('logo')}>
                  <div className={cx('remove')}>
                    <TrashIcon />
                  </div>
                  <img src={wallet.icon} alt="wallet icon" />
                </div>
                <div className={cx('info')}>
                  <div className={cx('name')}>{wallet.name}</div>
                  <div className={cx('money')}>${wallet.totalUsd}</div>
                </div>
                <div className={cx('control')}>{wallet.isOpen ? <UpArrowIcon /> : <DownArrowIcon />}</div>
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
                          <div className={cx('address')}>{reduceString(network.address, 5, 5)}</div>
                        </div>
                        <div className={cx('actions')}>
                          <div
                            className={cx('copy')}
                            onClick={(e) => copyWalletAddress(e, network.address, wallet.id, network.id)}
                          >
                            {network.copied ? <SuccessIcon width={20} height={20} /> : <CopyIcon />}
                          </div>
                          <div
                            className={cx('qr_code')}
                            onClick={() =>
                              getUrlQrCode({ address: network.address, name: network.name, icon: network.icon })
                            }
                          >
                            <QRCodeIcon />
                          </div>
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
      <div className={cx('btn')}>
        <AddIcon />
        <div className={cx('content')}>Add Wallet</div>
      </div>
    </div>
  );
};

export default MyWallets;
