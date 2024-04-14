import { TokenItemType } from '@oraichain/oraidex-common';
import { ReactComponent as BoostIconDark } from 'assets/icons/ic_apr_boost_dark.svg';
import { ReactComponent as BoostIconLight } from 'assets/icons/ic_apr_boost_light.svg';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import useTheme from 'hooks/useTheme';
import { VaultInfo } from 'pages/Vaults/type';
import { useNavigate } from 'react-router-dom';
import styles from './VaultItem.module.scss';

export const VaultItem = ({ info }: { info: VaultInfo }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/vaults/${info.vaultAddr}`);
  };

  if (!info) return null;

  const generateIcon = (baseToken: TokenItemType, quoteToken: TokenItemType): JSX.Element => {
    let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];

    if (baseToken) BaseTokenIcon = theme === 'light' ? baseToken.IconLight : baseToken.Icon;
    if (quoteToken) QuoteTokenIcon = theme === 'light' ? quoteToken.IconLight : quoteToken.Icon;

    return (
      <div className={styles.symbols}>
        <BaseTokenIcon className={styles.symbols_logo_left} />
        <QuoteTokenIcon className={styles.symbols_logo_right} />
      </div>
    );
  };

  return (
    <div className={styles.vaultItem} onClick={goToDetail}>
      <div className={styles.vaultHead}>
        <div className={styles.strategy}>
          <div className={styles.strategyLogo}>{generateIcon(info.tokenInfo0, info.tokenInfo1)}</div>
          <div className={styles.strategyName}>
            <div className={styles.strategyNameTitle}>Strategy</div>
            <div className={styles.strategyNameValue}>
              {info.token0.symbol}/{info.token1.symbol}
            </div>
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
              <div className={`${styles.infoDetail} ${styles.myShare}`}>{info.oraiBalance}</div>
            </div>
          </div>
          <div className={styles.infoTopSection}>
            <div className={styles.infoTitle}>TVL</div>
            <div className={`${styles.infoDetail} ${styles.myShare}`}>${info.tvl}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
