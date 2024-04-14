import { VaultInfo } from 'pages/Vaults/type';
import styles from './VaultDetailOverview.module.scss';

export const VaultDetailOverview = ({ vaultDetail }: { vaultDetail: VaultInfo }) => {
  const sharePrice = vaultDetail ? vaultDetail.totalSupply : '-';
  return (
    <section className={styles.vaultOverview}>
      <div className={styles.overviewContainer}>
        <div className={styles.info}>
          <h4>Share Price</h4>
          <div className={styles.infoValue}>
            <span>${sharePrice}</span>
          </div>
        </div>
        <div className={styles.info}>
          <h4>TVL</h4>
          <div className={styles.infoValue}>
            <span>{vaultDetail.tvl}</span>
          </div>
        </div>
        <div className={styles.info}>
          <h4>APR (All-time)</h4>
          <div className={styles.infoValue}>
            <span>{vaultDetail.aprAllTime}%</span>
          </div>
        </div>
        <div className={styles.info}>
          <h4>Daily APR</h4>
          <div className={styles.infoValue}>
            <span>{vaultDetail.aprDaily}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
