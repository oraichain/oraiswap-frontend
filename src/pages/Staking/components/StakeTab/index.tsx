import styles from './index.module.scss';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { ReactComponent as BlinkIcon } from 'assets/icons/blinkIcon.svg';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { oraichainTokens, toDisplay } from '@oraichain/oraidex-common';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd } from 'libs/utils';
import InputBalance from '../InputBalance';
import { RootState } from 'store/configure';
import { useSelector } from 'react-redux';

const StakeTab = () => {
  const { data: prices } = useCoinGeckoPrices();
  const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');

  const amounts = useSelector((state: RootState) => state.token.amounts);
  const balance = amounts['oraix'];

  const monthlyUSD = getUsd('2', USDC_TOKEN_INFO, prices);
  const yearlyUSD = getUsd('5', USDC_TOKEN_INFO, prices);

  return (
    <div className={styles.stakeTab}>
      <InputBalance balance={balance} />

      <div className={styles.result}>
        <div className={styles.header}>
          <span>You’ll earn</span>

          <div className={styles.highlight}>
            <BlinkIcon />
            <span>More benefits to come</span>
          </div>
        </div>

        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.title}>
              <span>Monthly</span>
              <div className={styles.usd}>{formatDisplayUsdt(monthlyUSD)}</div>
            </div>

            <div className={styles.value}>
              <UsdcIcon />
              <span>{numberWithCommas(toDisplay('33333123'))}</span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.title}>
              <span>Yearly</span>
              <div className={styles.usd}>{formatDisplayUsdt(yearlyUSD)}</div>
            </div>

            <div className={styles.value}>
              <UsdcIcon />
              <span>{numberWithCommas(toDisplay('33333123'))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeTab;
