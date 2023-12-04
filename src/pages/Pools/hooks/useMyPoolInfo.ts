import useConfigReducer from 'hooks/useConfigReducer';
import { useParams } from 'react-router-dom';
import { useGetPoolDetail } from './useGetPoolDetail';
import { useGetPairInfo } from './useGetPairInfo';
import { useGetRewardInfoDetail } from './useGetRewardInfo';
import { useEffect, useState } from 'react';

export const useMyPoolInfo = (myLpBalance: bigint) => {
  const { poolUrl } = useParams();
  const [address] = useConfigReducer('address');

  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { lpTokenInfoData } = useGetPairInfo(poolDetail);
  const { totalRewardInfoData } = useGetRewardInfoDetail({
    stakerAddr: address,
    poolInfo: poolDetail.info
  });

  const [lpBalance, setLpBalance] = useState({
    myLiquidityInUsdt: 0n,
    lpPrice: 0
  });

  // calculate LP price, my LP balance in usdt
  useEffect(() => {
    if (!poolDetail.info) return;
    const totalSupply = lpTokenInfoData?.total_supply;
    if (!totalSupply) return;

    const lpPrice = poolDetail.info.totalLiquidity / Number(totalSupply);
    if (!lpPrice) return;

    const myLiquidityInUsdt = Number(myLpBalance) * lpPrice;
    setLpBalance({
      myLiquidityInUsdt: BigInt(Math.trunc(myLiquidityInUsdt)),
      lpPrice
    });
  }, [lpTokenInfoData, myLpBalance, poolDetail.info]);

  const totalBondAmount = BigInt(totalRewardInfoData?.reward_infos[0]?.bond_amount || '0');
  const totalBondAmountInUsdt = BigInt(Math.trunc(lpBalance.lpPrice ? Number(totalBondAmount) * lpBalance.lpPrice : 0));

  return {
    poolUrl,
    lpBalance,
    totalBondAmount,
    totalBondAmountInUsdt
  };
};
