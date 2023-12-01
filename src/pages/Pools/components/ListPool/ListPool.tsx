import { TokenItemType, toDisplay } from '@oraichain/oraidex-common';
import { Button } from 'components/Button';
import { FallbackEmptyData } from 'components/FallbackEmptyData';
import { Table, TableHeaderProps } from 'components/Table';
import { formatDisplayClaimable, formatDisplayUsdt, parseAssetOnlyDenom } from 'pages/Pools/helpers';
import { PoolTableData } from 'pages/Pools';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PoolInfoResponse } from 'types/pool';
import { AddLiquidityModal } from '../AddLiquidityModal';
import styles from './ListPool.module.scss';

type ListPoolProps = {
  poolTableData: PoolTableData[];
  generateIcon: (baseToken: TokenItemType, quoteToken: TokenItemType) => JSX.Element;
};

export const ListPools: React.FC<ListPoolProps> = ({ poolTableData, generateIcon }) => {
  const [pairDenomsDeposit, setPairDenomsDeposit] = useState('');
  const navigate = useNavigate();

  const headers: TableHeaderProps<PoolTableData> = {
    symbols: {
      name: 'Pool Name',
      accessor: (data) => (
        <div className={styles.symbols}>
          <div className={styles.symbols_logo}>{generateIcon(data.baseToken, data.quoteToken)}</div>
          <span className={styles.symbols_name}>{data.symbols}</span>
        </div>
      ),
      sortField: 'symbols',
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
      sortField: 'apr',
      align: 'left'
    },
    my_stake: {
      name: 'My Staked LP',
      width: '12%',
      align: 'left',
      sortField: 'myStakedLP',
      accessor: (data) => (
        <span className={!data.myStakedLP && styles.my_stake_lp}>{formatDisplayUsdt(data.myStakedLP)}</span>
      )
    },
    claimable: {
      name: 'Claimable',
      width: '10%',
      align: 'left',
      sortField: 'claimable',
      accessor: (data) => {
        const displayValue = formatDisplayClaimable(data.claimable);
        return <span className={displayValue === '0' && styles.text_number}>{displayValue}</span>;
      }
    },
    fee7Days: {
      name: 'Fee (7D)',
      width: '10%',
      align: 'right',
      sortField: 'fee7Days',
      accessor: (data) => <span>{formatDisplayUsdt(toDisplay(data.fee7Days))}</span>
    },
    volume24Hour: {
      name: 'Volume (24H)',
      width: '12%',
      align: 'right',
      sortField: 'volume24Hour',
      accessor: (data) => {
        const value = toDisplay(data.volume24Hour);
        return <span className={!value && styles.text_number}>{formatDisplayUsdt(value)}</span>;
      }
    },
    totalLiquidity: {
      name: 'Liquidity',
      width: '22%',
      align: 'right',
      sortField: 'totalLiquidity',
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
      `/pools/${encodeURIComponent(parseAssetOnlyDenom(firstAssetInfo))}_${encodeURIComponent(
        parseAssetOnlyDenom(secondAssetInfo)
      )}`
    );
  };

  return (
    <div className={styles.listpools}>
      <div className={styles.listpools_list}>
        {poolTableData.length > 0 ? (
          <Table
            headers={headers}
            data={poolTableData}
            handleClickRow={handleClickRow}
            defaultSorted="totalLiquidity"
          />
        ) : (
          <FallbackEmptyData />
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
