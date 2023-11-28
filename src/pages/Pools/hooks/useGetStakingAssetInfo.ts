import { useEffect, useState } from 'react';
import { useGetPoolDetail } from '../hookV3';
import { useParams } from 'react-router-dom';
import { Pairs } from 'config/pools';
import { AssetInfo } from '@oraichain/oraidex-contracts-sdk';

export const useGetStakingAssetInfo = () => {
  let { poolUrl } = useParams();
  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { info } = poolDetail;

  const [stakingAssetInfo, setStakingAssetInfo] = useState<AssetInfo>();

  useEffect(() => {
    if (!info) return;
    const stakingAssetInfo = Pairs.getStakingAssetInfo([
      JSON.parse(info.firstAssetInfo),
      JSON.parse(info.secondAssetInfo)
    ]);
    setStakingAssetInfo(stakingAssetInfo);
  }, [info]);

  return stakingAssetInfo;
};

export const useGetLiquidityToken = () => {
  let { poolUrl } = useParams();
  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { info } = poolDetail;

  const [liquidityToken, setLiquidityToken] = useState<string>();

  useEffect(() => {
    if (!info) return;
    setLiquidityToken(info?.liquidityAddr);
  }, [info]);

  return liquidityToken;
};
