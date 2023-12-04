import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate/build/encoding';
import {
  MulticallQueryClient,
  MulticallReadOnlyInterface
} from '@oraichain/common-contracts-sdk/build/Multicall.client';
import { AggregateResult } from '@oraichain/common-contracts-sdk/build/Multicall.types';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateLpPools } from 'reducer/token';

export const calculateLpPoolsV3 = (lpAddresses: string[], res: AggregateResult) => {
  const lpTokenData = Object.fromEntries(
    lpAddresses.map((lpAddress, ind) => {
      const data = res.return_data[ind];
      if (!data.success) {
        return [lpAddress, {}];
      }
      return [lpAddress, fromBinary(data.data)];
    })
  );
  return lpTokenData;
};

export const fetchLpPoolsFromContract = async (
  lpAddresses: string[],
  userAddress: string,
  multicall: MulticallReadOnlyInterface
) => {
  const queries = lpAddresses.map((lpAddress) => ({
    address: lpAddress,
    data: toBinary({
      balance: {
        address: userAddress
      }
    })
  }));
  const res = await multicall.aggregate({
    queries
  });
  return calculateLpPoolsV3(lpAddresses, res);
};

// Fetch lp pools from contract
export const useFetchLpPoolsV3 = (lpAddresses: string[]) => {
  const dispatch = useDispatch();
  const [address] = useConfigReducer('address');
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));

  const fetchLpPool = async () => {
    const lpTokenData = await fetchLpPoolsFromContract(
      lpAddresses,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedLpPools(lpTokenData);
  };

  useEffect(() => {
    if (lpAddresses.length > 0 && address) {
      fetchLpPool();
    }
  }, [lpAddresses, address]);
};
