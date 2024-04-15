import { VaultInfo } from 'pages/Vaults/type';
import styles from './StrategyExplainedTab.module.scss';

export const StrategyExplainedTab = ({ vaultDetail }: { vaultDetail: VaultInfo }) => {
  return (
    <section className={styles.explain}>
      <div className={styles.explainContent}>
        <h3>How it work</h3>
        <p>{vaultDetail.howItWork}</p>
      </div>
      <div className={styles.explainContent}>
        <h3>Strategy Explained</h3>
        <p>{vaultDetail.strategyExplain}</p>
      </div>
    </section>
  );
};
