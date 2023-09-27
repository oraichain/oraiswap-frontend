import { ReactComponent as AiriIcon } from 'assets/icons/airi.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import NoDataSvg from 'assets/images/NoDataPool.svg';
import NoDataLightSvg from 'assets/images/NoDataPoolLight.svg';
import { Button } from 'components/Button';
import Table, { TableHeaderProps } from 'components/Table/Table';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { toDisplay } from 'libs/utils';
import { PairInfoData, formatDisplayUsdt, parseAssetOnlyDenom } from 'pages/Pools/helpers';
import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoolInfoResponse } from 'types/pool';
import { Filter } from '../Filter';
import styles from './ListPool.module.scss';
import AddLiquidityModal from '../AddLiquidityModal/AddLiquidityModal';

type ListPoolsProps = {
  pairInfos: PairInfoData[];
  allPoolApr: { [key: string]: number };
  pools: PoolInfoResponse[];
};

type PoolTableData = PoolInfoResponse & {
  reward: string[];
  myStakedLP: string;
  earned: string;
};

export const ListPools = memo<ListPoolsProps>(({ pairInfos, pools }) => {
  const [filteredPairInfos, setFilteredPairInfos] = useState<PairInfoData[]>([]);
  const [isOpenDepositPool, setIsOpenDepositPool] = useState(false);

  const [cachedReward] = useConfigReducer('rewardPools');
  console.log({ cachedReward });
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredPairInfos(pairInfos);
  }, [pairInfos]);

  const poolTableData: PoolTableData[] = pools.map((pool) => {
    const poolReward = cachedReward.find((item) => item.liquidity_token === pool.liquidityAddr);
    return {
      ...pool,
      reward: poolReward?.reward ?? [],
      myStakedLP: '2',
      earned: '1'
    };
  });

  const headers: TableHeaderProps<PoolTableData> = {
    symbols: {
      name: 'Pool Name',
      accessor: (data) => (
        <div className={styles.symbols}>
          <div className={styles.symbols_logo}>
            {theme === 'light' ? (
              <OraiLightIcon className={styles.symbols_logo_left} />
            ) : (
              <OraiIcon className={styles.symbols_logo_right} />
            )}

            {theme === 'light' ? (
              <AiriIcon className={styles.pairbox_logo2} />
            ) : (
              <AiriIcon className={styles.pairbox_logo2} />
            )}
          </div>
          <span className={styles.symbols_name}>{data.symbols}</span>
        </div>
      ),
      width: '22%',
      align: 'left'
    },
    apr: {
      name: 'APR',
      width: '12%',
      accessor: (data) => (
        <div className={styles.apr}>
          <div>{`${data.apr.toFixed(2)}%`}</div>
          <div className={styles.apr_reward}>
            {data.reward.map((asset) => (
              <span key={asset}>+{asset}</span>
            ))}
          </div>
        </div>
      ),
      align: 'left'
    },
    my_stake: {
      name: 'My Staked LP',
      width: '12%',
      align: 'left',
      accessor: (data) => <span>{formatDisplayUsdt(toDisplay(data.myStakedLP))}</span>
    },
    earned: {
      name: 'Earned',
      width: '10%',
      align: 'left',
      accessor: (data) => <span>{formatDisplayUsdt(toDisplay(data.earned))}</span>
    },
    fee7Days: {
      name: 'Fee (7D)',
      width: '10%',
      align: 'right',
      accessor: (data) => <span>{formatDisplayUsdt(toDisplay(data.fee7Days))}</span>
    },
    volume24Hour: {
      name: 'Volume (24H)',
      width: '12%',
      align: 'right',
      accessor: (data) => <span>{formatDisplayUsdt(toDisplay(data.volume24Hour))}</span>
    },
    totalLiquidity: {
      name: 'Liquidity',
      width: '22%',
      align: 'right',
      accessor: (data) => (
        <div className={styles.liquidity}>
          <span style={{ marginRight: 15 }}>
            {formatDisplayUsdt(toDisplay(parseInt(data.totalLiquidity.toString()).toString()))}
          </span>
          <Button
            type="primary-sm"
            onClick={(event) => {
              event.stopPropagation();
              setIsOpenDepositPool(true);
            }}
          >
            Add
          </Button>
        </div>
      )
    }
  };

  const handleClickRow = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, pool: PoolInfoResponse) => {
    event.stopPropagation();
    const firstAssetInfo = JSON.parse(pool.firstAssetInfo);
    const secondAssetInfo = JSON.parse(pool.secondAssetInfo);

    navigate(
      `/pool/${encodeURIComponent(parseAssetOnlyDenom(firstAssetInfo))}_${encodeURIComponent(
        parseAssetOnlyDenom(secondAssetInfo)
      )}`
    );
  };

  return (
    <div className={styles.listpools}>
      <Filter setFilteredPairInfos={setFilteredPairInfos} pairInfos={pairInfos} />

      <div className={styles.listpools_list}>
        {filteredPairInfos.length > 0 ? (
          <Table headers={headers} data={poolTableData} handleClickRow={handleClickRow} />
        ) : (
          <div className={styles.no_data}>
            <img src={theme === 'light' ? NoDataLightSvg : NoDataSvg} alt="nodata" />
            <span>No data</span>
          </div>
        )}
      </div>
      {isOpenDepositPool && (
        <AddLiquidityModal
          isOpen={isOpenDepositPool}
          open={() => setIsOpenDepositPool(true)}
          close={() => setIsOpenDepositPool(false)}
        />
      )}
    </div>
  );
});
