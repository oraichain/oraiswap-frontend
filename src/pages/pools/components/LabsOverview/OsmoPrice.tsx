//@ts-nocheck

import { CoinPretty, DecUtils } from '@keplr-wallet/unit';
import React from 'react';
import { OverviewLabelValue } from 'components/common/OverviewLabelValue';

export const OsmoPrice = function OsmoPrice() {
  const { chainStore, priceStore } = {};

  //   const price = priceStore.getPricePretty(
  //     new CoinPretty(
  //       chainStore.current.stakeCurrency,
  //       DecUtils.getPrecisionDec(chainStore.current.stakeCurrency.coinDecimals)
  //     )
  //   );
  const price = '$10.21';
  return (
    <OverviewLabelValue label="OSMO Price">
      <h4 className="text-xl md:text-2xl leading-7 md:leading-none">{price}</h4>
    </OverviewLabelValue>
  );
};
