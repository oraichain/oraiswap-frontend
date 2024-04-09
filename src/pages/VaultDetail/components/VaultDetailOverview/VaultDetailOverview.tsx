import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';
import styles from './VaultDetailOverview.module.scss';

export const VaultDetailOverview = () => {
  return (
    <section className={styles.vaultOverview}>
      <div className={styles.overviewContainer}>
        <div className={styles.info}>
          <h4>Share Price</h4>
          <div className={styles.infoValue}>
            <span>1.047 USDT</span>
            <UsdtIcon width={20} height={20} />
          </div>
        </div>
        <div className={styles.info}>
          <h4>TVL</h4>
          <div className={styles.infoValue}>
            <span>1.047K USDT</span>
            <UsdtIcon width={20} height={20} />
          </div>
        </div>
        <div className={styles.info}>
          <h4>APR (All-time)</h4>
          <div className={styles.infoValue}>
            <span>0.06%</span>
          </div>
        </div>
        <div className={styles.info}>
          <h4>Daily APR</h4>
          <div className={styles.infoValue}>
            <span>0.06%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
