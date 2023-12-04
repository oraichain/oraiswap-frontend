import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate/build/encoding';
import {
  MulticallQueryClient,
  MulticallReadOnlyInterface
} from '@oraichain/common-contracts-sdk/build/Multicall.client';
import { AggregateResult } from '@oraichain/common-contracts-sdk/build/Multicall.types';
import { PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { network } from 'config/networks';
import { Pairs } from 'config/pools';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePairInfos } from 'reducer/pairs';
import { updatePairs } from 'reducer/token';
import { RootState } from 'store/configure';
import { PairInfoExtend } from 'types/token';

export const toPairDetails = (pairs: PairInfo[], res: AggregateResult): PairDetails => {
  const pairsData = Object.fromEntries(
    pairs.map((pair, ind) => {
      const data = res.return_data[ind];
      if (!data.success) {
        return [pair.contract_addr, {}];
      }
      return [pair.contract_addr, fromBinary(data.data)];
    })
  );
  return pairsData;
};

// Fetch all pair data
export const fetchPairsData = async (pairs: PairInfo[], multicall: MulticallReadOnlyInterface) => {
  const queries = pairs.map((pair) => ({
    address: pair.contract_addr,
    data: toBinary({
      pool: {}
    })
  }));

  const res = await multicall.aggregate({
    queries
  });
  return { pairs, pairDetails: toPairDetails(pairs, res) };
};

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
