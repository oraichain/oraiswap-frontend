import { oraichainTokens, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import { numberWithCommas } from 'pages/Pools/helpers';
import { STAKE_TAB } from 'pages/Staking/constants';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import InputBalance from '../InputBalance';
import styles from './index.module.scss';

const StakeTab = () => {
  const [theme] = useConfigReducer('theme');
  const { data: prices } = useCoinGeckoPrices();
  const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');

  const amounts = useSelector((state: RootState) => state.token.amounts);
  const balance = amounts['oraix'];

  const monthlyUSD = getUsd('2', USDC_TOKEN_INFO, prices);
  const yearlyUSD = getUsd('5', USDC_TOKEN_INFO, prices);

  const listUnstake = [
    {
      startTime: new Date(),
      amount: '123456677'
    },
    {
      startTime: new Date(),
      amount: '123456677'
    },
    {
      startTime: new Date(),
      amount: '123456677'
    },
    {
      startTime: new Date(),
      amount: '123456677'
    },
    {
      startTime: new Date(),
      amount: '123456677'
    },
    {
      startTime: new Date(),
      amount: '123456677'
    },
    {
      startTime: new Date(),
      amount: '44444433434'
    }
  ];

  return (
    <div className={styles.unstakeTab}>
      <InputBalance balance={balance} label="Stake amount" type={STAKE_TAB.UnStake} />

      <div className={styles.note}>
        To withdraw your stake, you will need to activate{' '}
        <span className={styles.noteHighlight}>a 30-day unbonding period</span>. You may unstake at any time, but your
        tokens will become available again only after this duration
      </div>

      <div className={styles.result}>
        <div className={styles.header}>
          <span>Unstaking</span>
        </div>

        {listUnstake?.length <= 0 ? null : (
          <div className={styles.list}>
            {listUnstake.map((unstakeItem, key) => {
              return (
                <div className={styles.item} key={key + unstakeItem.startTime.toDateString()}>
                  <div className={styles.title}>
                    <span>20 days left</span>
                    <div className={styles.pie}>
                      <div
                        className={styles.progress}
                        style={{
                          background:
                            theme === 'light'
                              ? `conic-gradient(#2F5711 ${60}%, #EFEFEF ${60}%)`
                              : `conic-gradient(#92E54C ${60}%, #494949 ${60}%)`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.value}>
                    {theme === 'light' ? <OraiXLightIcon /> : <OraiXIcon />}
                    <span>{numberWithCommas(toDisplay(unstakeItem.amount))}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StakeTab;
