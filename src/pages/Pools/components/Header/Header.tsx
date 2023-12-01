// import bg_claim_btn from 'assets/images/bg_claim_btn.png';
import bg_claim_btn from 'assets/images/christmas/bg-claim.svg';
// import bg_claim_btn_light from 'assets/images/bg_claim_btn_light.png';
import { ExecuteInstruction } from '@cosmjs/cosmwasm-stargate';
import { CW20_DECIMALS, ORAI, ORAI_INFO, USDT_CONTRACT, toDecimal, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import CosmJs from 'libs/cosmjs';
import {
  getStatisticData,
  useGetMyStake,
  useGetPools,
  useGetRewardInfo,
  useGetTotalClaimable
} from 'pages/Pools/hookV3';
import { FC, useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { PoolTableData } from 'pages/Pools';

export const useGetOraiPrice = () => {
  const pools = useGetPools();
  const [oraiPrice, setOraiPrice] = useState(0);

  useEffect(() => {
    if (pools.length === 0) return;
    const oraiUsdtPool = pools.find(
      (pool) =>
        pool.firstAssetInfo === JSON.stringify(ORAI_INFO) &&
        pool.secondAssetInfo ===
          JSON.stringify({
            token: {
              contract_addr: USDT_CONTRACT
            }
          })
    );
    if (!oraiUsdtPool) return;
    const oraiPrice = toDecimal(BigInt(oraiUsdtPool.askPoolAmount), BigInt(oraiUsdtPool.offerPoolAmount));
    setOraiPrice(oraiPrice);
  }, [pools]);

  return oraiPrice;
};

export const Header: FC<{ dataSource: PoolTableData[] }> = ({ dataSource }) => {
  const theme = useTheme();
  const [address] = useConfigReducer('address');
  const { totalStaked, totalEarned } = useGetMyStake({
    stakerAddress: address
  });
  const oraiPrice = useGetOraiPrice();
  const { totalRewardInfoData, refetchRewardInfo } = useGetRewardInfo({ stakerAddr: address });

  const [claimLoading, setClaimLoading] = useState(false);

  const [filterDay, setFilterDay] = useState(30);
  const statisticData = getStatisticData(dataSource);
  const totalClaimable = useGetTotalClaimable({ poolTableData: dataSource, totalRewardInfoData });

  // TODO: get data statistic changed (suffix) by api
  const liquidityData = [
    {
      name: 'Orai Price',
      Icon: theme === 'light' ? OraiLightIcon : OraiIcon,
      suffix: -2.25,
      value: oraiPrice,
      isNegative: true,
      decimal: 2
    },
    {
      name: 'Volume',
      Icon: null,
      suffix: 3.93,
      value: statisticData.volume,
      isNegative: false,
      decimal: 2
    },
    {
      name: 'Total Liquidity',
      Icon: null,
      suffix: 5.25,
      value: toDisplay(parseInt(statisticData.totalLiquidity.toString()).toString()),
      isNegative: false,
      decimal: 2
    }
  ];

  const handleClaimAllRewards = async () => {
    setClaimLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msgs = totalRewardInfoData.reward_infos
        .filter((rewardInfo) => rewardInfo.pending_reward !== '0')
        .map(
          (rewardInfo) =>
            ({
              contractAddress: network.staking,
              msg: { withdraw: { staking_token: rewardInfo.staking_token } },
              funds: null
            } as ExecuteInstruction)
        );

      const result = await CosmJs.executeMultiple({
        msgs,
        walletAddr: address,
        gasAmount: { denom: ORAI, amount: '0' }
      });

      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        refetchRewardInfo();
      }
    } catch (error) {
      console.log('error when claim all reward: ', error);
      handleErrorTransaction(error);
    } finally {
      setClaimLoading(false);
    }
  };

  const disabledClaimBtn = !totalRewardInfoData?.reward_infos?.some((info) => +info.pending_reward > 0) || claimLoading;
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
            <span className={styles.header_liquidity_item_title}>{e.name}</span>
            <div className={styles.header_liquidity_item_info}>
              {e.Icon && (
                <div className={styles.liq_prefix}>
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
