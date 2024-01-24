import type { WalletNetwork, NetworkType } from 'components/WalletManagement/walletConfig';
import useTheme from 'hooks/useTheme';
import useWalletReducer from 'hooks/useWalletReducer';
import { MouseEventHandler, useState } from 'react';
import { Connected, Disconnected, WalletConnectComponent } from './WalletConnect';
import styles from './WalletItem.module.scss';

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
};
export const WalletItem = ({
  wallet,
  isActive,
  handleClickConnect,
  handleClickDisconnect,
  networkType
}: WalletItemProps) => {
  const theme = useTheme();
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');

  const [status, setStatus] = useState<WalletStatus>(() => {
    const isConnected = walletByNetworks[networkType] && walletByNetworks[networkType] === wallet.nameRegistry;
    if (isConnected) return WalletStatus.Connected;
    return WalletStatus.Disconnected;
  });

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

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={status}
      disconnect={<Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />}
      connected={<Connected buttonText={'Connected'} onClick={onClickDisconnect} />}
    />
  );

  return (
    <div className={`${styles.walletItem} ${styles[theme]} ${isActive ? null : styles.disabled}`}>
      <div className={styles.walletIcon}>
        <wallet.icon />
      </div>
      <div className={styles.walletName}>{wallet.name}</div>
      {connectWalletButton}
    </div>
  );
};
