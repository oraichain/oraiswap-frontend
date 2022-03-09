import React, { FunctionComponent } from 'react';
import { TitleText } from 'components/Texts';
import { PoolCardList } from './pools';
import { useFilteredExtraIncentivePools } from 'pages/pools/components/ExtraIncentives/hook';

export const ExtraIncentivizedPools: FunctionComponent = () => {
  const incentivizedPoolInfoList = useFilteredExtraIncentivePools();

  return (
    <div>
      <TitleText>External Incentive Pools</TitleText>

      {incentivizedPoolInfoList.length !== 0 ? (
        <PoolCardList poolList={incentivizedPoolInfoList} />
      ) : null}
    </div>
  );
};
