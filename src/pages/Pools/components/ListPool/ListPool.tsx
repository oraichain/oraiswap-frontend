import { ReactComponent as AiriIcon } from 'assets/icons/airi.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import NoDataSvg from 'assets/images/NoDataPool.svg';
import NoDataLightSvg from 'assets/images/NoDataPoolLight.svg';
import { Button } from 'components/Button';
import Table, { TableHeaderProps } from 'components/Table/Table';
import { CW20_DECIMALS } from 'config/constants';
import { Pairs } from 'config/pools';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { toDisplay } from 'libs/utils';
import { PairInfoData, formatDisplayUsdt, parseAssetOnlyDenom } from 'pages/Pools/helpers';
import { StakeByUserResponse } from 'pages/Pools/hookV3';
import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoolInfoResponse } from 'types/pool';
import AddLiquidityModal from '../AddLiquidityModal/AddLiquidityModal';
import { Filter } from '../Filter';
import styles from './ListPool.module.scss';

type ListPoolsProps = {
  pairInfos: PairInfoData[];
  pools: PoolInfoResponse[];
  myStakes: StakeByUserResponse[];
};

type PoolTableData = PoolInfoResponse & {
  reward: string[];
  myStakedLP: number;
  earned: number;
};

export const ListPools = memo<ListPoolsProps>(({ pairInfos, pools, myStakes }) => {
  const [filteredPairInfos, setFilteredPairInfos] = useState<PairInfoData[]>([]);
  const [isOpenDepositPool, setIsOpenDepositPool] = useState(false);

  const [cachedReward] = useConfigReducer('rewardPools');
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredPairInfos(pairInfos);
  }, [pairInfos]);

  const poolTableData: PoolTableData[] = pools.map((pool) => {
    const poolReward = cachedReward.find((item) => item.liquidity_token === pool.liquidityAddr);
    const stakingAssetInfo = Pairs.getStakingAssetInfo([
      JSON.parse(pool.firstAssetInfo),
      JSON.parse(pool.secondAssetInfo)
    ]);
    const myStakedLP = stakingAssetInfo
      ? myStakes.find((item) => item.stakingAssetDenom === parseAssetOnlyDenom(stakingAssetInfo))?.stakingAmountInUsdt
      : 0;

    const earned = stakingAssetInfo
      ? myStakes.find((item) => item.stakingAssetDenom === parseAssetOnlyDenom(stakingAssetInfo))?.earnAmountInUsdt
      : 0;
    return {
      ...pool,
      reward: poolReward?.reward ?? [],
      myStakedLP: toDisplay(BigInt(Math.trunc(myStakedLP)), CW20_DECIMALS),
      earned: toDisplay(BigInt(Math.trunc(earned)), CW20_DECIMALS)
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
      accessor: (data) => <span>{formatDisplayUsdt(data.myStakedLP)}</span>
    },
    earned: {
      name: 'Earned',
      width: '10%',
      align: 'left',
      accessor: (data) => <span>{formatDisplayUsdt(data.earned)}</span>
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
    const [firstAssetInfo, secondAssetInfo] = [JSON.parse(pool.firstAssetInfo), JSON.parse(pool.secondAssetInfo)];

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
