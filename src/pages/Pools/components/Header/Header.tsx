import { CW20_DECIMALS } from '@oraichain/oraidex-common/build/constant';
import { toDisplay } from '@oraichain/oraidex-common/build/helper';
import bg_claim_btn from 'assets/images/christmas/bg-claim.svg';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import TokenBalance from 'components/TokenBalance';
import { useClaimAllReward } from 'pages/Pools/hooks/useClaimAllReward';
import { useGetTotalClaimable } from 'pages/Pools/hooks/useGetTotalClaimable';
import { FC, useState } from 'react';
import { PoolTableData } from 'types/pool';
import styles from './Header.module.scss';

export const Header: FC<{ dataSource: PoolTableData[] }> = ({ dataSource }) => {
  const {
    totalEarned,
    totalStaked,
    liquidityData,
    claimLoading,
    disabledClaimBtn,
    totalRewardInfoData,
    handleClaimAllRewards
  } = useClaimAllReward(dataSource);

  const [filterDay, setFilterDay] = useState(30);
  const totalClaimable = useGetTotalClaimable({ poolTableData: dataSource, totalRewardInfoData });

  return (
    <div className={styles.header}>
      <div className={styles.header_title}>
        <span className={styles.header_title_text}>POOLS</span>
        {/* <div className={styles.filter_day_wrapper}>
          {[1, 7, 30].map((e) => {
            return (
              <button
                key={'day-key-' + e}
                className={`${styles.filter_day}${' '}${e === filterDay ? styles.active : ''}`}
                onClick={() => setFilterDay(e)}
              >
                {e}D
              </button>
            );
          })}
        </div> */}
      </div>

      <div className={styles.header_liquidity}>
        {liquidityData.map((e) => (
          <div key={e.name} className={styles.header_liquidity_item}>
            <span>{e.name}</span>
            <div className={styles.header_liquidity_item_info}>
              {e.Icon && (
                <div>
                  <e.Icon />
                </div>
              )}
              <TokenBalance balance={e.value} prefix="$" className={styles.liq_value} decimalScale={e.decimal || 6} />
              {/* <TokenBalance
                balance={e.suffix}
                prefix={e.isNegative ? '' : '+'}
                suffix="%"
                className={`${styles.liq_suffix}${' '}${e.isNegative ? styles.negative : ''}`}
                decimalScale={2}
              /> */}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.header_claimable}>
        <div className={styles.header_data}>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Total Staked LP</span>
            <br />
            <TokenBalance
              balance={toDisplay(BigInt(Math.trunc(totalStaked)), CW20_DECIMALS)}
              prefix="$"
              className={styles.header_data_value}
              decimalScale={4}
            />
            {/* &nbsp;
            <TokenBalance
              balance={-0.2}
              suffix="%"
              className={styles.header_data_change}
              decimalScale={2}
            /> */}
          </div>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Total Earned</span>
            <br />
            <TokenBalance
              balance={toDisplay(BigInt(Math.trunc(totalEarned)), CW20_DECIMALS)}
              prefix="$"
              className={styles.header_data_value}
              decimalScale={4}
            />
          </div>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Total Claimable Rewards</span>
            <br />
            <span className={styles.header_data_value}>
              <TokenBalance
                balance={totalClaimable}
                prefix="+$"
                className={styles.header_data_value}
                decimalScale={4}
              />
            </span>
          </div>
        </div>
        <div className={styles.header_claim_reward}>
          <div className={styles.claim_reward_bg}>
            {/* <img src={theme === 'light' ? bg_claim_btn : bg_claim_btn_light} alt="bg-claim-reward" /> */}
            <img src={bg_claim_btn} alt="bg-claim-reward" />
          </div>
          <Button
            type="primary-sm"
            disabled={disabledClaimBtn}
            onClick={() => handleClaimAllRewards()}
            icon={claimLoading ? <Loader width={20} height={20} /> : null}
          >
            Claim All Rewards
          </Button>
        </div>
      </div>
    </div>
  );
};
