import { oraichainTokens, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';

import useConfigReducer from 'hooks/useConfigReducer';

import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import styles from './index.module.scss';

const StakeInfo = () => {
  const [theme] = useConfigReducer('theme');
  const { data: prices } = useCoinGeckoPrices();
  const ORAIX_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
  const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');

  const stakeAmountUsd = getUsd('1', USDC_TOKEN_INFO, prices);
  const rewardUsd = getUsd('2', ORAIX_TOKEN_INFO, prices);

  return (
    <div className={styles.stakeInfo}>
      <div className={styles.item}>
        <div className={styles.title}>Staked Amount</div>

        <div className={styles.usd}>{formatDisplayUsdt(stakeAmountUsd)}</div>

        <div className={styles.value}>
          {theme === 'light' ? <OraiXLightIcon /> : <OraiXIcon />}
          <span>{numberWithCommas(toDisplay('1333323'))} ORAIX</span>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>Received Rewards</div>

        <div className={styles.usd}>{formatDisplayUsdt(rewardUsd)}</div>

        <div className={styles.value}>
          <UsdcIcon />
          <span>{numberWithCommas(toDisplay('33333123'))} ORAIX</span>
        </div>
      </div>
    </div>
  );
};

export default StakeInfo;
