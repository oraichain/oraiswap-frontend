import { ReactComponent as WithdrawIcon } from 'assets/icons/ic_withdraw.svg';
import { ReactComponent as DepositIcon } from 'assets/icons/ic_deposit.svg';
import { Button } from 'components/Button';
import styles from './MyPoolInfo.module.scss';

export const MyPoolInfo = () => {
  return (
    <section className={styles.myPoolInfo}>
      <div className={styles.liquidity}>
        <div>
          <div className={styles.title}>My Liquidity</div>
          <div>Swap your tokens into Liquidity Points</div>
        </div>
        <div className={styles.amount}>
          <div>$0</div>
          <div>0.00 LP</div>
        </div>
        <div className={styles.cta}>
          <Button type="secondary" onClick={() => console.log('ok')}>
            <WithdrawIcon />
            Withdraw LP
          </Button>
          <Button type="primary" onClick={() => console.log('ok')}>
            <DepositIcon />
            Deposit
          </Button>
        </div>
      </div>
      <div className={styles.stake}>
        <div>
          <div className={styles.title}>My Staked</div>
          <div>Stake your Liquidity Points to earn tokens</div>
        </div>
        <div className={styles.amount}>
          <div>$0</div>
          <div>0.00 LP</div>
        </div>
        <div className={styles.cta}>
          <Button type="secondary" onClick={() => console.log('ok')}>
            Unstake LP
          </Button>
          <Button type="primary" onClick={() => console.log('ok')}>
            Stake LP
          </Button>
        </div>
      </div>
    </section>
  );
};
