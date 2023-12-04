import { ExecuteInstruction } from '@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient';
import { ORAI, ORAI_INFO, USDT_CONTRACT } from '@oraichain/oraidex-common/build/constant';
import { toDecimal, toDisplay } from '@oraichain/oraidex-common/build/helper';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import CosmJs from 'libs/cosmjs';
import { useEffect, useState } from 'react';
import { PoolTableData } from 'types/pool';
import { getStatisticData } from '../helpers';
import { useGetPools } from './useGetPools';
import { useGetRewardInfo } from './useGetRewardInfo';
import { useGetMyStake } from './useGetMyStake';

export const useClaimAllReward = (dataSource: PoolTableData[]) => {
  const theme = useTheme();
  const pools = useGetPools();
  const [address] = useConfigReducer('address');
  const [oraiPrice, setOraiPrice] = useState(0);
  const statisticData = getStatisticData(dataSource);
  const { totalRewardInfoData, refetchRewardInfo } = useGetRewardInfo({ stakerAddr: address });
  const [claimLoading, setClaimLoading] = useState(false);
  const { totalStaked, totalEarned } = useGetMyStake({
    stakerAddress: address
  });

  const disabledClaimBtn = !totalRewardInfoData?.reward_infos?.some((info) => +info.pending_reward > 0) || claimLoading;

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

  return {
    totalEarned,
    totalStaked,
    liquidityData,
    claimLoading,
    disabledClaimBtn,
    totalRewardInfoData,
    handleClaimAllRewards
  };
};
