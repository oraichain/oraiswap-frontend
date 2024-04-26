import { isMobile } from '@walletconnect/browser-utils';
import useTheme from 'hooks/useTheme';
import { MySharePerformance } from '../MySharePerformance';
import { VaultDetailOverview } from '../VaultDetailOverview';
import { VaultInfoTabs } from '../VaultInfoTabs';
import styles from './VaultDetailInfo.module.scss';
import { TokenItemType } from '@oraichain/oraidex-common';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { VaultInfo } from 'pages/Vaults/type';

export const VaultDetailInfo = ({ vaultDetail }: { vaultDetail: VaultInfo }) => {
  const theme = useTheme();
  const mobileMode = isMobile();

  const generateIcon = (baseToken: TokenItemType, quoteToken: TokenItemType): JSX.Element => {
    let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];

    if (baseToken) BaseTokenIcon = theme === 'light' ? baseToken.IconLight : baseToken.Icon;
    if (quoteToken) QuoteTokenIcon = theme === 'light' ? quoteToken.IconLight : quoteToken.Icon;

    return (
      <div className={styles.symbols}>
        <BaseTokenIcon width={30} height={30} className={styles.symbols_logo_left} />
        <QuoteTokenIcon width={30} height={30} className={styles.symbols_logo_right} />
      </div>
    );
  };

  return (
    <div className={styles.vaultDetailInfo}>
      <div className={styles.vaultName}>
        <div className={styles.strategy}>
          <div className={styles.strategyLogo}>{generateIcon(vaultDetail.tokenInfo0, vaultDetail.tokenInfo1)}</div>
          <div className={styles.strategyName}>
            <div className={styles.strategyNameTitle}>Strategy</div>
            <div className={styles.strategyNameValue}>
              {vaultDetail.token0.symbol}/{vaultDetail.token1.symbol}
            </div>
          </div>
        </div>
      </div>
      <VaultDetailOverview vaultDetail={vaultDetail} />
      {mobileMode && <MySharePerformance vaultDetail={vaultDetail} />}
      <VaultInfoTabs vaultDetail={vaultDetail} />
    </div>
  );
};
