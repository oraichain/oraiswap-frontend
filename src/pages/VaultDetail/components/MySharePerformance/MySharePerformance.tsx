import { isMobile } from '@walletconnect/browser-utils';
import styles from './MySharePerformance.module.scss';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';
import { ReactComponent as EyeIcon } from 'assets/icons/ic_eye_vault.svg';
import { Button } from 'components/Button';
import { useState } from 'react';
import { ModalDeposit } from '../ModalDeposit';
import { ModalWithdraw } from '../ModalWithdraw';

type ModalVault = 'deposit' | 'withdraw';
export const MySharePerformance = () => {
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
          <span>102 USDT</span>
          <UsdtIcon width={24} height={24} />
        </div>
      </div>
      <div className={styles.performInfo}>
        <div className={styles.key}>Share Amount</div>
        <div className={styles.amount}>
          <span>102 USDT</span>
          <UsdtIcon width={24} height={24} />
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
        />
      )}
      {modal === 'withdraw' && (
        <ModalWithdraw
          isOpen={modal === 'withdraw'}
          open={() => setModal('withdraw')}
          close={() => setModal(undefined)}
          totalShare={totalShare}
        />
      )}
    </div>
  );
};
