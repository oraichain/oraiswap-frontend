import { useWallet } from '@cosmos-kit/react';
import type { Wallet } from 'components/WalletManagement/ModalChooseWallet/ModalChooseWallet';
import { getListAddressCosmos, switchWalletCosmos } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { MouseEventHandler, useEffect } from 'react';
import { ConnectStatus } from '../WalletByNetwork';
import {
  Connected,
  Connecting,
  Disconnected,
  Error,
  NotExist,
  Rejected,
  WalletConnectComponent
} from './WalletConnect';
import styles from './WalletItem.module.scss';
type WalletItemProps = {
  wallet: Wallet;
  setConnectStatus: React.Dispatch<React.SetStateAction<ConnectStatus>>;
  connectStatus: ConnectStatus;
  currentWallet?: string;
  setCurrentWalletConnected: React.Dispatch<any>;
  setCurrentWalletConnecting: React.Dispatch<any>;
  isActive: boolean;
};

export const WalletItem = ({
  wallet,
  connectStatus,
  setConnectStatus,
  currentWallet,
  setCurrentWalletConnected,
  setCurrentWalletConnecting,
  isActive
}: WalletItemProps) => {
  const theme = useTheme();
  const walletClient = useWallet(wallet.nameRegistry);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_oraiAddress, setOraiAddress] = useConfigReducer('address');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_cosmosAddress, setCosmosAddress] = useConfigReducer('cosmosAddress');

  useEffect(() => {
    if (walletClient?.mainWallet?.walletStatus === 'Connected') {
      setCurrentWalletConnected(walletClient.mainWallet);
    }
  }, [walletClient]);

  const onClickConnect: MouseEventHandler = async (e) => {
    try {
      e.preventDefault();
      if (currentWallet && currentWallet !== walletClient.mainWallet?.walletName) {
        setConnectStatus('confirming-switch');
        setCurrentWalletConnecting(walletClient.mainWallet);
      } else {
        switchWalletCosmos(
          walletClient.mainWallet.walletName === 'owallet-extension'
            ? 'owallet'
            : walletClient.mainWallet.walletName === 'keplr-extension'
            ? 'keplr'
            : 'leapSnap'
        );
        await walletClient.mainWallet.connect();
        const oraiAddr = await window.Keplr.getKeplrAddr();
        setOraiAddress(oraiAddr);
        const { listAddressCosmos } = await getListAddressCosmos(oraiAddr);
        setCosmosAddress(listAddressCosmos);
        setCurrentWalletConnected(walletClient.mainWallet);
      }
    } catch (error) {
      setConnectStatus('failed');
    }
  };

  const onClickDisconnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    setCurrentWalletConnected(walletClient.mainWallet);
    setConnectStatus('confirming-disconnect');
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletClient?.mainWallet?.walletStatus}
      isActive={isActive}
      disconnect={<Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />}
      connecting={<Connecting />}
      connected={<Connected buttonText={'Connected'} onClick={onClickDisconnect} />}
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickConnect} />}
      notExist={<NotExist buttonText="Not Exist" onClick={() => {}} />}
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
