import styles from './Earning.module.scss';
import { ReactComponent as DownIcon } from 'assets/icons/ic_down.svg';
import { Button } from 'components/Button';

export const Earning = () => {
  return (
    <section className={styles.earning}>
      <div className={styles.earningLeft}>
        <div className={styles.assetEarning}>
          <div className={styles.title}>ORAI Earning</div>
          <div className={styles.amount}>$1.24</div>
          <div className={styles.amountOrai}>0.52 ORAI</div>
        </div>
        <div className={styles.assetEarning}>
          <div className={styles.title}>ORAIX Earning</div>
          <div className={styles.amount}>$1.24</div>
          <div className={styles.amountOrai}>0.52 ORAIX</div>
        </div>
      </div>

      <div className={styles.claim}>
        <Button type="primary" onClick={() => {}}>
          Claim Your Earned
        </Button>
        <div className={styles.earnMore}>
          <div>
            Add more liquidity to earn more <DownIcon className={styles.downIcon} />
          </div>
        </div>
      </div>
    </section>
  );
};
