import NoDataSvg from 'assets/images/NoDataPool.svg';
import NoDataLightSvg from 'assets/images/NoDataPoolLight.svg';
import SearchInput from 'components/SearchInput';
import TokenBalance from 'components/TokenBalance';
import { assetInfoMap, cosmosTokens } from 'config/bridgeTokens';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import Content from 'layouts/Content';
import sumBy from 'lodash/sumBy';
import { useSelector } from 'react-redux';
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PairInfoData } from './helpers';
import { useFetchAllPairs, useFetchApr, useFetchCachePairs, useFetchMyPairs, useFetchPairInfoDataList } from './hooks';
import styles from './index.module.scss';
import NewPoolModal from './NewPoolModal/NewPoolModal';
import { RootState } from 'store/configure';
import NewTokenModal from './NewTokenModal/NewTokenModal';
import { parseTokenInfo, parseTokenInfoRawDenom } from 'rest/api';
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
      <div className={styles.header_title}>Pools</div>
      <div className={styles.header_data}>
        <div className={styles.header_data_item}>
          <span className={styles.header_data_name}>ORAI Price</span>
          <span className={styles.header_data_value}>
            <TokenBalance balance={oraiPrice} className={styles.header_data_value} decimalScale={2} />
          </span>
        </div>
        <div className={styles.header_data_item}>
          <span className={styles.header_data_name}>Total Liquidity</span>
          <TokenBalance balance={amount} className={styles.header_data_value} decimalScale={2} />
        </div>
      </div>
    </div>
  );
};

const PairBox = memo<PairInfoData & { apr: number; theme?: string }>(({ pair, amount, apr, theme }) => {
  const navigate = useNavigate();
  const [token1, token2] = pair.asset_infos_raw.map((info) => assetInfoMap[info]);

  if (!token1 || !token2) return null;

  return (
    <div
      className={classNames(styles.pairbox)}
      onClick={() =>
        navigate(
          `/pool/${encodeURIComponent(parseTokenInfoRawDenom(token1))}_${encodeURIComponent(
            parseTokenInfoRawDenom(token2)
          )}`
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
          <div className={styles.pairbox_pair_name}>
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
            <span className={styles.pairbox_data_value}>{apr.toFixed(2)}%</span>
          </div>
        )}
        <div className={styles.pairbox_data}>
          <span className={styles.pairbox_data_name}>Swap Fee</span>
          <span className={styles.pairbox_data_value}>{100 * parseFloat(pair.commission_rate)}%</span>
        </div>
        <div className={styles.pairbox_data}>
          <span className={styles.pairbox_data_name}>Liquidity</span>
          <TokenBalance balance={amount} className={styles.pairbox_data_value} decimalScale={2} />
        </div>
      </div>
    </div>
  );
});

const ListPools = memo<{
  pairInfos: PairInfoData[];
  allPoolApr: { [key: string]: number };
  myPairsData?: Object;
  setIsOpenNewTokenModal?: (isOpenNewToken: boolean) => void;
  theme?: string;
}>(({ pairInfos, allPoolApr, myPairsData, setIsOpenNewTokenModal, theme }) => {
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
        myPairsData[pairInfo?.pair?.contract_addr] ?? parseInt(lpPools[pairInfo?.pair?.liquidity_token]?.balance)
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
      const ret = listPairs.filter((pairInfo) =>
        pairInfo.pair.asset_infos.some((info) => cosmosTokens.find((token) => parseTokenInfo(token).info === info))
      );
      setFilteredPairInfos(ret);
    },
    [pairInfos, listMyPool, typeFilter]
  );

  return (
    <div className={styles.listpools}>
      <div className={styles.listpools_all}>
        <div className={styles.listpools_header}>
          <div className={styles.listpools_filter}>
            {LIST_FILTER_POOL.map((item) => (
              <div
                key={item.key}
                className={classNames(item.key === typeFilter ? styles.filter_active : null, styles.filter_item)}
                onClick={() => setTypeFilter(item.key)}
              >
                {item.text}
              </div>
            ))}
          </div>
          <div className={styles.listpools_search}>
            <SearchInput theme={theme} placeholder="Search by pools or tokens name" onSearch={filterPairs} />
          </div>
        </div>
        <div className={styles.listpoolsToken_create}>
          <div
            style={{
              color: '#fff',
              background: '#612fca'
            }}
            className={styles.create_item}
            onClick={() => setIsOpenNewTokenModal(true)}
          >
            List a new token
          </div>
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
          <div className={styles.no_data}>
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
  const [isOpenNewTokenModal, setIsOpenNewTokenModal] = useState(false);

  const pairs = useFetchAllPairs();
  const [theme] = useConfigReducer('theme');
  const { data: prices } = useCoinGeckoPrices();
  const { pairInfos, oraiPrice } = useFetchPairInfoDataList(pairs);
  const [cachedApr] = useFetchApr(pairs, pairInfos, prices);
  const [myPairsData] = useFetchMyPairs(pairs);
  useFetchCachePairs(pairs);

  const totalAmount = sumBy(pairInfos, (c) => c.amount);
  return (
    <Content nonBackground>
      <div className={styles.pools}>
        <Header theme={theme} amount={totalAmount} oraiPrice={oraiPrice} />
        <ListPools
          setIsOpenNewTokenModal={setIsOpenNewTokenModal}
          pairInfos={pairInfos}
          allPoolApr={cachedApr}
          myPairsData={myPairsData}
          theme={theme}
        />
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
