import ArrowImg from 'assets/icons/arrow_right.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/ic_status_done.svg';
import { ReactComponent as ErrorIcon } from 'assets/icons/ic_status_failed.svg';
import OpenNewWindowImg from 'assets/icons/open_new_window.svg';
import cn from 'classnames/bind';
import { FallbackEmptyData } from 'components/FallbackEmptyData';
import { Table, TableHeaderProps } from 'components/Table';
import { chainInfosWithIcon, flattenTokensWithIcon } from 'config/chainInfos';
import { network } from 'config/networks';
import useTheme from 'hooks/useTheme';
import { TransactionHistory } from 'libs/duckdb';
import { reduceString, timeSince } from 'libs/utils';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { useGetTransHistory } from '../Swap/hooks';
import styles from './HistoryTab.module.scss';
import { getExplorerScan } from '../helpers';
import { useState } from 'react';

const cx = cn.bind(styles);
const RowsComponent: React.FC<{
  rows: TransactionHistory;
}> = ({ rows }) => {
  const theme = useTheme();
  const [fromToken, toToken] = [
    flattenTokensWithIcon.find((token) => token.coinGeckoId === rows.fromCoingeckoId),
    flattenTokensWithIcon.find((token) => token.coinGeckoId === rows.toCoingeckoId)
  ];
  if (!fromToken || !toToken) return <></>;

  const [fromChain, toChain] = [
    chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === rows.fromChainId),
    chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === rows.toChainId)
  ];
  if (!fromChain || !toChain) return <></>;

  const generateTransactionStatus = (status: string) => {
    if (status === 'error') return <ErrorIcon />;
    if (status === 'success') return <SuccessIcon />;
    return (
      <div className={styles.loadingTrans}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.history}>
        {/* TODO: show later */}
        {/* <div className={styles.status}>{generateTransactionStatus(rows.status)}</div> */}
        <div className={styles.time}>
          <div className={styles.type}>{rows.type}</div>
          <div className={styles.timestamp}>{timeSince(Number(rows.timestamp))}</div>
        </div>
        <div className={styles.from}>
          <div className={styles.list}>
            <div className={styles.img}>
              {theme === 'light' ? (
                <fromToken.IconLight width={26} height={26} />
              ) : (
                <fromToken.Icon width={26} height={26} />
              )}
              <div className={styles.imgChain}>
                {theme === 'light' ? (
                  <fromChain.IconLight width={14} height={14} />
                ) : (
                  <fromChain.Icon width={14} height={14} />
                )}
              </div>
            </div>
            <div className={styles.value}>
              <div className={styles.subBalance}>
                {'-'}
                {rows.fromAmount}
                <span className={styles.denom}>{fromToken.name}</span>
              </div>
              <div className={styles.timestamp}>{formatDisplayUsdt(rows.fromAmountInUsdt)}</div>
            </div>
          </div>
        </div>
        <div className={styles.icon}>
          <img src={ArrowImg} width={26} height={26} alt="filter" />
        </div>
        <div className={styles.to}>
          <div className={styles.list}>
            <div className={styles.img}>
              {theme === 'light' ? (
                <toToken.IconLight width={26} height={26} />
              ) : (
                <toToken.Icon width={26} height={26} />
              )}
              <div className={styles.imgChain}>
                {theme === 'light' ? (
                  <toChain.IconLight width={14} height={14} />
                ) : (
                  <toChain.Icon width={14} height={14} />
                )}
              </div>
            </div>
            <div className={styles.value}>
              <div className={styles.addBalance}>
                {'+'}
                {rows.toAmount}
                <span className={styles.denom}>{toToken.name}</span>
              </div>
              <div className={styles.timestamp}>{formatDisplayUsdt(rows.toAmountInUsdt)}</div>
            </div>
          </div>
        </div>
        <div className={styles.txhash}>
          <div className={styles.type}>TxHash</div>
          <div
            className={styles.link}
            onClick={() => window.open(`${getExplorerScan(rows.fromChainId)}/${rows.initialTxHash}`)}
          >
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
  const { transHistory } = useGetTransHistory();
  const [selectedData, setSelectedData] = useState(null);

  const headers: TableHeaderProps<TransactionHistory> = {
    assets: {
      name: '',
      accessor: (data) => <RowsComponent rows={data} />,
      width: '100%',
      align: 'left'
    }
  };

  return (
    <>
      <div className={cx('historyTab')}>
        {/* <div className={cx('info')}>
        <div className={cx('filter')}>
          <img src={FilterIcon} className={cx('filter-icon')} alt="filter" />
          <span className={cx('filter-title')}>Transaction</span>
        </div>
        <div className={cx('search')}>
          <SearchInput placeholder="Search by address, asset, type" onSearch={(tokenName) => {}} />
        </div>
      </div> */}
        <div className={styles.historyData}>
          <h2>Latest 20 transactions</h2>
          {transHistory && transHistory.length > 0 ? (
            <Table
              headers={headers}
              data={transHistory}
              stylesColumn={{
                padding: '16px 0'
              }}
              handleClickRow={(e, data) => {
                setSelectedData(data);
              }}
            />
          ) : (
            <FallbackEmptyData />
          )}
        </div>
      </div>
    </>
  );
};
