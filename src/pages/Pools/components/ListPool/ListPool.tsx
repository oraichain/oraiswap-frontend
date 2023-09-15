import NoDataSvg from 'assets/images/NoDataPool.svg';
import NoDataLightSvg from 'assets/images/NoDataPoolLight.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { PairInfoData } from 'pages/Pools/helpers';
import { memo, useEffect, useState } from 'react';
import { PoolInfoResponse } from 'types/pool';
import { Filter } from '../Filter';
import styles from './ListPool.module.scss';
import { PoolItem } from './PoolItem';

type ListPoolsProps = {
    pairInfos: PairInfoData[];
    allPoolApr: { [key: string]: number };
    pools: PoolInfoResponse[]
}
export const ListPools = memo<ListPoolsProps>(({ pairInfos, allPoolApr, pools }) => {
    const [filteredPairInfos, setFilteredPairInfos] = useState<PairInfoData[]>([]);
    const [cachedReward] = useConfigReducer('rewardPools');
    const theme = useTheme()

    useEffect(() => {
        setFilteredPairInfos(pairInfos)
    }, [pairInfos])

    return (
        <div className={styles.listpools}>
            <Filter setFilteredPairInfos={setFilteredPairInfos} pairInfos={pairInfos} />

            <div className={styles.listpools_list}>
                {filteredPairInfos.length > 0 ? (
                    filteredPairInfos.map((info) => (
                        <PoolItem
                            {...info}
                            cachedReward={cachedReward}
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