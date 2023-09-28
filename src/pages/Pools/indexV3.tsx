import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import Content from 'layouts/Content';
import sumBy from 'lodash/sumBy';
import React, { useState } from 'react';
import NewPoolModal from './NewPoolModal/NewPoolModal';
import NewTokenModal from './NewTokenModal/NewTokenModal';
import { Header } from './components/Header';
import { ListPools } from './components/ListPool/ListPool';
import {
  useFetchAllPairs,
  useFetchApr,
  useFetchCachePairs,
  useFetchCacheReward,
  useFetchPairInfoDataList,
  useGetPools
} from './hooks';
import styles from './indexV3.module.scss';

const Pools: React.FC<{}> = () => {
  const [isOpenNewPoolModal, setIsOpenNewPoolModal] = useState(false);
  const [isOpenNewTokenModal, setIsOpenNewTokenModal] = useState(false);

  const pairs = useFetchAllPairs();
  const { pairInfos, oraiPrice } = useFetchPairInfoDataList(pairs);
  useFetchCacheReward(pairs);
  useFetchCachePairs(pairs);

  const totalAmount = sumBy(pairInfos, (c) => c.amount);

  const pools = useGetPools();

  return (
    <Content nonBackground>
      <div className={styles.pools}>
        <Header amount={totalAmount} oraiPrice={oraiPrice} />
        <ListPools pairInfos={pairInfos} pools={pools} />

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
