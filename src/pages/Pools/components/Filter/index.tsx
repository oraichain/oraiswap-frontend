import classNames from 'classnames';
import SearchInput from 'components/SearchInput';
import { cosmosTokens } from 'config/bridgeTokens';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { PairInfoData, parseAssetOnlyDenom } from 'pages/Pools/helpers';
import { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import styles from './style.module.scss';

export enum KeyFilterPool {
    my_pool = 'my_pool',
    all_pool = 'all_pool'
}
export type TypeFilterPool = 'all_pool' | 'my_pool';

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

type FilterProps = {
    pairInfos: PairInfoData[];
    setFilteredPairInfos: React.Dispatch<React.SetStateAction<PairInfoData[]>>;
};
export const Filter: FC<FilterProps> = ({ pairInfos, setFilteredPairInfos }) => {
    const [typeFilter, setTypeFilter] = useConfigReducer('filterDefaultPool');
    const lpPools = useSelector((state: RootState) => state.token.lpPools);
    const theme = useTheme();

    const listMyPool = pairInfos.filter((pairInfo) => parseInt(lpPools[pairInfo?.pair?.liquidity_token]?.balance));

    const handleSearchPair = useCallback(
        (text: string) => {
            const listPairs = typeFilter === KeyFilterPool.all_pool ? pairInfos : listMyPool;
            if (!text) return setFilteredPairInfos(listPairs);

            const filteredPairs = listPairs
                .map((pair) => {
                    const cosmosToken = cosmosTokens.find((token) => token);
                    if (!cosmosToken) return undefined;
                    return {
                        ...pair,
                        name: cosmosToken.name
                    };
                })
                .filter(Boolean)
                .filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
            setFilteredPairInfos(filteredPairs);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [pairInfos, listMyPool, typeFilter]
    );

    return (
        <div className={styles.pool_filter}>
            <div className={styles.pool_filter_list}>
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
            <div className={styles.pool_search}>
                <SearchInput theme={theme} placeholder="Search by pools or tokens name" onSearch={handleSearchPair} />
            </div>
        </div>
    );
};
