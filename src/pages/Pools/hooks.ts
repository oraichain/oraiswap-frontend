import { PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { cw20TokenMap, tokenMap } from 'config/bridgeTokens';
import { Pairs } from 'config/pools';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RewardPoolType } from 'reducer/config';
import { updatePairInfos } from 'reducer/pairs';
import { fetchRewardPerSecInfo } from 'rest/api';
import { RootState } from 'store/configure';
import { PairInfoExtend } from 'types/token';

// Fetch my pair data
export const useFetchAllPairs = () => {
  const dispatch = useDispatch();
  const setCachedPairInfos = (payload: PairInfoExtend[]) => dispatch(updatePairInfos(payload));
  const cachedPairInfoExtend = useSelector((state: RootState) => state.pairInfos.pairInfos);

  const fetchAllPairs = async () => {
    const pairs = await Pairs.getAllPairsFromTwoFactoryVersions();
    setCachedPairInfos(pairs);
  };

  useEffect(() => {
    fetchAllPairs();
  }, []);

  return cachedPairInfoExtend;
};

/**
 * fetch reward asset for each pool, with unique key is staking token (also called liquidity address)
 * @param pairs 
 * @returns list reward. format: [{
 *   "reward": [
 *       "AIRI"
 *   ],
 *   "liquidity_token": "orai1hxm433hnwthrxneyjysvhny539s9kh6s2g2n8y"
 * }]
 */
export const useFetchCacheReward = (pairs: PairInfo[]) => {
  const [cachedReward, setCachedReward] = useConfigReducer('rewardPools');
  const fetchReward = async () => {
    let rewardAll: RewardPoolType[] = await Promise.all(
      pairs.map(async (p: PairInfoExtend) => {
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
    if (!cachedReward || !cachedReward.length || cachedReward.length < pairs?.length) {
      fetchReward();
    }
  }, [pairs]);

  return [cachedReward];
};
