import Content from 'layouts/Content';
import React, { useState } from 'react';
import NewPoolModal from './NewPoolModal/NewPoolModal';
import NewTokenModal from './NewTokenModal/NewTokenModal';
import { Header } from './components/Header';
import { ListPools } from './components/ListPool/ListPool';
import { useFetchAllPairs, useFetchCachePairs, useFetchCacheReward, useFetchPairInfoDataList } from './hooks';

import useConfigReducer from 'hooks/useConfigReducer';
import { useFetchLpPoolsV3, useGetMyStake, useGetPools } from './hookV3';
import styles from './indexV3.module.scss';

const Pools: React.FC<{}> = () => {
  const [isOpenNewPoolModal, setIsOpenNewPoolModal] = useState(false);
  const [isOpenNewTokenModal, setIsOpenNewTokenModal] = useState(false);
  const [address] = useConfigReducer('address');
  const pairs = useFetchAllPairs();
  const { pairInfos, oraiPrice } = useFetchPairInfoDataList(pairs);
  useFetchCacheReward(pairs);
  useFetchCachePairs(pairs);

  const pools = useGetPools();
  const lpAddresses = pools.map((pool) => pool.liquidityAddr);
  useFetchLpPoolsV3(lpAddresses);

  const { myStakes } = useGetMyStake({
    stakerAddress: address
  });

  return (
    <Content nonBackground>
      <div className={styles.pools}>
        <Header oraiPrice={oraiPrice} />
        <ListPools pairInfos={pairInfos} pools={pools} myStakes={myStakes} />

        <NewPoolModal
          isOpen={isOpenNewPoolModal}
          open={() => setIsOpenNewPoolModal(true)}
          close={() => setIsOpenNewPoolModal(false)}
        />
        <NewTokenModal
          isOpen={isOpenNewTokenModal}
          open={() => setIsOpenNewTokenModal(true)}
          close={() => setIsOpenNewTokenModal(false)}
        />
      </div>
    </Content>
  );
};

export default Pools;
