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
import { CheckpointStatus, DepositInfo, DepositInfoWithCheckpoint, TransactionParsedInput } from '../../@types';
import { useEffect, useState } from 'react';
import { useGetCheckpointData, useGetCheckpointQueue } from 'pages/BitcoinDashboard/hooks';
import { useRelayerFeeToken } from 'hooks/useTokenFee';
import { btcTokens, oraichainTokens } from 'config/bridgeTokens';

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
  const key = `pending_deposits_${oraichainAddress}`;
  const fee = useRelayerFeeToken(btcTokens[0], oraichainTokens[19]);
  let data = useGetPendingDeposits(oraichainAddress);
  const checkpointQueue = useGetCheckpointQueue();
  const buildingCheckpointIndex = checkpointQueue?.index || 0;
  const checkpointData = useGetCheckpointData(buildingCheckpointIndex);
  const checkpointPreviousData = useGetCheckpointData(
    buildingCheckpointIndex > 1 ? buildingCheckpointIndex - 1 : buildingCheckpointIndex
  );
  const hasSigningCheckpoint =
    buildingCheckpointIndex == 0 ? false : checkpointPreviousData?.status == CheckpointStatus.Signing;
  const [pendingDeposits, setPendingDeposits] = useState<DepositInfo[]>([]);
  let cachePendingDeposits = localStorage.getItem(key) ? (JSON.parse(localStorage.getItem(key)) as DepositInfo[]) : [];
  console.log('🚀 ~ cachePendingDeposits:', cachePendingDeposits);

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

  const validateExistenceOnPendingDeposits = (
    arr: DepositInfoWithCheckpoint[] | DepositInfo[] | TransactionParsedInput[],
    findItem: DepositInfo
  ): boolean => {
    let filteredArr = arr.filter((item) => {
      if (item.txid == findItem.txid) {
        return true;
      }
      return false;
    });
    return filteredArr.length > 0;
  };

  /**
   * @devs: This will pop out pending deposits if stored building checkpoint is less than
   * current building checkpoint index. (if there is any signing state, minus building
   * checkpoint index to 1).
   */
  useEffect(() => {
    if (!checkpointQueue || !oraichainAddress || !checkpointData || !checkpointPreviousData) return;
    cachePendingDeposits = cachePendingDeposits.filter((item) => {
      const isExistOnBuildingCheckpoint = validateExistenceOnPendingDeposits(
        checkpointData.transaction.data.input,
        item
      );
      const isExistOnSigningCheckpoint =
        validateExistenceOnPendingDeposits(checkpointPreviousData.transaction.data.input, item) &&
        checkpointPreviousData.status == CheckpointStatus.Signing;
      const isExistOnPendingDeposits = validateExistenceOnPendingDeposits(data, item);

      return isExistOnSigningCheckpoint || isExistOnBuildingCheckpoint || isExistOnPendingDeposits ? true : false;
    });
    setPendingDeposits(cachePendingDeposits);
    localStorage.setItem(key, JSON.stringify(cachePendingDeposits));
  }, [checkpointData, checkpointPreviousData, oraichainAddress, hasSigningCheckpoint]);

  /**
   * @devs: This one will handle update pendingDeposits to localStorage,
   * if there is no cache, set current pending deposits with latest building
   * checkpoint index.
   */
  useEffect(() => {
    if (oraichainAddress && data && checkpointQueue?.index) {
      if (!cachePendingDeposits) {
        cachePendingDeposits = data;
      } else {
        for (const item of data) {
          if (!validateExistenceOnPendingDeposits(cachePendingDeposits, item)) {
            cachePendingDeposits = [...cachePendingDeposits, item];
          } else {
            const txIndex = cachePendingDeposits.findIndex((data) => data.txid === item.txid);
            cachePendingDeposits[txIndex] = item;
          }
        }
      }
      setPendingDeposits(cachePendingDeposits);
      localStorage.setItem(key, JSON.stringify(cachePendingDeposits));
    }
  }, [data, oraichainAddress, checkpointQueue]);

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
      accessor: (data) => <span>{(toDisplay(BigInt(data.amount || 0), 8) - fee.relayerFee).toFixed(6)} BTC</span>
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
          <Table headers={headers} data={pendingDeposits} defaultSorted="confirmations" />
        ) : (
          <FallbackEmptyData />
        )}
      </div>
    </div>
  );
};
