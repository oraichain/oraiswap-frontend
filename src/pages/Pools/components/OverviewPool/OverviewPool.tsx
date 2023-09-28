import { useQuery } from '@tanstack/react-query';
import { ReactComponent as AiriIcon } from 'assets/icons/airi.svg';
import { ReactComponent as AprIcon } from 'assets/icons/ic_apr.svg';
import { ReactComponent as VolumeIcon } from 'assets/icons/ic_volume.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType } from 'config/bridgeTokens';
import { CW20_DECIMALS } from 'config/constants';
import { fetchTokenInfo, getPairAmountInfo } from 'rest/api';
import { PoolDetail } from 'types/pool';
import styles from './OverviewPool.module.scss';
import { toDisplay } from 'libs/utils';

const useGetPairAmountInfo = (poolDetailData: PoolDetail) => {
  const { data: pairAmountInfoData } = useQuery(
    ['pair-amount-info', poolDetailData],
    () => {
      return getPairAmountInfo(poolDetailData.token1, poolDetailData.token2);
    },
    {
      enabled: !!poolDetailData,
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 15 // 15 second interval
    }
  );

  return pairAmountInfoData;
};

const useGetLpAmount = (poolDetailData: PoolDetail) => {
  const { data: lpTokenInfoData } = useQuery(
    ['lp-info', poolDetailData],
    () =>
      fetchTokenInfo({
        contractAddress: poolDetailData?.info.liquidityAddr
      } as TokenItemType),
    {
      enabled: !!poolDetailData,
      refetchOnWindowFocus: false
    }
  );

  return lpTokenInfoData;
};

export const OverviewPool = ({ poolDetailData }: { poolDetailData: PoolDetail }) => {
  const pairAmountInfoData = useGetPairAmountInfo(poolDetailData);
  const lpTokenInfoData = useGetLpAmount(poolDetailData);

  return (
    <section className={styles.overview}>
      <div className={styles.totalLiquidity}>
        <h3 className={styles.title}>Total Liquidity</h3>
        <div className={styles.totalTop}>
          <div className={styles.pairLogos}>
            <AiriIcon className={styles.logo1} />
            <OraiIcon className={styles.logo2} />
          </div>
          <div className={styles.pairAmount}>
            <TokenBalance
              balance={{
                amount: BigInt(Math.trunc(poolDetailData?.info?.totalLiquidity)) || 0n,
                decimals: CW20_DECIMALS
              }}
              className={styles.amountUsdt}
              decimalScale={2}
              prefix="$"
            />
            <br />
            <TokenBalance
              balance={{
                amount: lpTokenInfoData?.total_supply,
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
        <div className={styles.volumeAmount}>${toDisplay(poolDetailData.info.volume24Hour)}</div>
        <div className={styles.positivePercent}>+0.2%</div>
      </div>
      <div className={styles.apr}>
        <div className={styles.icon}>
          <AprIcon />
        </div>
        <div className={styles.title}>APR</div>
        <div className={styles.volumeAmount}>{poolDetailData.info.apr.toFixed(2)}%</div>
        <div className={styles.positivePercent}>6.35%</div>
      </div>
    </section>
  );
};
