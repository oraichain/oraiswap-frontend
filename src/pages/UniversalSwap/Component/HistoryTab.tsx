import FilterIcon from 'assets/icons/filter.svg';
import styles from './HistoryTab.module.scss';
import ArrowImg from 'assets/icons/arrow_right.svg';
import OpenNewWindowImg from 'assets/icons/open_new_window.svg';
import cn from 'classnames/bind';
import { TableHeaderProps } from 'components/Table';
import Table from 'components/Table/Table';
import { HistoryInfoResponse } from 'types/swap';
import OraiIcon from 'assets/icons/oraichain_light.svg';
import SearchInput from 'components/SearchInput';
import { network } from 'config/networks';

const cx = cn.bind(styles);

const reduceString = (str, from = 6, end = 4) => {
  return str ? str.substring(0, from) + ' ... ' + str.substring(str.length - end) : '-';
};

const data: Array<HistoryInfoResponse> = [
  {
    type: 'swap',
    time: '08:32 PM',
    denom: 'orai',
    usd: '132.24',
    balanceType: 'increase',
    balance: '80',
    txHash: '5E6431ED5891AB6DFD9729645B7678843C0E0307636126A6E01317D009082478'
  },
  {
    type: 'receive',
    balanceType: 'decrease',
    time: '08:32 PM',
    denom: 'orai',
    usd: '132.24',
    balance: '70',
    txHash: '5E6431ED5891AB6DFD9729645B7678843C0E0307636126A6E01317D009082478'
  }
];

const RowsComponent: React.FC<{
  rows: HistoryInfoResponse;
}> = ({ rows }) => {
  return (
    <div>
      <div className={styles.history}>
        <div className={styles.time}>
          <div className={styles.type}>{rows.type}</div>
          <div>{rows.time}</div>
        </div>
        <div className={styles.from}>
          <div className={styles.list}>
            <div className={styles.img}>
              <img src={OraiIcon} width={26} height={26} alt="filter" />
            </div>
            <div className={styles.value}>
              <div
                className={styles.balance}
                style={{
                  color: rows.balanceType == 'increase' ? '#00AD26' : '#e01600'
                }}
              >
                {rows.balanceType == 'increase' ? '+' : '-'}
                {rows.balance}
                <span className={styles.denom}>{rows.denom}</span>
              </div>
              <div className={styles.usd}>${rows.usd}</div>
            </div>
          </div>
        </div>
        <div className={styles.icon}>
          {rows.type === 'swap' && <img src={ArrowImg} width={26} height={26} alt="filter" />}
        </div>
        <div className={styles.to}>
          {rows.type === 'swap' && (
            <div className={styles.list}>
              <div className={styles.img}>
                <img src={OraiIcon} width={26} height={26} alt="filter" />
              </div>
              <div className={styles.value}>
                <div
                  className={styles.balance}
                  style={{
                    color: rows.balanceType == 'increase' ? '#00AD26' : '#e01600'
                  }}
                >
                  {rows.balanceType == 'increase' ? '+' : '-'}
                  {rows.balance}
                  <span className={styles.denom}>{rows.denom}</span>
                </div>
                <div className={styles.usd}>${rows.usd}</div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.txhash}>
          <div className={styles.type}>TxHash</div>
          <div className={styles.link} onClick={() => window.open(`${network.explorer}/txs/${rows.txHash}`)}>
            <span>{reduceString(rows.txHash)}</span>
            <div className={styles.open_link}>
              <img src={OpenNewWindowImg} width={11} height={11} alt="filter" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HistoryTab: React.FC<unknown> = () => {
  const headers: TableHeaderProps<HistoryInfoResponse> = {
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
          <img src={FilterIcon} width={26} height={26} alt="filter" />
          <span>Transaction</span>
        </div>
        <div className={cx('search')}>
          <SearchInput placeholder="Search by address, asset, type" onSearch={(tokenName) => {}} />
        </div>
      </div>
      <div>
        <Table
          headers={headers}
          data={data}
          stylesColumn={{
            padding: '16px 0'
          }}
        />
        <Table
          headers={headers}
          data={data}
          stylesColumn={{
            padding: '16px 0'
          }}
        />
      </div>
    </div>
  );
};
