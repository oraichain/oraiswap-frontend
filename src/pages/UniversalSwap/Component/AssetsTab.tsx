import WalletIcon from 'assets/icons/wallet-v3.svg';
import StakeIcon from 'assets/icons/stake.svg';
import styles from './AssetsTab.module.scss';
import cn from 'classnames/bind';
import { TableHeaderProps } from 'components/Table';
import Table from 'components/Table/Table';
import { AssetInfoResponse } from 'types/swap';
import OraiIcon from 'assets/icons/oraichain_light.svg';

const cx = cn.bind(styles);

const data = [
  {
    asset: "orai",
    chain: "oraichain",
    price: 2.51,
    balance: 10432,
    denom: 'orai',
    value: 26080.13,
    coeff: 5.21,
    coeffType: "increase"
  },
  {
    asset: "orai",
    chain: "oraichain",
    price: 2.51,
    balance: 10432,
    denom: 'orai',
    value: 26080.13,
    coeff: 5.21,
    coeffType: "decrease"
  },
  {
    asset: "orai",
    chain: "oraichain",
    price: 2.51,
    balance: 10432,
    denom: 'orai',
    value: 26080.13,
    coeff: 5.21,
    coeffType: "decrease"
  }
]

export const AssetsTab: React.FC<{}> = () => {
  const headers: TableHeaderProps<AssetInfoResponse> = {
    'assets': {
      name: "ASSET",
      accessor: (data) => <div className={styles.assets}>
        <div className={styles.left}>
          <img src={OraiIcon} width={26} height={26} alt="arrow" />
        </div>
        <div className={styles.right}>
          <div className={styles.assetName}>
            {data.asset}
          </div>
          <div className={styles.assetChain}>
            {data.chain}
          </div>
        </div>
      </div>,
      width: "22%",
      align: 'center'
    },
    'price': {
      name: "PRICE",
      width: "22%",
      accessor: (data) => <span>${data.price}</span>,
      align: 'center'
    },
    'balance': {
      name: "BALANCE",
      width: "22%",
      align: 'center',
      accessor: (data) => <span>${data.balance}</span>,
    },
    'value': {
      name: "VALUE",
      width: "22%",
      align: 'center',
      accessor: (data) => {
        const checkCoeffType = data.coeffType === "increase";
        const coeffTypeValue = checkCoeffType ? "+" : "-";
        return (
          <div className={styles.valuesColumn}>
            <div className={styles.values}>
              <div className={styles.value}>${data.value}</div>
              <div style={{
                color: checkCoeffType ? "#00AD26" : "#E01600"
              }} className={styles.coeff}>{coeffTypeValue}{data.coeff}%</div>
            </div>
          </div>
        )
      }
    },
    'filter': {
      name: "FILTER",
      width: "12%",
      align: 'center',
      accessor: () => <span></span>
    },
  }


  return (
    <div className={cx('assetsTab')}>
      <div className={cx('info')}>
        {[
          {
            src: WalletIcon,
            label: 'Total balance',
            balance: '30,756.21'
          },
          {
            src: StakeIcon,
            label: 'Total staked',
            balance: '10,425.42'
          }
        ].map((e, i) => {
          return (
            <div key={i} className={cx('total-info')}>
              <div className={cx('icon')}>
                <img className={cx('wallet')} src={e.src} alt="wallet" />
              </div>
              <div className={cx('balance')}>
                <div className={cx('label')}>{e.label}</div>
                <div className={cx('value')}>${e.balance}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <Table headers={headers} data={data} stylesColumn={{
          padding: '16px 0'
        }} />
      </div>
    </div>
  );
};
