import { ReactComponent as AprIcon } from 'assets/icons/ic_apr.svg';
import { ReactComponent as VolumeIcon } from 'assets/icons/ic_volume.svg';
import TokenBalance from 'components/TokenBalance';
import { CW20_DECIMALS } from 'config/constants';
import useTheme from 'hooks/useTheme';
import { toFixedIfNecessary } from 'pages/Pools/helpers';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { PoolDetail } from 'types/pool';
import styles from './OverviewPool.module.scss';

export const OverviewPool = ({ poolDetailData }: { poolDetailData: PoolDetail }) => {
  const theme = useTheme();
  const { pairAmountInfoData, lpTokenInfoData } = useGetPairInfo(poolDetailData);
  const { token1, token2 } = poolDetailData;

  const BaseTokenIcon = theme === 'light' ? token1?.IconLight || token1?.Icon : token1?.Icon;
  const QuoteTokenIcon = theme === 'light' ? token2?.IconLight || token2?.Icon : token2?.Icon;
  return (
    <section className={styles.overview}>
      <div className={styles.totalLiquidity}>
        <h3 className={styles.title}>Total Liquidity</h3>
        <div className={styles.totalTop}>
          <div className={styles.pairLogos}>
            <BaseTokenIcon className={styles.logo1} />
            <QuoteTokenIcon className={styles.logo2} />
          </div>
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
            <br />
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
        <div className={styles.amountToken}>
          <div className={styles.percent}>
            <span>{poolDetailData.token1.name}: 50%</span>
            <div className={styles.bar}>
              <div className={styles.barActive}></div>
            </div>
            <span>{poolDetailData.token2.name}: 50%</span>
          </div>
          <div className={styles.amount}>
            <TokenBalance
              balance={{
                amount: pairAmountInfoData?.token1Amount || '0',
                decimals: poolDetailData.token1.decimals
              }}
              decimalScale={6}
            />
            <TokenBalance
              balance={{
                amount: pairAmountInfoData?.token2Amount || '0',
                decimals: poolDetailData.token2.decimals
              }}
              decimalScale={6}
            />
          </div>
        </div>
      </div>
      <div className={styles.volume}>
        <div className={styles.icon}>
          <VolumeIcon />
        </div>
        <div className={styles.title}>Volume (24H)</div>
        <TokenBalance
          balance={{
            amount: BigInt(poolDetailData.info?.volume24Hour || 0),
            decimals: CW20_DECIMALS
          }}
          className={styles.volumeAmount}
          decimalScale={2}
          prefix="$"
        />
        <div className={styles.positivePercent}>
          <span>{+poolDetailData.info?.volume24hChange > 0 && '+'}</span>
          {toFixedIfNecessary(poolDetailData.info?.volume24hChange, 2)}%
        </div>
      </div>
      <div className={styles.apr}>
        <div className={styles.icon}>
          <AprIcon />
        </div>
        <div className={styles.title}>APR</div>
        <div className={styles.volumeAmount}>{poolDetailData.info?.apr.toFixed(2)}%</div>
      </div>
    </section>
  );
};
