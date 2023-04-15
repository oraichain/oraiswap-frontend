import NoDataSvg from 'assets/images/NoDataPool.svg';
import SearchInput from 'components/SearchInput';
import TokenBalance from 'components/TokenBalance';
import { cosmosTokens, tokenMap } from 'config/bridgeTokens';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import Content from 'layouts/Content';
import sumBy from 'lodash/sumBy';
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PairInfoData } from './helpers';
import { useFetchApr, useFetchCachePairs, useFetchMyPairs, useFetchPairInfoDataList } from './hooks';
import styles from './index.module.scss';
import NewPoolModal from './NewPoolModal/NewPoolModal';

interface PoolsProps { }

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

const Header: FC<{ amount: number; oraiPrice: number }> = ({ amount, oraiPrice }) => {
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

const PairBox = memo<PairInfoData & { apr: number }>(({ pair, amount, commissionRate, apr }) => {
    const navigate = useNavigate();
    const [token1, token2] = pair.asset_denoms.map((denom) => tokenMap[denom]);

    if (!token1 || !token2) return null;

    return (
        <div
            className={styles.pairbox}
            onClick={() =>
                navigate(
                    `/pool/${encodeURIComponent(token1.denom)}_${encodeURIComponent(token2.denom)}`
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
                    <span className={styles.pairbox_data_value}>{100 * parseFloat(commissionRate)}%</span>
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
}>(({ pairInfos, allPoolApr, myPairsData }) => {
    const [filteredPairInfos, setFilteredPairInfos] = useState<PairInfoData[]>([]);
    const [typeFilter, setTypeFilter] = useConfigReducer('filterDefaultPool');
    useEffect(() => {
        if (!!!typeFilter) {
            setTypeFilter(KeyFilterPool.all_pool);
        }
    }, [typeFilter]);

    const listMyPool = useMemo(() => {
        return pairInfos.filter((pairInfo) => myPairsData[pairInfo?.pair?.contract_addr]);
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
                                color: item.key === typeFilter ? '#b177eb' : '#ebebeb',
                                background: item.key === typeFilter ? '#2a2a2e' : '#1e1e21'
                            }}
                            className={styles.filter_item}
                            onClick={() => setTypeFilter(item.key)}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>
                <div className={styles.listpools_search}>
                    <SearchInput placeholder="Search by pools or tokens name" onSearch={filterPairs} />
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

const Pools: React.FC<PoolsProps> = () => {
    const [isOpenNewPoolModal, setIsOpenNewPoolModal] = useState(false);

    const { data: prices } = useCoinGeckoPrices();
    const { pairInfos, oraiPrice } = useFetchPairInfoDataList()
    const [cachedApr] = useFetchApr(pairInfos, prices);
    const [myPairsData] = useFetchMyPairs();
    useFetchCachePairs();

    const totalAmount = sumBy(pairInfos, (c) => c.amount);
    return (
        <Content nonBackground>
            <div className={styles.pools}>
                <Header amount={totalAmount} oraiPrice={oraiPrice} />
                <ListPools pairInfos={pairInfos} allPoolApr={cachedApr} myPairsData={myPairsData} />
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