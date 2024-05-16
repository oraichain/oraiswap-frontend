import { BigDecimal } from '@oraichain/oraidex-common';
import { useEffect, useState } from 'react';
import { useGetVaults } from './useVaults';

export const useTotalSharePerformance = () => {
  const { totalVaultInfos } = useGetVaults();
  const [totalTvlUsd, setTotalTvlUsd] = useState(0);

  useEffect(() => {
    if (!totalVaultInfos.length) return;

    let totalTvlUsd = 0;
    for (const vaultInfo of totalVaultInfos) {
      totalTvlUsd += new BigDecimal(vaultInfo.tvl).toNumber();
    }
    setTotalTvlUsd(totalTvlUsd);
  }, [totalVaultInfos]);

  return { totalTvlUsd };
};
