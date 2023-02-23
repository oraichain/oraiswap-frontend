import React, {
  FC,
  memo,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import Content from 'layouts/Content';
import { Pair, pairs } from 'config/pools';
import { fetchAllPoolApr, fetchPoolInfoAmount, parseTokenInfo } from 'rest/api';
import { getUsd } from 'libs/utils';
import TokenBalance from 'components/TokenBalance';
import NewPoolModal from './NewPoolModal/NewPoolModal';
import { filteredTokens } from 'config/bridgeTokens';
import { MILKY, STABLE_DENOM } from 'config/constants';
import SearchSvg from 'assets/images/search-svg.svg';
import NoDataSvg from 'assets/images/NoDataPool.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import { Contract } from 'config/contracts';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { updatePairs } from 'reducer/token';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/configure';
import Input from 'components/Input';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';
import sumBy from 'lodash/sumBy';

interface PoolsProps {}

enum KeyFilter {
  my_pool,
  all_pool,
}

const LIST_FILTER = [
  {
    key: KeyFilter.all_pool,
    text: 'All Pools',
  },
  {
    key: KeyFilter.my_pool,
    text: 'My Pools',
  },
];

const Header: FC<{ amount: number; oraiPrice: number }> = ({
  amount,
  oraiPrice,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.header_title}>Pools</div>
      <div className={styles.header_data}>
        <div className={styles.header_data_item}>
          <span className={styles.header_data_name}>ORAI Price</span>
          <span className={styles.header_data_value}>
            <TokenBalance
              balance={oraiPrice}
              className={styles.header_data_value}
              decimalScale={2}
            />
          </span>
        </div>
        <div className={styles.header_data_item}>
          <span className={styles.header_data_name}>Total Liquidity</span>
          <TokenBalance
            balance={amount}
            className={styles.header_data_value}
            decimalScale={2}
          />
        </div>
      </div>
    </div>
  );
};

const PairBox = memo<PairInfoData & { apr: number }>(
  ({ pair, amount, commissionRate, apr }) => {
    const navigate = useNavigate();
    const [token1, token2] = pair.asset_denoms.map((denom) =>
      filteredTokens.find((token) => token.denom === denom)
    );

    if (!token1 || !token2) return null;

    return (
      <div
        className={styles.pairbox}
        onClick={() =>
          navigate(
            `/pool/${encodeURIComponent(token1.denom)}_${encodeURIComponent(
              token2.denom
            )}`
            // { replace: true }
          )
        }
      >
        <div className={styles.pairbox_header}>
          <div className={styles.pairbox_logos}>
            <token1.Icon className={styles.pairbox_logo1} />
            <token2.Icon className={styles.pairbox_logo2} />
          </div>
          <div className={styles.pairbox_pair}>
            <div className={styles.pairbox_pair_name}>
              {token1.name}/{token2.name}
            </div>
            <div className={styles.pairbox_pair_rate}>
              {/* {token1.name} (50%)/{token2.name} (50%) */}
            </div>
            <span className={styles.pairbox_pair_apr}>ORAIX Bonus</span>
          </div>
        </div>
        <div className={styles.pairbox_content}>
          {!!apr && (
            <div className={styles.pairbox_data}>
              <span className={styles.pairbox_data_name}>APR</span>
              <span className={styles.pairbox_data_value}>
                {apr.toFixed(2)}%
              </span>
            </div>
          )}
          <div className={styles.pairbox_data}>
            <span className={styles.pairbox_data_name}>Swap Fee</span>
            <span className={styles.pairbox_data_value}>
              {100 * parseFloat(commissionRate)}%
            </span>
          </div>
          <div className={styles.pairbox_data}>
            <span className={styles.pairbox_data_name}>Liquidity</span>
            <TokenBalance
              balance={amount}
              className={styles.pairbox_data_value}
              decimalScale={2}
            />
          </div>
        </div>
      </div>
    );
  }
);

