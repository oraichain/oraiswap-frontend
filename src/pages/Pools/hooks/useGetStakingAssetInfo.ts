import { AssetInfo } from '@oraichain/common-contracts-sdk';
import { useEffect, useState } from 'react';
import { useGetPoolDetail } from '../hookV3';
import { useParams } from 'react-router-dom';
import { Pairs } from 'config/pools';

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
