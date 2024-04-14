import { isMobile } from '@walletconnect/browser-utils';
import styles from './MySharePerformance.module.scss';
import { ReactComponent as EyeIcon } from 'assets/icons/ic_eye_vault.svg';
import { Button } from 'components/Button';
import { useState } from 'react';
import { ModalDeposit } from '../ModalDeposit';
import { ModalWithdraw } from '../ModalWithdraw';
import { VaultInfo } from 'pages/Vaults/type';

type ModalVault = 'deposit' | 'withdraw';
export const MySharePerformance = ({ vaultDetail }: { vaultDetail: VaultInfo }) => {
  const [modal, setModal] = useState<ModalVault>();
  const mobileMode = isMobile();

  const secondaryType = mobileMode ? 'secondary-sm' : 'secondary';
  const primaryType = mobileMode ? 'primary-sm' : 'primary';

  const totalTokenBalance = 22000000n;
  const totalShare = 2200000000000000000000000000n;

  return (
    <div className={styles.mySharePerformance}>
      <h3 className={styles.title}>
        My Share Performance
        <EyeIcon width={18} height={18} />
      </h3>

      <div className={styles.performInfo}>
        <div className={styles.key}>Max Available to Withdraw</div>
        <div className={styles.amount}>
          <span>$102</span>
        </div>
      </div>
      <div className={styles.performInfo}>
        <div className={styles.key}>Share Amount</div>
        <div className={styles.amount}>
          <span>
            {/* TODO: need to calculate my share via oraibalance & total supply */}
            {vaultDetail.oraiBalance} {vaultDetail.lpToken.symbol}{' '}
          </span>
        </div>
      </div>
      <div className={styles.cta}>
        <Button type={secondaryType} onClick={() => setModal('withdraw')}>
          Withdraw
        </Button>
        <Button type={primaryType} onClick={() => setModal('deposit')}>
          Deposit
        </Button>
      </div>
      {modal === 'deposit' && (
        <ModalDeposit
          isOpen={modal === 'deposit'}
          open={() => setModal('deposit')}
          close={() => setModal(undefined)}
          totalTokenBalance={totalTokenBalance}
          vaultDetail={vaultDetail}
        />
      )}
      {modal === 'withdraw' && (
        <ModalWithdraw
          isOpen={modal === 'withdraw'}
          open={() => setModal('withdraw')}
          close={() => setModal(undefined)}
          totalShare={totalShare}
          vaultDetail={vaultDetail}
        />
      )}
    </div>
  );
};
