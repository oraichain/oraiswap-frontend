import { CW20_DECIMALS } from '@oraichain/oraidex-common';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import classNames from 'classnames';
import TokenBalance from 'components/TokenBalance';
import useTheme from 'hooks/useTheme';
import { toFixedIfNecessary } from 'pages/Pools/helpers';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { useState } from 'react';
import { PoolDetail } from 'types/pool';
import styles from './OverviewPool.module.scss';
import { isMobile } from '@walletconnect/browser-utils';

export const OverviewPool = ({ poolDetailData }: { poolDetailData: PoolDetail }) => {
  const theme = useTheme();

  const { pairAmountInfoData, lpTokenInfoData } = useGetPairInfo(poolDetailData);
  const { token1, token2 } = poolDetailData;

  const [isShowMore, setIsShowMore] = useState(false);

  let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];
  if (token1) BaseTokenIcon = theme === 'light' ? token1.IconLight || token1.Icon : token1.Icon;
  if (token2) QuoteTokenIcon = theme === 'light' ? token2.IconLight || token2.Icon : token2.Icon;

  return (
    <section className={styles.overview}>
      <div className={classNames(styles.totalLiquidity, { [styles.isShowMore]: isShowMore })}>
        <div className={styles.totalTop}>
          <div className={styles.pairLogos}>
            <BaseTokenIcon className={styles.logo1} />
            <QuoteTokenIcon className={styles.logo2} />
          </div>
        </div>
        <div className={styles.amountToken}>
          <div className={styles.percent}>
            <span>{poolDetailData.token1?.name}: 50%</span>
            <div className={styles.bar}>
              <div className={styles.barActive}></div>
            </div>
            <span>{poolDetailData.token2?.name}: 50%</span>
          </div>
          <div className={styles.amount}>
            <TokenBalance
              balance={{
                amount: pairAmountInfoData?.token1Amount || '0',
                decimals: poolDetailData.token1?.decimals
              }}
              decimalScale={6}
            />
            <TokenBalance
              balance={{
                amount: pairAmountInfoData?.token2Amount || '0',
                decimals: poolDetailData.token2?.decimals
              }}
              decimalScale={6}
            />
          </div>
        </div>
      </div>
      <div className={styles.liquidity}>
        <h3 className={styles.title}>Total Liquidity</h3>
        <div className={styles.pairAmount}>
          <TokenBalance
            balance={{
              amount: BigInt(Math.trunc(poolDetailData?.info?.totalLiquidity || 0)),
              decimals: CW20_DECIMALS
            }}
            className={styles.amountUsdt}
            decimalScale={2}
            prefix="$"
          />
          <TokenBalance
            balance={{
              amount: lpTokenInfoData?.total_supply || '0',
              decimals: lpTokenInfoData?.decimals
            }}
            className={styles.amountLp}
            decimalScale={6}
            suffix=" LP"
          />
        </div>
      </div>

      <div className={styles.divider}></div>
      <div className={classNames(styles.volume)}>
        <div className={styles.title}>Volume (24H)</div>
        <div className={styles.value}>
          <TokenBalance
            balance={{
              amount: BigInt(poolDetailData.info?.volume24Hour || 0),
              decimals: CW20_DECIMALS
            }}
            className={styles.volumeAmount}
            decimalScale={2}
            prefix="$"
          />
          <span
            className={classNames(
              styles.percent,
              +poolDetailData.info?.volume24hChange > 0 ? styles.positiveVol : styles.negativeVol
            )}
          >
            <span>{+poolDetailData.info?.volume24hChange > 0 && '+'}</span>
            {poolDetailData.info?.volume24hChange ? toFixedIfNecessary(poolDetailData.info?.volume24hChange, 2) : 0}%
          </span>
        </div>
      </div>
    </section>
  );
};