const ListPools = memo<{
  pairInfos: PairInfoData[];
  allPoolApr: any;
  setIsOpenNewPoolModal: any;
  myPairsData?: Object;
}>(({ pairInfos, setIsOpenNewPoolModal, allPoolApr, myPairsData }) => {
  const [filteredPairInfos, setFilteredPairInfos] = useState<PairInfoData[]>(
    []
  );
  const [typeFilter, setTypeFilter] = useState(KeyFilter.all_pool);

  const listMyPool = useMemo(() => {
    return pairInfos.filter(
      (pairInfo) => myPairsData[pairInfo?.pair?.contract_addr]
    );
  }, [myPairsData, pairInfos]);

  useEffect(() => {
    if (typeFilter === KeyFilter.my_pool) {
      setFilteredPairInfos(listMyPool);
    } else {
      setFilteredPairInfos(pairInfos);
    }
  }, [listMyPool, typeFilter, pairInfos]);

  const filterPairs = useCallback(
    (text: string) => {
      const listPairs =
        typeFilter === KeyFilter.all_pool ? pairInfos : listMyPool;
      if (!text) {
        return setFilteredPairInfos(listPairs);
      }
      const searchReg = new RegExp(text, 'i');
      const ret = listPairs.filter((pairInfo) =>
        pairInfo.pair.asset_denoms.some((denom) =>
          filteredTokens.find(
            (token) =>
              token.denom === denom && token.name.search(searchReg) !== -1
          )
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
          {LIST_FILTER.map((item) => (
            <div
              key={item.key}
              style={{
                color: item.key === typeFilter ? '#b177eb' : '#ebebeb',
                background: item.key === typeFilter ? '#2a2a2e' : '#1e1e21',
              }}
              className={styles.filter_item}
              onClick={() => setTypeFilter(item.key)}
            >
              {item.text}
            </div>
          ))}
        </div>
        <div className={styles.listpools_search}>
          <Input
            className={styles.listpools_search_input}
            placeholder="Search by pools or tokens name"
            style={{
              paddingLeft: 40,
              backgroundImage: `url(${SearchSvg})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '10px center',
            }}
            onChange={debounce((e) => {
              filterPairs(e.target.value);
            }, 500)}
          />
          {/* <div
            className={styles.listpools_btn}
            onClick={() => setIsOpenNewPoolModal(true)}
          >
            Create new pool
          </div> */}
        </div>
      </div>
      <div className={styles.listpools_list}>
        {filteredPairInfos.length > 0 ? (
          filteredPairInfos.map((info) => (
            <PairBox
              {...info}
              apr={!!allPoolApr ? allPoolApr[info.pair.contract_addr] : 0}
              key={info.pair.contract_addr}
            />
          ))
        ) : (
          <div className={styles.no_data}>
            <img src={NoDataSvg} alt="nodata" />
            <span>No data</span>
          </div>
        )}
      </div>
    </div>
  );
});

type PairInfoData = {
  pair: Pair;
  amount: number;
  commissionRate: string;
  fromToken: any;
  toToken: any;
} & PoolInfo;

const Pools: React.FC<PoolsProps> = () => {
  const [pairInfos, setPairInfos] = useState<PairInfoData[]>([]);
  const [myPairsData, setMyPairsData] = useState({});
  const [address, setAddress] = useConfigReducer('address');
  const cachedPairs = useSelector((state: RootState) => state.token.pairs);
  const [cachedApr, setCachedApr] = useConfigReducer('apr');
  const [isOpenNewPoolModal, setIsOpenNewPoolModal] = useState(false);
  const [oraiPrice, setOraiPrice] = useState(0);
  const dispatch = useDispatch();
  const setCachedPairs = (payload: PairDetails) =>
    dispatch(updatePairs(payload));

  const fetchApr = async () => {
    const data = await fetchAllPoolApr();
    setCachedApr(data);
  };
  const fetchCachedPairs = async () => {
    const queries = pairs.map((pair) => ({
      address: pair.contract_addr,
      data: toBinary({
        pool: {},
      }),
    }));

    const res = await Contract.multicall.aggregate({
      queries,
    });

    const pairsData = Object.fromEntries(
      pairs.map((pair, ind) => {
        const data = res.return_data[ind];
        if (!data.success) {
          return [pair.contract_addr, {}];
        }
        return [pair.contract_addr, fromBinary(data.data)];
      })
    );
    setCachedPairs(pairsData);
  };

  const fetchMyCachedPairs = async () => {
    const queries = pairs.map((pair) => {
      const assetToken = filteredTokens.find(
        (item) => pair.token_asset === item.denom
      );
      const { info: assetInfo } = parseTokenInfo(assetToken);
      return {
        address: process.env.REACT_APP_STAKING_CONTRACT,
        data: toBinary({
          reward_info: {
            asset_info: assetInfo,
            staker_addr: address,
          },
        }),
      };
    });

    const res = await Contract.multicall.aggregate({
      queries,
    });

    const myPairData = Object.fromEntries(
      pairs.map((pair, ind) => {
        const data = res.return_data[ind];
        if (!data.success) {
          return [pair.contract_addr, {}];
        }
        const value = fromBinary(data.data);
        const bondPools = sumBy(Object.values(value.reward_infos));
        return [pair.contract_addr, !!bondPools];
      })
    );
    setMyPairsData(myPairData);
  };

  const fetchPairInfoData = async (pair: Pair): Promise<PairInfoData> => {
    const [fromToken, toToken] = pair.asset_denoms.map((denom) =>
      filteredTokens.find((token) => token.denom === denom)
    );
    if (!fromToken || !toToken) return;

    try {
      const poolData = await fetchPoolInfoAmount(
        fromToken,
        toToken,
        cachedPairs
      );

      return {
        ...poolData,
        amount: 0,
        pair,
        commissionRate: pair.commission_rate,
        fromToken,
        toToken,
      };
    } catch (ex) {
      console.log(ex);
    }
  };

  const fetchPairInfoDataList = async () => {
    console.log('fetchPairInfoDataList');
    if (!cachedPairs) {
      // wait for cached pair updated
      return;
    }

    const poolList = compact(
      await Promise.all(pairs.map((p) => fetchPairInfoData(p)))
    );

    const oraiUsdtPool = poolList.find(
      (pool) => pool.pair.asset_denoms[1] === STABLE_DENOM
    );
    const oraiUsdtPoolMilky = poolList.find(
      (pool) => pool.pair.asset_denoms[0] === MILKY
    );
    if (!oraiUsdtPoolMilky || !oraiUsdtPool) {
      console.warn('pool not found');
      // retry after
      return setTimeout(fetchPairInfoDataList, 5000);
    }

    const oraiPrice = oraiUsdtPool.askPoolAmount / oraiUsdtPool.offerPoolAmount;
    const milkyPrice =
      oraiUsdtPoolMilky.askPoolAmount / oraiUsdtPoolMilky.offerPoolAmount;
    poolList.forEach((pool) => {
      pool.amount = getUsd(
        2 * pool.offerPoolAmount,
        pool.fromToken?.denom === MILKY ? milkyPrice : oraiPrice,
        pool.fromToken.decimals
      );
    });

    setPairInfos(poolList);
    setOraiPrice(oraiPrice);
  };

  useEffect(() => {
    fetchPairInfoDataList();
  }, [cachedPairs]);

  useEffect(() => {
    fetchCachedPairs();
    fetchApr();
    fetchMyCachedPairs();
  }, []);

  const totalAmount = sumBy(pairInfos, (c) => c.amount);

  return (
    <Content nonBackground>
      <div className={styles.pools}>
        <Header amount={totalAmount} oraiPrice={oraiPrice ?? 0} />
        <ListPools
          pairInfos={pairInfos}
          allPoolApr={cachedApr}
          myPairsData={myPairsData}
          setIsOpenNewPoolModal={setIsOpenNewPoolModal}
        />
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
