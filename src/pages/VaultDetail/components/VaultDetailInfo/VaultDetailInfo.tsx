import styles from './VaultDetailInfo.module.scss';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import useTheme from 'hooks/useTheme';
import { VaultDetailOverview } from '../VaultDetailOverview';
import { VaultInfoTabs } from '../VaultInfoTabs';

export const VaultDetailInfo = () => {
  const theme = useTheme();
  return (
    <div className={styles.vaultDetailInfo}>
      <div className={styles.vaultName}>
        <div className={styles.strategy}>
          <div className={styles.strategyLogo}>
            {theme === 'dark' ? <OraiIcon width={48} height={48} /> : <OraiLightIcon width={48} height={48} />}
          </div>
          <div className={styles.strategyName}>
            <div className={styles.strategyNameTitle}>Strategy</div>
            <div className={styles.strategyNameValue}>ORAI</div>
          </div>
        </div>
      </div>
      <VaultDetailOverview />
      <VaultInfoTabs />
    </div>
  );
};
