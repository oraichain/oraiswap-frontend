import LoginWidget from './LoginWidget';
import LoginWidgetDeepLink from './LoginDeepLinkMobile';
import Modal from 'components/Modal';
import React from 'react';
import styles from './ConnectWalletModal.module.scss';
import cn from 'classnames/bind';
import MetamaskImage from 'assets/images/metamask.svg';
import TronImage from 'assets/icons/tron.svg';
import KeplrImage from 'assets/images/keplr.png';
import OWalletImage from 'assets/images/owallet.png';
import { isMobile, isAndroid } from '@walletconnect/browser-utils';

const cx = cn.bind(styles);

interface ConnectWalletModalProps {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  address: string;
  metamaskAddress: string | null;
  tronAddress: string | null;
  disconnectMetamask: () => Promise<void>;
  disconnectKeplr: () => Promise<void>;
  connectKeplr: () => Promise<void>;
  connectMetamask: () => Promise<void>;
  connectTronLink: () => Promise<void>;
  disconnectTronLink: () => Promise<void>;
}

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  close,
  connectKeplr,
  disconnectKeplr,
  connectMetamask,
  connectTronLink,
  disconnectTronLink,
  metamaskAddress,
  tronAddress,
  disconnectMetamask,
  address,
  open
}) => {
  const mobileMode = isMobile();

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true}>
      <div className={cx('select')}>
        <div className={cx('title')}>
          <div>Connect wallet</div>
        </div>
        <div className={cx('options')}>
          {mobileMode ? (
            !address ? (
              <a
                target="__blank"
                href={
                  isAndroid()
                    ? `app.owallet.oauth://google/open_url?url=${encodeURIComponent('https://oraidex.io')}`
                    : `owallet://open_url?url=${encodeURIComponent('https://oraidex.io')}`
                }
              >
                <LoginWidgetDeepLink
                  text="Connect OWallet"
                  address={address}
                  logo={OWalletImage}
                  disconnect={disconnectKeplr}
                />
              </a>
            ) : (
              <LoginWidgetDeepLink
                text="Connect OWallet"
                address={address}
                logo={OWalletImage}
                disconnect={disconnectKeplr}
              />
            )
          ) : (
            <LoginWidget
              text="Keplr Wallet"
              address={address}
              logo={KeplrImage}
              connect={connectKeplr}
              disconnect={disconnectKeplr}
            />
          )}

          <LoginWidget
            address={metamaskAddress}
            logo={MetamaskImage}
            text="Connect Metamask"
            connect={connectMetamask}
            disconnect={disconnectMetamask}
          />
          <LoginWidget
            address={tronAddress}
            logo={TronImage}
            text="Connect Tronlink"
            connect={connectTronLink}
            disconnect={disconnectTronLink}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;
