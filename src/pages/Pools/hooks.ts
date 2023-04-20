import { CoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLpPools, updatePairs } from 'reducer/token';
import { RootState } from 'store/configure';
import {
  fetchAprResult,
  fetchBalanceLpTokens,
  fetchCachedPairsData,
  fetchMyCachedPairsData,
  fetchPoolListAndOraiPrice,
  PairInfoData
} from './helpers';

// Fetch APR
export const useFetchApr = (pairInfos: PairInfoData[], prices: CoinGeckoPrices<string>) => {
  const [cachedApr, setCachedApr] = useConfigReducer('apr');

  const fetchApr = async () => {
    const cachedApr = await fetchAprResult(pairInfos, prices);
    setCachedApr(cachedApr);
  };

  useEffect(() => {
    if (!pairInfos.length) return;
    fetchApr();
  }, [pairInfos]);

  return [cachedApr];
};

// Fetch all pair data
export const useFetchCachePairs = () => {
  const dispatch = useDispatch();
  const setCachedPairs = (payload: PairDetails) => dispatch(updatePairs(payload));

  const fetchCachedPairs = async () => {
    const pairsData = await fetchCachedPairsData();
    setCachedPairs(pairsData);
  };

  useEffect(() => {
    fetchCachedPairs();
  }, []);
};

// Fetch my pair data
export const useFetchMyPairs = () => {
  const [address] = useConfigReducer('address');
  const [myPairsData, setMyPairsData] = useState({});

  const fetchMyCachedPairs = async () => {
    const myPairData = await fetchMyCachedPairsData(address);
    setMyPairsData(myPairData);
  };

  useEffect(() => {
    fetchMyCachedPairs();
  }, []);

  return [myPairsData];
};

// Fetch Pair Info Data List
export const useFetchPairInfoDataList = () => {
  const [pairInfos, setPairInfos] = useState<PairInfoData[]>([]);
  const [oraiPrice, setOraiPrice] = useState(0);
  const cachedPairs = useSelector((state: RootState) => state.token.pairs);
  const fetchPairInfoDataList = async () => {
    const res = await fetchPoolListAndOraiPrice(cachedPairs);
    res.pairInfo && setPairInfos(res.pairInfo);
    res.oraiPrice && setOraiPrice(res.oraiPrice);
  };

  useEffect(() => {
    fetchPairInfoDataList();
  }, [cachedPairs]);

  return { pairInfos, oraiPrice };
};

export const useFetchBalanceLpToken = () => {
  const dispatch = useDispatch();
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));
  const [address] = useConfigReducer('address');

  useEffect(() => {
    (async () => {
      const lpTokenData = await fetchBalanceLpTokens(address);
      setCachedLpPools(lpTokenData);
    })();
  }, []);
};
