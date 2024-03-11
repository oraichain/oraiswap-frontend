import { toDisplay } from '@oraichain/oraidex-common';
import { FallbackEmptyData } from 'components/FallbackEmptyData';
import { Table, TableHeaderProps } from 'components/Table';
import useConfigReducer from 'hooks/useConfigReducer';
import styles from './PendingDeposits.module.scss';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { ReactComponent as BitcoinIcon } from 'assets/icons/bitcoin.svg';
import { ReactComponent as OraiDarkIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as TooltipIcon } from 'assets/icons/icon_tooltip.svg';
import { useGetPendingDeposits } from '../../hooks/relayer.hook';
import { DepositInfo } from '../../@types';

type Icons = {
  Light: any;
  Dark: any;
};

const tokens = {
  bitcoin: {
    Light: BitcoinIcon,
    Dark: BitcoinIcon
  } as Icons,
  oraichain: {
    Light: OraiLightIcon,
    Dark: OraiDarkIcon
  } as Icons
};

export const PendingDeposits: React.FC<{}> = ({}) => {
  const [theme] = useConfigReducer('theme');
  const oraichainAddress = useConfigReducer('cosmosAddress')[0]?.Oraichain;
  const data = useGetPendingDeposits(oraichainAddress);

  const generateIcon = (baseToken: Icons, quoteToken: Icons): JSX.Element => {
    let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];

    if (baseToken) BaseTokenIcon = theme === 'light' ? baseToken.Light : baseToken.Dark;
    if (quoteToken) QuoteTokenIcon = theme === 'light' ? quoteToken.Light : quoteToken.Dark;

    return (
      <div className={styles.symbols}>
        <BaseTokenIcon className={styles.symbols_logo_left} />
        <QuoteTokenIcon className={styles.symbols_logo_right} />
      </div>
    );
  };

  const handleNavigate = (txid: String) => {
    window.open(`https://blockstream.info/tx/${txid}`, '_blank');
  };

  console.log(data);

  const headers: TableHeaderProps<DepositInfo> = {
    flow: {
      name: 'Flow',
      accessor: (_) => (
        <div className={styles.symbols}>
          <div className={styles.symbols_logo}>{generateIcon(tokens.bitcoin, tokens.oraichain)}</div>
        </div>
      ),
      width: '12%',
      align: 'left'
    },
    txid: {
      name: 'Transaction Id',
      width: '50%',
      accessor: (data) => (
        <div onClick={() => handleNavigate(data.txid)}>
          <span>{`${data.txid}`}</span>
        </div>
      ),
      sortField: 'txid',
      align: 'left'
    },
    amount: {
      name: 'Amount',
      width: '13%',
      align: 'left',
      sortField: 'amount',
      accessor: (data) => <span>{toDisplay(BigInt(data.amount || 0), 8)} BTC</span>
    },
    vout: {
      name: 'Vout',
      width: '13%',
      align: 'right',
      sortField: 'vout',
      accessor: (data) => <span>{data.vout}</span>
    },
    confirmations: {
      name: 'Confirmations',
      width: '12%',
      align: 'right',
      sortField: 'confirmations',
      accessor: (data) => <span>{data.confirmations}</span>
    }
  };

  return (
    <div className={styles.pending_deposits}>
      <div className={styles.explain}>
        <div>
          <TooltipIcon width={20} height={20} />
        </div>
        <span>
          After a pending deposit disappears, it will show up as transaction hash in lastest checkpoint index.
        </span>
      </div>
      <h2 className={styles.pending_deposits_title}>Pending Deposits:</h2>
      <div className={styles.pending_deposits_list}>
        {(data?.length || 0) > 0 ? (
          <Table headers={headers} data={data} defaultSorted="confirmations" />
        ) : (
          <FallbackEmptyData />
        )}
      </div>
    </div>
  );
};
