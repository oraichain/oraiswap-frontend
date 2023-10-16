import Content from 'layouts/Content';
import React, { useState } from 'react';
import NewPoolModal from './NewPoolModal/NewPoolModal';
import NewTokenModal from './NewTokenModal/NewTokenModal';
import { Header } from './components/Header';
import { ListPools } from './components/ListPool/ListPool';
import { useFetchAllPairs, useFetchCachePairs, useFetchCacheReward } from './hooks';

import { useFetchLpPoolsV3, useGetPools } from './hookV3';
import styles from './indexV3.module.scss';

const Pools: React.FC<{}> = () => {
  const [isOpenNewPoolModal, setIsOpenNewPoolModal] = useState(false);
  const [isOpenNewTokenModal, setIsOpenNewTokenModal] = useState(false);
  const pairs = useFetchAllPairs();
  useFetchCacheReward(pairs);
  useFetchCachePairs(pairs);

  const pools = useGetPools();
  const lpAddresses = pools.map((pool) => pool.liquidityAddr);
  useFetchLpPoolsV3(lpAddresses);

  return (
    <Content nonBackground>
      <div className={styles.pools}>
        <Header />
        <ListPools />

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
