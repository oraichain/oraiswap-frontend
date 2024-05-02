import { VaultInfo } from 'pages/Vaults/type';
import styles from './VaultDetailOverview.module.scss';
import { formatDisplayUsdt } from 'helper/format';

export const VaultDetailOverview = ({ vaultDetail }: { vaultDetail: VaultInfo }) => {
  return (
    <section className={styles.vaultOverview}>
      <div className={styles.overviewContainer}>
        <div className={styles.info}>
          <h4>Share Price</h4>
          <div className={styles.infoValue}>
            <span>{formatDisplayUsdt(vaultDetail.sharePrice, undefined, '$')}</span>
          </div>
        </div>
        <div className={styles.info}>
          <h4>TVL</h4>
          <div className={styles.infoValue}>
            <span>{formatDisplayUsdt(vaultDetail.tvl, 2, '$')}</span>
          </div>
        </div>
        <div className={styles.info}>
          <h4>APR (All-time)</h4>
          <div className={styles.infoValue}>
            <span>{formatDisplayUsdt(vaultDetail.aprAllTime, 2)}%</span>
          </div>
        </div>
        <div className={styles.info}>
          <h4>Daily APR</h4>
          <div className={styles.infoValue}>
            <span>{formatDisplayUsdt(vaultDetail.aprDaily, 2)}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
