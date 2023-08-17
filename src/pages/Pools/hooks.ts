import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { network } from 'config/networks';
import { Pairs } from 'config/pools';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLpPools, updatePairs } from 'reducer/token';
import { RootState } from 'store/configure';
import {
  PairInfoData,
  fetchAprResult,
  fetchMyPairsData,
  fetchPairsData,
  fetchPoolListAndOraiPrice,
  fetchCacheLpPools
} from './helpers';
import { updatePairInfos } from 'reducer/pairs';
import { PairInfoExtend } from 'types/token';
import { cw20TokenMap, oraichainTokens, tokenMap } from 'config/bridgeTokens';
import { fetchRewardPerSecInfo } from 'rest/api';
import { RewardPoolType } from 'reducer/config';

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

// Fetch APR
export const useFetchApr = (pairs: PairInfo[], pairInfos: PairInfoData[], prices: CoinGeckoPrices<string>) => {
  const [cachedApr, setCachedApr] = useConfigReducer('apr');

  const fetchApr = async () => {
    const cachedApr = await fetchAprResult(pairs, pairInfos, prices);
    setCachedApr(cachedApr);
  };

  useEffect(() => {
    if (!pairInfos.length) return;
    fetchApr();
  }, [pairInfos]);

  return [cachedApr];
};

// Fetch Reward
export const useFetchCacheReward = (pairs: PairInfo[]) => {
  const [cachedReward, setCachedReward] = useConfigReducer('rewardPools');
  const fetchReward = async () => {
    let rewardAll: RewardPoolType[] = await Promise.all(
      pairs.map(async (p: PairInfoExtend) => {
        let denom = '';
        if (p.asset_infos_raw?.[0] == 'orai') {
          denom = p.asset_infos_raw?.[1];
        } else {
          denom = p.asset_infos_raw?.[0];
        }
        const assetToken = oraichainTokens.find((token) => token.denom === denom || token.contractAddress === denom);
        const [pairInfoRewardDataRaw] = await Promise.all([fetchRewardPerSecInfo(assetToken)]);
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
    if (!cachedReward.length || cachedReward.length < pairs.length) {
      fetchReward();
    }
  }, []);

  return [cachedReward];
};

// Fetch all lp pools
export const useFetchCacheLpPools = (pairs: PairInfo[]) => {
  const dispatch = useDispatch();
  const [address] = useConfigReducer('address');
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));

  const fetchCachedLpPool = async () => {
    const lpTokenData = await fetchCacheLpPools(
      pairs,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedLpPools(lpTokenData);
  };

  useEffect(() => {
    if (pairs.length > 0 && address) fetchCachedLpPool();
  }, [pairs]);
};

// Fetch all pair data
export const useFetchCachePairs = (pairs: PairInfo[]) => {
  const dispatch = useDispatch();
  const setCachedPairs = (payload: PairDetails) => dispatch(updatePairs(payload));

  const fetchCachedPairs = async () => {
    const { pairDetails: pairsData } = await fetchPairsData(
      pairs,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedPairs(pairsData);
  };

  useEffect(() => {
    if (pairs.length > 0) fetchCachedPairs();
  }, [pairs]);
};

// Fetch my pair data
export const useFetchMyPairs = (pairs: PairInfoExtend[]) => {
  const [address] = useConfigReducer('address');
  const [myPairsData, setMyPairsData] = useState({});

  const fetchMyCachedPairs = async () => {
    const myPairData = await fetchMyPairsData(
      pairs,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setMyPairsData(myPairData);
  };

  useEffect(() => {
    fetchMyCachedPairs();
  }, [pairs]);

  return [myPairsData];
};

// Fetch Pair Info Data List
export const useFetchPairInfoDataList = (pairs: PairInfoExtend[]) => {
  const [pairInfos, setPairInfos] = useState<PairInfoData[]>([]);
  const [oraiPrice, setOraiPrice] = useState(0);
  const cachedPairs = useSelector((state: RootState) => state.token.pairs);
  const fetchPairInfoDataList = async () => {
    try {
      const res = await fetchPoolListAndOraiPrice(pairs, cachedPairs);
      res && res.pairInfo && setPairInfos(res.pairInfo);
      res && res.oraiPrice && setOraiPrice(res.oraiPrice);
    } catch (error) {
      console.log('error in fetch pair info data list: ', error);
    }
  };

  useEffect(() => {
    if (pairs.length > 0) fetchPairInfoDataList();
  }, [cachedPairs, pairs]);

  return { pairInfos, oraiPrice };
};
