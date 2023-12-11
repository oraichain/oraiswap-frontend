import { cw20TokenMap, tokenMap } from 'config/bridgeTokens';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import { RewardPoolType } from 'reducer/config';
import { fetchRewardPerSecInfo } from 'rest/api';
import { xOCH_TOKEN_NAME } from '../constants';
import { parseAssetOnlyDenom } from '../helpers';

/**
 * fetch reward asset for each pool, with unique key is staking token (also called liquidity address)
 * @param lpAddresses: list lp address of all pools
 * @returns list reward. format: [{
 *   "reward": [
 *       "AIRI"
 *   ],
 *   "liquidity_token": "orai1hxm433hnwthrxneyjysvhny539s9kh6s2g2n8y"
 * }]
 */
export const useFetchCacheRewardAssetForAllPools = (lpAddresses: string[]) => {
  const [cachedReward, setCachedReward] = useConfigReducer('rewardPools');
  const fetchReward = async () => {
    let rewardAll: RewardPoolType[] = await Promise.all(
      lpAddresses.map(async (lpAddress) => {
        const rewardPerSecInfo = await fetchRewardPerSecInfo(lpAddress);
        const reward = rewardPerSecInfo.assets.reduce((acc, rewardAsset) => {
          const rewardDenom = parseAssetOnlyDenom(rewardAsset.info);
          const token = 'token' in rewardAsset.info ? cw20TokenMap[rewardDenom] : tokenMap[rewardDenom];
          // TODO: hardcode token reward xOCH
          return [...acc, token ? token.name : xOCH_TOKEN_NAME];
        }, []);
        return {
          reward,
          liquidity_token: lpAddress
        };
      })
    );
    setCachedReward(rewardAll);
  };

  useEffect(() => {
    if (!cachedReward || !cachedReward.length || cachedReward.length < lpAddresses?.length) {
      fetchReward();
    }
  }, [lpAddresses]);

  return [cachedReward];
};
