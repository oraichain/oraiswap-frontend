import { ReactComponent as BoostIconDark } from 'assets/icons/ic_apr_boost_dark.svg';
import { ReactComponent as BoostIconLight } from 'assets/icons/ic_apr_boost_light.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';
import useTheme from 'hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import styles from './VaultItem.module.scss';
import { VaultInfo } from 'pages/Vaults/hooks/useVaults';

export const VaultItem = ({ info }: { info: VaultInfo }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/vaults/123`);
  };

  if (!info) return null;

  return (
    <div className={styles.vaultItem} onClick={goToDetail}>
      <div className={styles.vaultHead}>
        <div className={styles.strategy}>
          <div className={styles.strategyLogo}>
            <OraiIcon width={48} height={48} />
          </div>
          <div className={styles.strategyName}>
            <div className={styles.strategyNameTitle}>Strategy</div>
            <div className={styles.strategyNameValue}>{info.symbols.join('/')}</div>
          </div>
        </div>
      </div>
      <div className={styles.vaultContent}>
        <div className={styles.vaultDescription}>{info.description}</div>
        <div className={styles.vaultInfo}>
          <div className={styles.infoTop}>
            <div className={styles.infoTopSection}>
              <div className={styles.infoTitle}>APR</div>
              <div className={`${styles.infoDetail} ${styles.infoApr}`}>
                {theme === 'dark' ? <BoostIconDark /> : <BoostIconLight />}
                {info.apr}%
              </div>
            </div>
            <div className={styles.infoTopSection}>
              <div className={styles.infoTitle}>My Share</div>
              <div className={`${styles.infoDetail} ${styles.myShare}`}>
                ${info.myShare}
                {/* <UsdtIcon width={20} height={20} /> */}
              </div>
            </div>
          </div>
          <div className={styles.infoTopSection}>
            <div className={styles.infoTitle}>TVL</div>
            <div className={`${styles.infoDetail} ${styles.myShare}`}>
              ${info.tvlByUsd} ({info.tvlByToken0} {info.symbols[0]})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
