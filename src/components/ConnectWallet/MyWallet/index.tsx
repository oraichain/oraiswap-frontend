import cn from 'classnames/bind';

import React, { useEffect, useState, useContext } from 'react';
import QRCode from 'qrcode';
import copy from 'copy-to-clipboard';
import { ReactComponent as AddIcon } from 'assets/icons/Add-icon-black-only.svg';
import { ReactComponent as AddWalletIcon } from 'assets/icons/Add.svg';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as QRCodeIcon } from 'assets/icons/qr-code.svg';
import { ReactComponent as DisconnectIcon } from 'assets/icons/Icon-disconnect.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import { ReactComponent as UpArrowIcon } from 'assets/icons/up-arrow.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/down-arrow-v2.svg';
import { ReactComponent as UnavailableCloudIcon } from 'assets/icons/unavailable-cloud.svg';
import { ReactComponent as Light } from 'assets/icons/dark-light.svg';
import { QRGeneratorInfo } from '../QRGenerator';
import { reduceString } from 'libs/utils';
import styles from './index.module.scss';
import { ThemeContext } from 'context/theme-context';
import { WalletItem } from '../';
import { isMobile } from '@walletconnect/browser-utils';
import ToggleSwitch from 'components/ToggleSwitch';

const cx = cn.bind(styles);

const MyWallets: React.FC<{
  setQRUrlInfo: (qRGeneratorInfo: QRGeneratorInfo) => void;
  setIsShowMyWallet: (isShow: boolean) => void;
  handleAddWallet: () => void;
  handleLogoutWallets: (walletType: any) => void;
  handleLoginWallets: (walletType: any) => Promise<void>;
  toggleShowNetworks: (id: number) => void;
  wallets: WalletItem[];
}> = ({
  setQRUrlInfo,
  setIsShowMyWallet,
  handleAddWallet,
  handleLogoutWallets,
  handleLoginWallets,
  toggleShowNetworks,
  wallets
}) => {
  const { theme, setTheme } = useContext(ThemeContext);

  const [timeoutCopyId, setTimeoutCopyId] = useState<number>(0);

  const [copiedAddressCoordinates, setCopiedAddressCoordinates] = useState<{ networkId: string; walletId: number }>({
    networkId: '',
    walletId: 0
  });

  const getUrlQrCode = async ({ address, icon, name }) => {
    try {
      const url = await QRCode.toDataURL(address);
      setQRUrlInfo({ url, icon, name, address });
      setIsShowMyWallet(false);
    } catch (err) {
      console.error('ERROR getUrlQrCode:', err);
    }
  };

  useEffect(() => {
    if (copiedAddressCoordinates.networkId && copiedAddressCoordinates.walletId) {
      const TIMEOUT_COPY = 2000;
      const timeoutId = setTimeout(() => {
        setCopiedAddressCoordinates({ walletId: 0, networkId: '' });
      }, TIMEOUT_COPY);

      setTimeoutCopyId(Number(timeoutId));
      return () => clearTimeout(timeoutId);
    }
  }, [copiedAddressCoordinates]);

  const copyWalletAddress = (e, address: string, walletId: number, networkId: string) => {
    timeoutCopyId && clearTimeout(timeoutCopyId);
    if (address) {
      e.stopPropagation();
      copy(address);
      setCopiedAddressCoordinates({ walletId, networkId });
    }
  };

  return (
    <div className={cx('my_wallets_container', theme)}>
      <div className={cx('wallet_wrapper')}>
        <div className={cx('toggle_mode')}>
          <div className={cx('toggle_mode_icon')}>
            <Light />
            <span className={cx('text')}>{'DARK MODE'}</span>
          </div>
          <ToggleSwitch
            small={true}
            id="toggle-mode"
            checked={theme === 'dark'}
            onChange={() => {
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
          />
        </div>

        {wallets.map((wallet, index) => {
          return (
            <div key={index} className={cx('wallet_container')}>
              <div className={cx('wallet_info')}>
                <div className={cx('logo')}>
                  {wallet.isConnect ? (
                    <div className={cx('remove')} onClick={() => handleLogoutWallets(wallet.code)}>
                      <DisconnectIcon />
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

                  {/* {wallet.isConnect && !!wallet.address && (
                    <div>
                      <TokenBalance balance={wallet.totalUsd} className={cx('money')} decimalScale={2} />
                    </div>
                  )} */}
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
                        <div>
                          {theme === 'light' ? (
                            network.IconLight ? (
                              <network.IconLight className={cx('icon')} />
                            ) : (
                              <network.Icon className={cx('icon')} />
                            )
                          ) : (
                            <network.Icon className={cx('icon')} />
                          )}
                        </div>
                        <div className={cx('info')}>
                          <div className={cx('name')}>{network.chainName}</div>
                          {network.address ? (
                            <div className={cx('address')}>{reduceString(network.address, 5, 5)}</div>
                          ) : null}
                        </div>
                        <div className={cx('actions')}>
                          {network.address ? (
                            <>
                              <div
                                className={cx('copy')}
                                onClick={(e) => copyWalletAddress(e, network.address, wallet.id, network.chainId)}
                              >
                                {copiedAddressCoordinates.networkId === network.chainId &&
                                copiedAddressCoordinates.walletId === wallet.id ? (
                                  <SuccessIcon width={20} height={20} />
                                ) : (
                                  <CopyIcon />
                                )}
                              </div>
                              <div
                                className={cx('qr_code')}
                                onClick={() =>
                                  getUrlQrCode({
                                    address: network.address,
                                    name: network.chainName,
                                    icon: theme === 'light' && network.IconLight ? network.IconLight : network.Icon
                                  })
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
      {!isMobile() && (
        <div className={cx('btn')} onClick={handleAddWallet}>
          <AddIcon />
          <div className={cx('content')}>Add Wallet</div>
        </div>
      )}
    </div>
  );
};

export default MyWallets;
