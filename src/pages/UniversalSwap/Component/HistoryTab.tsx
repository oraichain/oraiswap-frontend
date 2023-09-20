import WalletIcon from 'assets/icons/wallet-v3.svg';
import StakeIcon from 'assets/icons/stake.svg';
import styles from './HistoryTab.module.scss';
import cn from 'classnames/bind';
import { TableHeaderProps } from 'components/Table';
import Table from 'components/Table/Table';
import { AssetInfoResponse } from 'types/swap';
import OraiIcon from 'assets/icons/oraichain_light.svg';

const cx = cn.bind(styles);

const data = [
  {
    asset: 'orai',
    chain: 'oraichain',
    price: 2.51,
    balance: 10432,
    denom: 'orai',
    value: 26080.13,
    coeff: 5.21,
    coeffType: 'increase'
  }
];

export const HistoryTab: React.FC<{}> = () => {
  const headers: TableHeaderProps<AssetInfoResponse> = {
    assets: {
      name: 'May 6, 2023',
      accessor: (data) => (
        <div className={styles.assets}>
          <div className={styles.left}>
            <img src={OraiIcon} width={26} height={26} alt="arrow" />
          </div>
          <div className={styles.right}>
            <div className={styles.assetName}>{data.asset}</div>
            <div className={styles.assetChain}>{data.chain}</div>
          </div>
        </div>
      ),
      width: '22%',
      align: 'center'
    }
  };

  return (
    <div className={cx('historyTab')}>
      <div className={cx('info')}></div>
      <div>
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
