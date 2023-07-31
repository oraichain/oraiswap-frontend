import LoginWidget from './LoginWidget';
import React from 'react';
import styles from './ConnectWallet.module.scss';
import MetamaskImage from 'assets/images/metamask.png';
import TronLinkImage from 'assets/images/tronlink.jpg';
import KeplrImage from 'assets/images/keplr.png';
import OWalletImage from 'assets/images/orai_wallet_logo.png';
import { isMobile, isAndroid } from '@walletconnect/browser-utils';
import ConnectWalletModalCosmos from './ConnectWalletModal';
import { getStorageKey, keplrCheck, owalletCheck } from 'helper';
import { WalletType } from 'config/constants';
interface ConnectWalletModalProps {
  address: string;
  metamaskAddress: string | null;
  tronAddress: string | null;
  disconnectMetamask: () => Promise<void>;
  disconnectKeplr: () => Promise<void>;
  connectKeplr: (type) => Promise<void>;
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
  const [openConnectWalletModal, setOpenConnectWalletModal] = React.useState(false);
  const walletType = getStorageKey() as WalletType;
  const isCheckKeplr = address && keplrCheck(walletType);
  const isCheckOwallet = address && owalletCheck(walletType);

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
          text="Connect Wallet"
          address={address}
          logo={isCheckOwallet ? OWalletImage : KeplrImage}
          isSwitchWallet={true}
          open={() => setOpenConnectWalletModal(true)}
          disconnect={disconnectKeplr}
        />
      )}
      {openConnectWalletModal && !mobileMode && (
        <ConnectWalletModalCosmos
          isOpen={openConnectWalletModal}
          close={() => setOpenConnectWalletModal(false)}
          connectKeplr={connectKeplr}
          disconnect={disconnectKeplr}
          isCheckKeplr={isCheckKeplr}
          isCheckOwallet={isCheckOwallet}
          address={address}
          open={() => setOpenConnectWalletModal(true)}
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
