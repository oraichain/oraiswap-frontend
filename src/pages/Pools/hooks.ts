import { CoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePairs } from 'reducer/token';
import { RootState } from 'store/configure';
import {
  fetchAprResult,
  fetchPairsData,
  fetchMyCachedPairsData,
  fetchPoolListAndOraiPrice,
  PairInfoData
} from './helpers';
import { Contract } from 'config/contracts';
import { Pairs } from 'config/pools';
import { PairInfo } from 'libs/contracts';

// Fetch my pair data
export const useFetchAllPairs = () => {
  const [pairs, setMyPairs] = useState([] as PairInfo[]);

  const fetchAllPairs = async () => {
    const pairs = await Pairs.getAllPairsFromTwoFactoryVersions();
    setMyPairs(pairs);
  };

  useEffect(() => {
    fetchAllPairs();
  }, []);

  return pairs;
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

// Fetch all pair data
export const useFetchCachePairs = (pairs: PairInfo[]) => {
  const dispatch = useDispatch();
  const setCachedPairs = (payload: PairDetails) => dispatch(updatePairs(payload));

  const fetchCachedPairs = async () => {
    const { pairDetails: pairsData } = await fetchPairsData(pairs, Contract.multicall);
    setCachedPairs(pairsData);
  };

  useEffect(() => {
    fetchCachedPairs();
  }, []);
};

// Fetch my pair data
export const useFetchMyPairs = (pairs: PairInfo[]) => {
  const [address] = useConfigReducer('address');
  const [myPairsData, setMyPairsData] = useState({});

  const fetchMyCachedPairs = async () => {
    const myPairData = await fetchMyCachedPairsData(pairs, address, Contract.multicall);
    setMyPairsData(myPairData);
  };

  useEffect(() => {
    fetchMyCachedPairs();
  }, []);

  return [myPairsData];
};

// Fetch Pair Info Data List
export const useFetchPairInfoDataList = (pairs: PairInfo[]) => {
  const [pairInfos, setPairInfos] = useState<PairInfoData[]>([]);
  const [oraiPrice, setOraiPrice] = useState(0);
  const cachedPairs = useSelector((state: RootState) => state.token.pairs);
  const fetchPairInfoDataList = async () => {
    try {
      const res = await fetchPoolListAndOraiPrice(pairs, cachedPairs);
      res && res.pairInfo && setPairInfos(res.pairInfo);
      res && res.oraiPrice && setOraiPrice(res.oraiPrice);
    } catch (error) {
      console.log("error in fetch pair info data list: ", error);
    }
  };

  useEffect(() => {
    if (pairs.length > 0)
      fetchPairInfoDataList();
  }, [cachedPairs, pairs]);

  return { pairInfos, oraiPrice };
};
