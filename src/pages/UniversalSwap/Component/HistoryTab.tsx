import ArrowImg from 'assets/icons/arrow_right.svg';
import FilterIcon from 'assets/icons/filter.svg';
import OpenNewWindowImg from 'assets/icons/open_new_window.svg';
import OraiIcon from 'assets/icons/oraichain_light.svg';
import cn from 'classnames/bind';
import SearchInput from 'components/SearchInput';
import { Table, TableHeaderProps } from 'components/Table';
import { network } from 'config/networks';
import { reduceString, timeSince } from 'libs/utils';
import { HistoryInfoResponse } from 'types/swap';
import styles from './HistoryTab.module.scss';
import { useEffect, useState } from 'react';
import { TransactionHistory } from 'libs/duckdb';
import { flattenTokens, tokens } from '@oraichain/oraidex-common';
import { chainInfosWithIcon } from 'config/chainInfos';
import useTheme from 'hooks/useTheme';

const cx = cn.bind(styles);

const RowsComponent: React.FC<{
  rows: TransactionHistory;
}> = ({ rows }) => {
  const theme = useTheme();
  const [fromToken, toToken] = [
    flattenTokens.find((token) => token.coinGeckoId === rows.fromCoingeckoId),
    flattenTokens.find((token) => token.coinGeckoId === rows.toCoingeckoId)
  ];

  if (!fromToken || !toToken) return <></>;

  const [fromChain, toChain] = [
    chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === fromToken.chainId),
    chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === toToken.chainId)
  ];

  return (
    <div>
      <div className={styles.history}>
        <div className={styles.time}>
          <div className={styles.type}>{rows.type}</div>
          <div className={styles.timestamp}>{timeSince(Number(rows.timestamp))}</div>
        </div>
        <div className={styles.from}>
          <div className={styles.list}>
            <div className={styles.img}>
              <img src={OraiIcon} width={26} height={26} alt="filter" />
              {/* <fromToken.Icon /> */}
              <div className={styles.imgChain}>
                {theme === 'light' ? (
                  <fromChain.IconLight width={14} height={14} />
                ) : (
                  <fromChain.Icon width={14} height={14} />
                )}
              </div>
            </div>
            <div className={styles.value}>
              <div
                className={styles.balance}
                style={{
                  color: '#e01600'
                }}
              >
                {'-'}
                {rows.fromAmount}
                <span className={styles.denom}>{fromToken.name}</span>
              </div>
              <div className={styles.timestamp}>${rows.fromAmountInUsdt}</div>
            </div>
          </div>
        </div>
        <div className={styles.icon}>
          <img src={ArrowImg} width={26} height={26} alt="filter" />
        </div>
        <div className={styles.to}>
          <div className={styles.list}>
            <div className={styles.img}>
              <img src={OraiIcon} width={26} height={26} alt="filter" />
              <div className={styles.imgChain}>
                {theme === 'light' ? (
                  <toChain.IconLight width={14} height={14} />
                ) : (
                  <toChain.Icon width={14} height={14} />
                )}
              </div>
            </div>
            <div className={styles.value}>
              <div
                className={styles.balance}
                style={{
                  color: '#00AD26'
                }}
              >
                {'+'}
                {rows.toAmount}
                <span className={styles.denom}>{toToken.name}</span>
              </div>
              <div className={styles.timestamp}>${rows.toAmountInUsdt}</div>
            </div>
          </div>
        </div>
        <div className={styles.txhash}>
          <div className={styles.type}>TxHash</div>
          <div className={styles.link} onClick={() => window.open(`${network.explorer}/txs/${rows.initialTxHash}`)}>
            <span>{reduceString(rows.initialTxHash, 6, 4)}</span>
            <div className={styles.open_link}>
              <img src={OpenNewWindowImg} width={11} height={11} alt="filter" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HistoryTab: React.FC<{
  networkFilter: string;
}> = ({ networkFilter }) => {
  const [transHistory, setTransHistory] = useState([]);

  useEffect(() => {
    window.duckdb.getTransHistory().then((history) => {
      setTransHistory(history);
    });
  }, []);

  const headers: TableHeaderProps<TransactionHistory> = {
    assets: {
      name: 'May 6, 2023',
      accessor: (data) => <RowsComponent rows={data} />,
      width: '100%',
      align: 'left'
    }
  };

  return (
    <div className={cx('historyTab')}>
      <div className={cx('info')}>
        <div className={cx('filter')}>
          <img src={FilterIcon} className={cx('filter-icon')} alt="filter" />
          <span className={cx('filter-title')}>Transaction</span>
        </div>
        <div className={cx('search')}>
          <SearchInput placeholder="Search by address, asset, type" onSearch={(tokenName) => {}} />
        </div>
      </div>
      <div>
        <Table
          headers={headers}
          data={transHistory}
          stylesColumn={{
            padding: '16px 0'
          }}
        />
      </div>
    </div>
  );
};
