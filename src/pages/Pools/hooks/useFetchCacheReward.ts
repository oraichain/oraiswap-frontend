import { ORAI } from '@oraichain/oraidex-common/build/constant';
import { PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { cw20TokenMap, tokenMap } from 'config/bridgeTokens';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import { RewardPoolType } from 'reducer/config';
import { fetchRewardPerSecInfo } from 'rest/api';
import { PairInfoExtend } from 'types/token';

// Fetch Reward
export const useFetchCacheReward = (pairs: PairInfo[]) => {
  const [cachedReward, setCachedReward] = useConfigReducer('rewardPools');
  const fetchReward = async () => {
    let rewardAll: RewardPoolType[] = await Promise.all(
      pairs.map(async (p: PairInfoExtend) => {
        let denom = '';
        if (p.asset_infos_raw?.[0] === ORAI) {
          denom = p.asset_infos_raw?.[1];
        } else {
          denom = p.asset_infos_raw?.[0];
        }
        const [pairInfoRewardDataRaw] = await Promise.all([fetchRewardPerSecInfo(p.liquidity_token)]);
        const reward = pairInfoRewardDataRaw.assets.reduce((acc, cur) => {
          let token =
            'token' in cur.info ? cw20TokenMap[cur.info.token.contract_addr] : tokenMap[cur.info.native_token.denom];
          // TODO: hardcode token reward xOCH
          return [...acc, token?.name ?? token?.denom ?? 'xOCH'];
        }, []);
        return {
          reward,
          liquidity_token: p.liquidity_token
        };
      })
    );
    setCachedReward(rewardAll);
  };

  useEffect(() => {
    if (!cachedReward?.length || cachedReward?.length < pairs?.length) {
      fetchReward();
    }
  }, [pairs]);

  return [cachedReward];
};
