import LoginWidget from './LoginWidget';
import React from 'react';
import styles from './ConnectWallet.module.scss';
import MetamaskImage from 'assets/images/metamask.svg';
import TronLinkImage from 'assets/images/tronlink.jpg';
import KeplrImage from 'assets/images/keplr.png';
import OWalletImage from 'assets/images/owallet.png';
import { isMobile, isAndroid } from '@walletconnect/browser-utils';

interface ConnectWalletModalProps {
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
  connectKeplr,
  disconnectKeplr,
  connectMetamask,
  connectTronLink,
  disconnectTronLink,
  metamaskAddress,
  tronAddress,
  disconnectMetamask,
  address
}) => {
  const mobileMode = isMobile();

  return (
    <div className={styles.options}>
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
            <LoginWidget text="Connect OWallet" address={address} logo={OWalletImage} disconnect={disconnectKeplr} />
          </a>
        ) : (
          <LoginWidget text="Connect OWallet" address={address} logo={OWalletImage} disconnect={disconnectKeplr} />
        )
      ) : (
        <LoginWidget
          text="Connect Keplr"
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
        logo={TronLinkImage}
        text="Connect Tronlink"
        connect={connectTronLink}
        disconnect={disconnectTronLink}
      />
    </div>
  );
};

export default ConnectWalletModal;
