import { Button } from 'components/Button';
import type { Wallet } from 'components/Wallet/ChooseWallet/ChooseWallet';
import styles from './WalletItem.module.scss';

export const WalletItem = ({ wallet }: { wallet: Wallet }) => {
  return (
    <div className={styles.walletItem} onClick={async () => {}}>
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
