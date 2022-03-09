//@ts-nocheck
import React from 'react';
import { TitleText } from 'components/Texts';
import { PoolCardList } from 'pages/pools/components/PoolCardList';
import { MyPoolCardProp } from 'pages/pools/models/poolCardProps';
import { LockupAbledPoolIds } from 'config';

export const MyPools = function MyPools() {
  const { chainStore, accountStore, queriesStore, priceStore } = {};

  //   const queries = queriesStore.get(chainStore.current.chainId);
  const queries = { osmosis: {} }; // queriesStore.get(chainStore.current.chainId);
  //   const account = accountStore.getAccount(chainStore.current.chainId);
  const account = { name: 'tupt' };

  const queryIncentivizedPools = queries.osmosis.queryIncentivizedPools;
  //   const myPools = queries.osmosis.queryGammPoolShare.getOwnPools(
  //     account.bech32Address
  //   );
  const myPools = [];
  const myPoolInfoList = myPools
    .map((poolId) => {
      // 이 카드는 보통 All Pools 카드와 함께 있다.
      // 따로 하나씩 pool을 쿼리하지 않고 All Pools의 페이지네이션 쿼리와 공유한다.
      const pool = queries.osmosis.queryGammPools.getPoolFromPagination(poolId);
      if (!pool) {
        return undefined;
      }

      const tvl = pool.computeTotalValueLocked(
        priceStore,
        priceStore.getFiatCurrency('usd')!
      );
      const shareRatio =
        queries.osmosis.queryGammPoolShare.getAllGammShareRatio(
          account.bech32Address,
          pool.id
        );
      const actualShareRatio = shareRatio.increasePrecision(2);

      const lockedShareRatio =
        queries.osmosis.queryGammPoolShare.getLockedGammShareRatio(
          account.bech32Address,
          pool.id
        );
      const actualLockedShareRatio = lockedShareRatio.increasePrecision(2);

      // 데이터 구조를 바꿀 필요가 있다.
      return {
        poolId: pool.id,
        apr: {
          value: queryIncentivizedPools.isIncentivized(pool.id)
            ? queryIncentivizedPools
                .computeMostAPY(
                  pool.id,
                  priceStore,
                  priceStore.getFiatCurrency('usd')!
                )
                .toString()
            : undefined,
          isLoading: queryIncentivizedPools.isAprFetching
        },
        liquidity: {
          value: pool
            .computeTotalValueLocked(
              priceStore,
              priceStore.getFiatCurrency('usd')!
            )
            .toString()
        },
        myLiquidity: {
          value: tvl.mul(actualShareRatio).toString(),
          isLoading: queries.osmosis.queryGammPoolShare.isFetchingShareRatio
        },
        myLockedAmount: {
          value:
            queryIncentivizedPools.isIncentivized(pool.id) ||
            LockupAbledPoolIds[pool.id]
              ? tvl.mul(actualLockedShareRatio).toString()
              : undefined,
          isLoading:
            queries.osmosis.queryGammPoolShare.isFetchingLockedShareRatio
        },
        tokens: pool.poolAssets.map((asset) => asset.amount.currency)
      } as MyPoolCardProp;
    })
    .filter((d): d is MyPoolCardProp => d != null);

  return (
    <div>
      <TitleText>My Pools</TitleText>
      <PoolCardList poolList={myPoolInfoList} />
    </div>
  );
};
