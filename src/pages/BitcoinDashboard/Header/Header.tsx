import { CW20_DECIMALS, ORAI, USDT_CONTRACT, toDecimal, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as BitcoinIcon } from 'assets/icons/bitcoin.svg';
import TokenBalance from 'components/TokenBalance';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { useGetMyStake, useGetPools, useGetRewardInfo } from 'pages/Pools/hooks';
import { FC, useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { isMobile } from '@walletconnect/browser-utils';
import { FILTER_DAY } from 'reducer/type';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import Search from 'components/SearchInput';
import {
  useGetBitcoinConfig,
  useGetCheckpointQueue,
  useGetDepositFee,
  useGetTotalValueLocked,
  useGetWithdrawalFee
} from '../hooks';

// TODO: Update this method when BTC is added to pool
// CURRENT REPLACEMENT: Fetch price from other platform
export const useGetBitcoinPrice = () => {
  const [price, setPrice] = useState(0);
  const {
    data: { bitcoin }
  } = useCoinGeckoPrices();

  useEffect(() => {
    setPrice(bitcoin);
  }, [bitcoin]);

  return price;
};

export const Header: FC<{}> = ({}) => {
  const theme = useTheme();
  const [checkpointIndex, setCheckpointIndex] = useState<number | null>(null);
  const [btcAddress, setBtcAddress] = useConfigReducer('btcAddress');
  const btcPrice = useGetBitcoinPrice();
  const valueLocked = useGetTotalValueLocked();
  const depositFee = useGetDepositFee(checkpointIndex);
  const withdrawalFee = useGetWithdrawalFee(btcAddress, checkpointIndex);
  const bitcoinConfig = useGetBitcoinConfig();
  const checkpointQueue = useGetCheckpointQueue();
  //   const withdrawalFees = useGetWithdrawalFee(checkpointIndex);

  //   const isMobileMode = isMobile(); // not use yet
  //   const [openChart, setOpenChart] = useState(!isMobileMode); // not use yet

  const BITCOIN_INFO = {
    name: 'Bitcoin Price',
    Icon: BitcoinIcon,
    value: btcPrice,
    isNegative: true,
    decimal: 2
  };

  const overallData = [
    {
      name: 'Capacity Limit',
      Icon: null,
      value: toDisplay(BigInt(bitcoinConfig?.capacity_limit || 0), 8), // || statisticData.totalLiquidity,
      isNegative: false,
      decimal: 2
      //   openChart: false
    },
    {
      name: 'Total Reserve Value',
      Icon: null,
      value: toDisplay(BigInt(valueLocked?.value || 0), 8), // || statisticData.volume,
      isNegative: false,
      decimal: 6
      //   openChart: false
    },
    {
      name: 'Total Checkpoints',
      Icon: null,
      value: checkpointQueue?.index || 0, // || statisticData.volume,
      isNegative: false,
      decimal: 2
      //   openChart: false
    },
    {
      name: 'Confirmed Checkpoint',
      Icon: null,
      value: checkpointQueue?.confirmed_index || 0, // || statisticData.volume,
      isNegative: false,
      decimal: 2
      //   openChart: false
    }
  ];

  useEffect(() => {
    (async () => {
      try {
        const btcAddr = btcAddress ?? (await window.Bitcoin.getAddress());
        setBtcAddress(btcAddr);
      } catch (e) {}
    })();
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.header_title}>
        {/* <span className={styles.header_title_text}>POOLS</span> */}
        <div className={styles.header_title_text}>
          <div>
            <BITCOIN_INFO.Icon />
          </div>
          <span className={styles.priceOrai}>{BITCOIN_INFO.name}</span>
          <TokenBalance
            balance={BITCOIN_INFO.value}
            prefix="$"
            className={styles.overrall_value}
            decimalScale={BITCOIN_INFO.decimal || 6}
          />
        </div>
      </div>

      <div className={styles.header_overrall}>
        {overallData.map((e) => (
          <div key={e.name} className={`${styles.header_overrall_item}`}>
            <div className={styles.info}>
              <div className={styles.content}>
                <span>{e.name}</span>
                <div className={styles.header_overrall_item_info}>
                  {e.Icon && (
                    <div>
                      <e.Icon />
                    </div>
                  )}
                  <TokenBalance
                    balance={e.value}
                    prefix=""
                    className={styles.overrall_value}
                    decimalScale={e.decimal || 6}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.header_detail_checkpoint}>
        <div className={styles.header_data}>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Current Checkpoint</span>
            <br />
            <TokenBalance
              balance={checkpointIndex || checkpointQueue?.index || 0}
              prefix=""
              suffix=""
              className={styles.header_data_value}
              decimalScale={6}
            />
          </div>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Deposit Fee</span>
            <br />
            <TokenBalance
              balance={toDisplay(BigInt(depositFee?.deposit_fees || 0), 14)}
              prefix=""
              suffix="BTC"
              className={styles.header_data_value}
              decimalScale={6}
            />
          </div>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Withdrawal Fee</span>
            <br />
            <span className={styles.header_data_value}>
              <TokenBalance
                balance={toDisplay(BigInt(withdrawalFee?.withdrawal_fees || 0), 14)}
                prefix=""
                suffix="BTC"
                className={styles.header_data_value}
                decimalScale={6}
              />
            </span>
          </div>
        </div>
        <div className={styles.header_search_checkpoint}>
          <Search
            className={styles.header_search_checkpoint_input}
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
