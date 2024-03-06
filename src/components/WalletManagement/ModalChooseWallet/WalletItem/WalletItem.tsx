import type { WalletNetwork, NetworkType } from 'components/WalletManagement/walletConfig';
import useTheme from 'hooks/useTheme';
import useWalletReducer from 'hooks/useWalletReducer';
import { MouseEventHandler, useEffect, useState } from 'react';
import { Connected, Connecting, Disconnected, WalletConnectComponent } from './WalletConnect';
import styles from './WalletItem.module.scss';
import { ConnectStatus } from '../WalletByNetwork';
import Lottie from 'lottie-react';
import OraiDEXLoadingBlack from 'assets/lottie/oraiDEX_loading_black.json';

export enum WalletStatus {
  Disconnected = 'Disconnected',
  Connected = 'Connected',
  NotExist = 'NotExist',
  Loading = 'Loading',
  Error = 'Error'
}

type WalletItemProps = {
  wallet: WalletNetwork;
  isActive: boolean;
  handleClickConnect: (wallet: WalletNetwork) => Promise<void>;
  handleClickDisconnect: (wallet: WalletNetwork) => Promise<void>;
  networkType: NetworkType;
  connectStatus: ConnectStatus;
  currentWalletConnecting: WalletNetwork;
};
export const WalletItem = ({
  wallet,
  isActive,
  handleClickConnect,
  handleClickDisconnect,
  networkType,
  connectStatus,
  currentWalletConnecting
}: WalletItemProps) => {
  const theme = useTheme();
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');

  const [status, setStatus] = useState<WalletStatus>(() => {
    const isConnected = walletByNetworks[networkType] && walletByNetworks[networkType] === wallet.nameRegistry;
    if (isConnected) return WalletStatus.Connected;
    return WalletStatus.Disconnected;
  });

  useEffect(() => {
    if (currentWalletConnecting?.nameRegistry === wallet.nameRegistry && connectStatus === 'loading') {
      setStatus(WalletStatus.Loading);
    }
  }, [connectStatus, currentWalletConnecting]);

  const onClickConnect: MouseEventHandler = async (e) => {
    try {
      e.preventDefault();
      await handleClickConnect(wallet);
    } catch (error) {
      console.log({ errorOnClickConnect: error });
    }
  };

  const onClickDisconnect: MouseEventHandler = async (e) => {
    try {
      e.preventDefault();
      await handleClickDisconnect(wallet);
      setStatus(WalletStatus.Disconnected);
    } catch (error) {
      console.log({ errorOnClickDisconnect: error });
    }
  };

  const handleClickWalletItem: MouseEventHandler = (e) => {
    switch (status) {
      case WalletStatus.Connected:
        onClickDisconnect(e);
        break;
      case WalletStatus.Disconnected:
        onClickConnect(e);
        break;
      default:
        break;
    }
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={status}
      disconnect={<Disconnected buttonText="Disconnect" />}
      connected={<Connected buttonText={'Connected'} />}
      connecting={<Connecting buttonText={'Connecting...'} />}
    />
  );

  return (
    <>
      {status === WalletStatus.Loading ? (
        <div
          className={`${styles.walletItem} ${styles[theme]} ${isActive ? null : styles.disabled}`}
          onClick={handleClickWalletItem}
        >
          <div className={styles.loadingIcon}>
            <span>
              <Lottie animationData={OraiDEXLoadingBlack} />
            </span>
          </div>
          <div className={styles.walletName}>{wallet.name + (wallet.suffixName || '')}</div>
          {connectWalletButton}
        </div>
      ) : (
        <div
          className={`${styles.walletItem} ${styles[theme]} ${isActive ? null : styles.disabled}`}
          onClick={handleClickWalletItem}
        >
          <div className={styles.walletIcon}>
            <wallet.icon />
          </div>
          <div className={styles.walletName}>{wallet.name + (wallet.suffixName || '')}</div>
          {connectWalletButton}
        </div>
      )}
    </>
  );
};
