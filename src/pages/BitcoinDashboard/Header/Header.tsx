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
  const [address] = useConfigReducer('address');
  const { totalStaked, totalEarned } = useGetMyStake({
    stakerAddress: address
  });
  const oraiPrice = useGetBitcoinPrice();
  const { totalRewardInfoData, refetchRewardInfo } = useGetRewardInfo({ stakerAddr: address });
  const isMobileMode = isMobile();

  const [claimLoading, setClaimLoading] = useState(false);

  const [openChart, setOpenChart] = useState(!isMobileMode);
  const [filterDay, setFilterDay] = useState(FILTER_DAY.DAY);
  const [liquidityDataChart, setLiquidityDataChart] = useState(0);
  const [volumeDataChart, setVolumeDataChart] = useState(0);

  const BITCOIN_INFO = {
    name: 'Bitcoin Price',
    Icon: BitcoinIcon,
    value: oraiPrice,
    isNegative: true,
    decimal: 2
  };

  const liquidityData = [
    {
      name: 'Capacity Limit',
      Icon: null,
      value: liquidityDataChart, // || statisticData.totalLiquidity,
      isNegative: false,
      decimal: 2,
      openChart: false
    },
    {
      name: 'Total Checkpoints',
      Icon: null,
      value: volumeDataChart, // || statisticData.volume,
      isNegative: false,
      decimal: 2,
      openChart: false
    },
    {
      name: 'Confirmed Checkpoint',
      Icon: null,
      value: volumeDataChart, // || statisticData.volume,
      isNegative: false,
      decimal: 2,
      openChart: false
    }
  ];

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
            className={styles.liq_value}
            decimalScale={BITCOIN_INFO.decimal || 6}
          />
        </div>
      </div>

      <div className={styles.header_liquidity}>
        {liquidityData.map((e) => (
          <div key={e.name} className={`${styles.header_liquidity_item} ${openChart ? styles.activeChart : ''}`}>
            <div className={styles.info} onClick={() => setOpenChart((open) => !open)}>
              <div className={styles.content}>
                <span>{e.name}</span>
                <div className={styles.header_liquidity_item_info}>
                  {e.Icon && (
                    <div>
                      <e.Icon />
                    </div>
                  )}
                  <TokenBalance
                    balance={e.value}
                    prefix="$"
                    className={styles.liq_value}
                    decimalScale={e.decimal || 6}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.header_claimable}>
        <div className={styles.header_data}>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Total Reserve Value</span>
            <br />
            <TokenBalance
              balance={toDisplay(BigInt(Math.trunc(totalStaked)), CW20_DECIMALS)}
              prefix="$"
              className={styles.header_data_value}
              decimalScale={4}
            />
          </div>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Deposit Fee</span>
            <br />
            <TokenBalance
              balance={toDisplay(BigInt(Math.trunc(totalEarned)), CW20_DECIMALS)}
              prefix="$"
              className={styles.header_data_value}
              decimalScale={4}
            />
          </div>
          <div className={styles.header_data_item}>
            <span className={styles.header_data_name}>Withdrawal Fee</span>
            <br />
            <span className={styles.header_data_value}>
              <TokenBalance balance={0} prefix="+$" className={styles.header_data_value} decimalScale={4} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
