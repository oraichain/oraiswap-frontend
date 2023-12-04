import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import { useEffect, useState } from 'react';
import { xOCH_PRICE } from '../constants';
import { getClaimableInfoByPool } from '../helpers';

export const getClaimableAmountByPool = async ({ pool, totalRewardInfoData, cachePrices }) => {
  const results = getClaimableInfoByPool({ pool, totalRewardInfoData });

  const res = await Promise.all(results);

  const total = res.reduce((acc, cur) => {
    const eachBalance = getUsd(cur.amount, cur, cachePrices, cur.coinGeckoId === 'scatom' && xOCH_PRICE);

    acc = acc + eachBalance;

    return acc;
  }, 0);

  return total;
};

export const useGetPoolsWithClaimableAmount = ({ poolTableData, totalRewardInfoData }) => {
  const [cachePrices] = useConfigReducer('coingecko');
  const [listClaimable, setListClaimable] = useState<
    {
      liquidityAddr: string;
      amountEachPool: number;
    }[]
  >([]);
  const promiseClaimAmounts = poolTableData.map(async (pool) => {
    const amountEachPool = await getClaimableAmountByPool({ pool, totalRewardInfoData, cachePrices });

    return {
      liquidityAddr: pool.liquidityAddr,
      amountEachPool: amountEachPool
    };
  });

  useEffect(() => {
    (async () => {
      if (totalRewardInfoData) {
        const res = await Promise.all(promiseClaimAmounts);

        if (res) {
          setListClaimable(res);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalRewardInfoData, poolTableData, cachePrices]);

  return listClaimable;
};
