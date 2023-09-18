import NoDataSvg from 'assets/images/NoDataPool.svg';
import NoDataLightSvg from 'assets/images/NoDataPoolLight.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { PairInfoData, formatDisplayUsdt } from 'pages/Pools/helpers';
import { memo, useEffect, useState } from 'react';
import { PoolInfoResponse } from 'types/pool';
import { Filter } from '../Filter';
import styles from './ListPool.module.scss';
import Table, { TableHeaderProps } from 'components/Table/Table';

type ListPoolsProps = {
    pairInfos: PairInfoData[];
    allPoolApr: { [key: string]: number };
    pools: PoolInfoResponse[]
}
export const ListPools = memo<ListPoolsProps>(({ pairInfos, pools }) => {
    const [filteredPairInfos, setFilteredPairInfos] = useState<PairInfoData[]>([]);
    const [cachedReward] = useConfigReducer('rewardPools');
    const theme = useTheme()

    useEffect(() => {
        setFilteredPairInfos(pairInfos)
    }, [pairInfos])

    const headers: TableHeaderProps<PoolInfoResponse> = {
        'symbols': {
            name: "Pool Name",
            accessor: (data) => <span className={styles.symbols}>{data.symbols}</span>,
            width: "22%",
            align: 'left'

        },
        'apr': {
            name: "APR",
            width: "10%",
            accessor: (data) => <span>{`${data.apr.toFixed(2)}%`}</span>,
            align: 'left'
        },
        'my_stake': {
            name: "My Staked LP",
            width: "12%",
            align: 'left',
            accessor: (data) => <span>{data.apr}</span>,
        },
        'earned': {
            name: "Earned",
            width: "12%",
            align: 'left',
            accessor: (data) => <span>{data.apr}</span>
        },
        'fee7Days': {
            name: "Fee (7D)",
            width: "10%",
            align: 'right',
            accessor: (data) => <span>{formatDisplayUsdt(data.fee7Days)}</span>
        },
        'volume24Hour': {
            name: "Volume (24H)",
            width: "12%",
            align: 'right',
            accessor: (data) => <span>{formatDisplayUsdt(data.volume24Hour)}</span>
        },
        'totalLiquidity': {
            name: "Liquidity",
            width: "22%",
            align: 'right',
            accessor: (data) => <span>{formatDisplayUsdt(data.totalLiquidity)}</span>
        }
    }

    return (
        <div className={styles.listpools}>
            <Filter setFilteredPairInfos={setFilteredPairInfos} pairInfos={pairInfos} />

            <div className={styles.listpools_list}>
                {filteredPairInfos.length > 0 ? (
                    <Table headers={headers} data={pools} />
                    // filteredPairInfos.map((info) => (
                    //     <PoolItem
                    //         {...info}
                    //         cachedReward={cachedReward}
                    //         apr={!!allPoolApr ? allPoolApr[info.pair.contract_addr] : 0}
                    //         key={info.pair.contract_addr}
                    //         theme={theme}
                    //     />
                    // ))
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