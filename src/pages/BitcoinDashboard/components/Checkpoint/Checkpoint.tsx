import React, { useEffect, useState } from 'react';
import styles from './Checkpoint.module.scss';
import TokenBalance from 'components/TokenBalance';
import {
  useGetCheckpointData,
  useGetCheckpointQueue,
  useGetDepositFee,
  useGetWithdrawalFee
} from 'pages/BitcoinDashboard/hooks';
import useConfigReducer from 'hooks/useConfigReducer';
import { toDisplay } from '@oraichain/oraidex-common';
import Search from 'components/SearchInput';
import useTheme from 'hooks/useTheme';

const Checkpoint: React.FC<{}> = ({}) => {
  const theme = useTheme();
  const [btcAddress, setBtcAddress] = useConfigReducer('btcAddress');
  const [checkpointIndex, setCheckpointIndex] = useState<number | null>(null);
  const checkpointQueue = useGetCheckpointQueue();
  const depositFee = useGetDepositFee(checkpointIndex);
  const withdrawalFee = useGetWithdrawalFee(btcAddress, checkpointIndex);
  const checkpointData = useGetCheckpointData(checkpointIndex);

  useEffect(() => {
    (async () => {
      try {
        const btcAddr = btcAddress ?? (await window.Bitcoin.getAddress());
        setBtcAddress(btcAddr);
      } catch (e) {}
    })();
  }, []);

  return (
    <div className={styles.checkpoint}>
      <div className={styles.checkpoint_detail_checkpoint}>
        <div className={styles.checkpoint_data}>
          <div className={styles.checkpoint_data_item}>
            <span className={styles.checkpoint_data_name}>Current Checkpoint</span>
            <br />
            <TokenBalance
              balance={checkpointIndex || checkpointQueue?.index || 0}
              prefix=""
              suffix=""
              className={styles.checkpoint_data_value}
              decimalScale={6}
            />
          </div>
          <div className={styles.checkpoint_data_item}>
            <span className={styles.checkpoint_data_name}>Status</span>
            <br />
            <span className={styles.checkpoint_data_value}>{checkpointData?.status}</span>
          </div>
          <div className={styles.checkpoint_data_item}>
            <span className={styles.checkpoint_data_name}>Deposit Fee</span>
            <br />
            <TokenBalance
              balance={toDisplay(BigInt(depositFee?.deposit_fees || 0), 14)}
              prefix=""
              suffix="BTC"
              className={styles.checkpoint_data_value}
              decimalScale={6}
            />
          </div>
          <div className={styles.checkpoint_data_item}>
            <span className={styles.checkpoint_data_name}>Withdrawal Fee</span>
            <br />
            <span className={styles.checkpoint_data_value}>
              <TokenBalance
                balance={toDisplay(BigInt(withdrawalFee?.withdrawal_fees || 0), 14)}
                prefix=""
                suffix="BTC"
                className={styles.checkpoint_data_value}
                decimalScale={6}
              />
            </span>
          </div>
        </div>
        <div className={styles.checkpoint_search_checkpoint}>
          <Search
            className={styles.checkpoint_search_checkpoint_input}
            onChange={(e) => {
              if (e.target.value.length != 0) {
                setCheckpointIndex(parseInt(e.target.value));
              }
            }}
            placeholder="Search checkpoint index number"
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkpoint;
