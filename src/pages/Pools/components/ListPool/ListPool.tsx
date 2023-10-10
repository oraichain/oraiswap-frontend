import NoDataSvg from 'assets/images/NoDataPool.svg';
import NoDataLightSvg from 'assets/images/NoDataPoolLight.svg';
import { Button } from 'components/Button';
import { Table, TableHeaderProps } from 'components/Table';
import { TokenItemType, oraichainTokens } from 'config/bridgeTokens';
import { CW20_DECIMALS } from 'config/constants';
import { Pairs } from 'config/pools';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { toDisplay } from 'libs/utils';
import { formatDisplayUsdt, parseAssetOnlyDenom } from 'pages/Pools/helpers';
import { useGetMyStake } from 'pages/Pools/hookV3';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoolInfoResponse } from 'types/pool';
import { AddLiquidityModal } from '../AddLiquidityModal';
import { Filter } from '../Filter';
import styles from './ListPool.module.scss';

type PoolTableData = PoolInfoResponse & {
  reward: string[];
  myStakedLP: number;
  earned: number;
  baseToken: TokenItemType;
  quoteToken: TokenItemType;
};

export const ListPools: React.FC = () => {
  const [filteredPools, setFilteredPools] = useState<PoolInfoResponse[]>([]);
  const [pairDenomsDeposit, setPairDenomsDeposit] = useState('');
  const [cachedReward] = useConfigReducer('rewardPools');
  const [address] = useConfigReducer('address');
  const theme = useTheme();
  const navigate = useNavigate();
  const { myStakes } = useGetMyStake({
    stakerAddress: address
  });

  const poolTableData: PoolTableData[] = filteredPools.map((pool) => {
    const poolReward = cachedReward.find((item) => item.liquidity_token === pool.liquidityAddr);
    const stakingAssetInfo = Pairs.getStakingAssetInfo([
      JSON.parse(pool.firstAssetInfo),
      JSON.parse(pool.secondAssetInfo)
    ]);
    const myStakedLP = stakingAssetInfo
      ? myStakes.find((item) => item.stakingAssetDenom === parseAssetOnlyDenom(stakingAssetInfo))
          ?.stakingAmountInUsdt || 0
      : 0;
    const earned = stakingAssetInfo
      ? myStakes.find((item) => item.stakingAssetDenom === parseAssetOnlyDenom(stakingAssetInfo))?.earnAmountInUsdt || 0
      : 0;

    const [baseDenom, quoteDenom] = [
      parseAssetOnlyDenom(JSON.parse(pool.firstAssetInfo)),
      parseAssetOnlyDenom(JSON.parse(pool.secondAssetInfo))
    ];
    const [baseToken, quoteToken] = [baseDenom, quoteDenom].map((denom) =>
      oraichainTokens.find((token) => token.denom === denom || token.contractAddress === denom)
    );
    return {
      ...pool,
      reward: poolReward?.reward ?? [],
      myStakedLP: toDisplay(BigInt(Math.trunc(myStakedLP)), CW20_DECIMALS),
      earned: toDisplay(BigInt(Math.trunc(earned)), CW20_DECIMALS),
      baseToken,
      quoteToken
    };
  });

  const generateIcon = (baseToken: TokenItemType, quoteToken: TokenItemType) => {
    const BaseTokenIcon = theme === 'light' ? baseToken?.IconLight || baseToken?.Icon : baseToken?.Icon;
    const QuoteTokenIcon = theme === 'light' ? quoteToken?.IconLight || quoteToken?.Icon : quoteToken?.Icon;
    return (
      <>
        <BaseTokenIcon className={styles.symbols_logo_left} />
        <QuoteTokenIcon className={styles.symbols_logo_right} />
      </>
    );
  };

  const headers: TableHeaderProps<PoolTableData> = {
    symbols: {
      name: 'Pool Name',
      accessor: (data) => (
        <div className={styles.symbols}>
          <div className={styles.symbols_logo}>{generateIcon(data.baseToken, data.quoteToken)}</div>
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
              setPairDenomsDeposit(
                `${parseAssetOnlyDenom(JSON.parse(data.firstAssetInfo))}_${parseAssetOnlyDenom(
                  JSON.parse(data.secondAssetInfo)
                )}`
              );
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
      <Filter setFilteredPools={setFilteredPools} />

      <div className={styles.listpools_list}>
        {filteredPools.length > 0 ? (
          <Table headers={headers} data={poolTableData} handleClickRow={handleClickRow} />
        ) : (
          <div className={styles.no_data}>
            <img src={theme === 'light' ? NoDataLightSvg : NoDataSvg} alt="nodata" />
            <span>No data</span>
          </div>
        )}
      </div>
      {pairDenomsDeposit && (
        <AddLiquidityModal
          isOpen={!!pairDenomsDeposit}
          close={() => setPairDenomsDeposit('')}
          pairDenoms={pairDenomsDeposit}
        />
      )}
    </div>
  );
};
