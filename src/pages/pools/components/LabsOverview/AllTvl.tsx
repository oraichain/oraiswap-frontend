//@ts-nocheck
import React from 'react';
import { OverviewLabelValue } from 'components/common/OverviewLabelValue';

export const AllTvl = function AllTvl() {
  const { chainStore, queriesStore, priceStore } = {};

  //   const queries = queriesStore.get(chainStore.current.chainId);
  const queries = { osmosis: {} }; // queriesStore.get(chainStore.current.chainId);

  return (
    <OverviewLabelValue label="Total Liquidity">
      <h4>
        {queries.osmosis.queryGammPools
          .computeAllTotalValueLocked(
            priceStore,
            priceStore.getFiatCurrency('usd')!
          )
          .toString()}
      </h4>
    </OverviewLabelValue>
  );
};
