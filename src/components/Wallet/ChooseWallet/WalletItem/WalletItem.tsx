import { Button } from 'components/Button';
import type { Wallet } from 'components/Wallet/ChooseWallet/ChooseWallet';
import styles from './WalletItem.module.scss';
import { ConnectStatus } from '../WalletByNetwork';

type WalletItemProps = {
  wallet: Wallet;
  setConnectStatus: React.Dispatch<React.SetStateAction<ConnectStatus>>;
  connectStatus: ConnectStatus;
};

export const WalletItem = ({ wallet, connectStatus, setConnectStatus }: WalletItemProps) => {
  return (
    <div className={styles.walletItem} onClick={() => setConnectStatus('confirming')}>
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
