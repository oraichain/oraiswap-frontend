import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { PoolInfoResponse } from 'types/pool';
import { getClaimableInfoByPool } from '../helpers';

export const getTotalClaimable = async ({ poolTableData, totalRewardInfoData }) => {
  const promiseRes = [];

  poolTableData.map((e) => {
    const results = getClaimableInfoByPool({ pool: e, totalRewardInfoData });
    promiseRes.push(...results);
  });

  const res = await Promise.all(promiseRes);

  return res;
};

export const useGetTotalClaimable = ({ poolTableData, totalRewardInfoData }) => {
  const [cachePrices] = useConfigReducer('coingecko');
  const [totalClaim, setTotalClaim] = useState();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);

  const isPoolWithLiquidity = (pool: PoolInfoResponse) => {
    const liquidityAddress = pool?.liquidityAddr;
    return parseInt(lpPools[liquidityAddress]?.balance) > 0;
  };

  const findBondAmount = (pool: PoolInfoResponse) => {
    if (!totalRewardInfoData) return 0;
    const rewardInfo = totalRewardInfoData.reward_infos.find(({ staking_token }) =>
      isEqual(staking_token, pool.liquidityAddr)
    );
    return rewardInfo ? parseInt(rewardInfo.bond_amount) : 0;
  };

  const myPools = poolTableData.filter((pool) => isPoolWithLiquidity(pool) || findBondAmount(pool) > 0);

  useEffect(() => {
    (async () => {
      if (totalRewardInfoData) {
        const res = await getTotalClaimable({ poolTableData: myPools, totalRewardInfoData });
        const total = res.reduce((acc, cur) => {
          const eachBalance = getUsd(cur.amount, cur, cachePrices);

          acc = acc + eachBalance;

          return acc;
        }, 0);

        if (res) {
          setTotalClaim(total);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalRewardInfoData, poolTableData, cachePrices]);

  return totalClaim;
};
