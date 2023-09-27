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
  useFetchCacheLpPools,
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
  const { data: prices } = useCoinGeckoPrices();
  const { pairInfos, oraiPrice } = useFetchPairInfoDataList(pairs);
  const [cachedApr] = useFetchApr(pairs, pairInfos, prices);
  useFetchCacheReward(pairs);
  useFetchCachePairs(pairs);
  useFetchCacheLpPools(pairs);

  const totalAmount = sumBy(pairInfos, (c) => c.amount);

  const pools = useGetPools();

  return (
    <Content nonBackground>
      <div className={styles.pools}>
        <Header amount={totalAmount} oraiPrice={oraiPrice} />
        <ListPools pairInfos={pairInfos} allPoolApr={cachedApr} pools={pools} />

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
