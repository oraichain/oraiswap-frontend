import NoDataSvg from 'assets/images/NoDataPool.svg';
import NoDataLightSvg from 'assets/images/NoDataPoolLight.svg';
import SearchInput from 'components/SearchInput';
import TokenBalance from 'components/TokenBalance';
import { cosmosTokens, tokenMap } from 'config/bridgeTokens';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import Content from 'layouts/Content';
import sumBy from 'lodash/sumBy';
import { useSelector } from 'react-redux';
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PairInfoData } from './helpers';
import { useFetchApr, useFetchCachePairs, useFetchMyPairs, useFetchPairInfoDataList } from './hooks';
import styles from './index.module.scss';
import NewPoolModal from './NewPoolModal/NewPoolModal';
import { RootState } from 'store/configure';
import classNames from 'classnames';

interface PoolsProps {}

export enum KeyFilterPool {
  my_pool = 'my_pool',
  all_pool = 'all_pool'
}

const LIST_FILTER_POOL = [
  {
    key: KeyFilterPool.all_pool,
    text: 'All Pools'
  },
  {
    key: KeyFilterPool.my_pool,
    text: 'My Pools'
  }
];

const Header: FC<{ theme: string; amount: number; oraiPrice: number }> = ({ amount, oraiPrice, theme }) => {
  return (
    <div className={styles.header}>
      <div className={classNames(styles.header_title, styles.header_title + ` ${styles[theme]}`)}>Pools</div>
      <div className={styles.header_data}>
        <div className={styles.header_data_item}>
          <span className={styles.header_data_name}>ORAI Price</span>
          <span className={classNames(styles.header_data_value, styles.header_data_value + ` ${styles[theme]}`)}>
            <TokenBalance balance={oraiPrice} className={styles.header_data_value} decimalScale={2} />
          </span>
        </div>
        <div className={styles.header_data_item}>
          <span className={styles.header_data_name}>Total Liquidity</span>
          <TokenBalance
            balance={amount}
            className={classNames(styles.header_data_value, styles.header_data_value + ` ${styles[theme]}`)}
            decimalScale={2}
          />
        </div>
      </div>
    </div>
  );
};

const PairBox = memo<PairInfoData & { apr: number; theme?: string }>(({ pair, amount, commissionRate, apr, theme }) => {
  const navigate = useNavigate();
  const [token1, token2] = pair.asset_denoms.map((denom) => tokenMap[denom]);

  if (!token1 || !token2) return null;

  return (
    <div
      className={classNames(styles.pairbox, styles.pairbox + ` ${styles[theme]}`)}
      onClick={() =>
        navigate(
          `/pool/${encodeURIComponent(token1.denom)}_${encodeURIComponent(token2.denom)}`
          // { replace: true }
        )
      }
    >
      <div className={styles.pairbox_header}>
        <div className={styles.pairbox_logos}>
          {theme === 'light' && token1?.IconLight ? (
            <token1.IconLight className={styles.pairbox_logo1} />
          ) : (
            <token1.Icon className={styles.pairbox_logo1} />
          )}

          {theme === 'light' && token2?.IconLight ? (
            <token2.IconLight className={styles.pairbox_logo2} />
          ) : (
            <token2.Icon className={styles.pairbox_logo2} />
          )}
        </div>
        <div className={styles.pairbox_pair}>
          <div className={classNames(styles.pairbox_pair_name, styles.pairbox_pair_name + ` ${styles[theme]}`)}>
            {token1.name}/{token2.name}
          </div>
          <div className={styles.pairbox_pair_rate}>{/* {token1.name} (50%)/{token2.name} (50%) */}</div>
          <span className={styles.pairbox_pair_apr}>ORAIX Bonus</span>
        </div>
      </div>
      <div className={styles.pairbox_content}>
        {!!apr && (
          <div className={styles.pairbox_data}>
            <span className={styles.pairbox_data_name}>APR</span>
            <span className={classNames(styles.pairbox_data_value, styles.pairbox_data_value + ` ${styles[theme]}`)}>
              {apr.toFixed(2)}%
            </span>
          </div>
        )}
        <div className={styles.pairbox_data}>
          <span className={styles.pairbox_data_name}>Swap Fee</span>
          <span className={classNames(styles.pairbox_data_value, styles.pairbox_data_value + ` ${styles[theme]}`)}>
            {100 * parseFloat(commissionRate)}%
          </span>
        </div>
        <div className={styles.pairbox_data}>
          <span className={styles.pairbox_data_name}>Liquidity</span>
          <TokenBalance
            balance={amount}
            className={classNames(styles.pairbox_data_value, styles.pairbox_data_value + ` ${styles[theme]}`)}
            decimalScale={2}
          />
        </div>
      </div>
    </div>
  );
});

