import { Button } from 'components/Button';
import type { Wallet } from 'components/WalletManagement/ModalChooseWallet/ModalChooseWallet';
import styles from './WalletItem.module.scss';
import { ConnectStatus } from '../WalletByNetwork';
import useTheme from 'hooks/useTheme';

type WalletItemProps = {
  wallet: Wallet;
  setConnectStatus: React.Dispatch<React.SetStateAction<ConnectStatus>>;
  connectStatus: ConnectStatus;
};

export const WalletItem = ({ wallet, connectStatus, setConnectStatus }: WalletItemProps) => {
  const theme = useTheme();

  return (
    <div className={`${styles.walletItem} ${styles[theme]}`} onClick={() => setConnectStatus('confirming-switch')}>
      <div className={styles.walletIcon}>
        <wallet.icon />
      </div>
      <div className={styles.walletName}>{wallet.name}</div>
      <Button type="primary-sm" onClick={() => {}}>
        Connected
      </Button>
    </div>
  );
};