const ListPools = memo<{
  pairInfos: PairInfoData[];
  allPoolApr: { [key: string]: number };
  myPairsData?: Object;
  theme?: string;
}>(({ pairInfos, allPoolApr, myPairsData, theme }) => {
  const [filteredPairInfos, setFilteredPairInfos] = useState<PairInfoData[]>([]);
  const [typeFilter, setTypeFilter] = useConfigReducer('filterDefaultPool');
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  useEffect(() => {
    if (!!!typeFilter) {
      setTypeFilter(KeyFilterPool.all_pool);
    }
  }, [typeFilter]);

  const listMyPool = useMemo(() => {
    return pairInfos.filter(
      (pairInfo) =>
        myPairsData[pairInfo?.pair?.contract_addr] || parseInt(lpPools[pairInfo?.pair?.liquidity_token]?.balance)
    );
  }, [myPairsData, pairInfos]);

  useEffect(() => {
    if (typeFilter === KeyFilterPool.my_pool) {
      setFilteredPairInfos(listMyPool);
    } else {
      setFilteredPairInfos(pairInfos);
    }
  }, [listMyPool, typeFilter, pairInfos]);

  const filterPairs = useCallback(
    (text: string) => {
      const listPairs = typeFilter === KeyFilterPool.all_pool ? pairInfos : listMyPool;
      if (!text) {
        return setFilteredPairInfos(listPairs);
      }
      const searchReg = new RegExp(text, 'i');
      const ret = listPairs.filter((pairInfo) =>
        pairInfo.pair.asset_denoms.some((denom) =>
          cosmosTokens.find((token) => token.denom === denom && token.name.search(searchReg) !== -1)
        )
      );
      setFilteredPairInfos(ret);
    },
    [pairInfos, listMyPool, typeFilter]
  );

  return (
    <div className={styles.listpools}>
      <div className={styles.listpools_header}>
        <div className={styles.listpools_filter}>
          {LIST_FILTER_POOL.map((item) => (
            <div
              key={item.key}
              style={{
                color: item.key === typeFilter ? '#b177eb' : '#cccdd0'
                // background: item.key === typeFilter ? '#2a2a2e' : '#1e1e21'
              }}
              className={classNames(styles.filter_item + ` ${styles[theme]}`, styles.filter_item)}
              onClick={() => setTypeFilter(item.key)}
            >
              {item.text}
            </div>
          ))}
        </div>
        <div className={classNames(styles.listpools_search)}>
          <SearchInput theme={theme} placeholder="Search by pools or tokens name" onSearch={filterPairs} />
        </div>
      </div>
      <div className={styles.listpools_list}>
        {filteredPairInfos.length > 0 ? (
          filteredPairInfos.map((info) => (
            <PairBox
              {...info}
              apr={!!allPoolApr ? allPoolApr[info.pair.contract_addr] : 0}
              key={info.pair.contract_addr}
              theme={theme}
            />
          ))
        ) : (
          <div className={classNames(styles.no_data + ` ${styles[theme]}`, styles.no_data)}>
            <img src={theme === 'light' ? NoDataLightSvg : NoDataSvg} alt="nodata" />
            <span>No data</span>
          </div>
        )}
      </div>
    </div>
  );
});

const Pools: React.FC<PoolsProps> = () => {
  const [isOpenNewPoolModal, setIsOpenNewPoolModal] = useState(false);
  const [theme] = useConfigReducer('theme');
  const { data: prices } = useCoinGeckoPrices();
  const { pairInfos, oraiPrice } = useFetchPairInfoDataList();
  const [cachedApr] = useFetchApr(pairInfos, prices);
  const [myPairsData] = useFetchMyPairs();
  useFetchCachePairs();

  const totalAmount = sumBy(pairInfos, (c) => c.amount);
  return (
    <Content nonBackground>
      <div className={styles.pools}>
        <Header theme={theme} amount={totalAmount} oraiPrice={oraiPrice} />
        <ListPools theme={theme} pairInfos={pairInfos} allPoolApr={cachedApr} myPairsData={myPairsData} />
        <NewPoolModal
          isOpen={isOpenNewPoolModal}
          open={() => setIsOpenNewPoolModal(true)}
          close={() => setIsOpenNewPoolModal(false)}
        />
      </div>
    </Content>
  );
};

export default Pools;
