import { ReactComponent as AprIcon } from 'assets/icons/ic_apr.svg';
import { ReactComponent as VolumeIcon } from 'assets/icons/ic_volume.svg';
import { ReactComponent as ArrowUpIcon } from 'assets/icons/arrow_up.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow_down.svg';
import TokenBalance from 'components/TokenBalance';
import useTheme from 'hooks/useTheme';
import { toFixedIfNecessary } from 'pages/Pools/helpers';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { PoolDetail } from 'types/pool';
import styles from './OverviewPool.module.scss';
import { CW20_DECIMALS } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as BoostIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BoostIconLight } from 'assets/icons/boost-icon.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';

export const OverviewPool = ({ poolDetailData }: { poolDetailData: PoolDetail }) => {
  const theme = useTheme();
  const mobileMode = isMobile();
  const [cachedReward] = useConfigReducer('rewardPools');

  const { pairAmountInfoData, lpTokenInfoData } = useGetPairInfo(poolDetailData);
  const { token1, token2 } = poolDetailData;

  const { liquidityAddr: stakingToken } = poolDetailData.info || {};
  let poolReward = {
    reward: []
  };

  if (cachedReward && cachedReward.length > 0) {
    poolReward = cachedReward.find((item) => item.liquidity_token === stakingToken);
  }

  const [isShowMore, setIsShowMore] = useState(false);

  let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];
  if (token1) BaseTokenIcon = theme === 'light' ? token1.IconLight || token1.Icon : token1.Icon;
  if (token2) QuoteTokenIcon = theme === 'light' ? token2.IconLight || token2.Icon : token2.Icon;

  const aprBoost = Number(poolDetailData.info?.aprBoost || 0).toFixed(2);
  const isApproximatelyZero = Number(aprBoost) === 0;
  const totalApr = poolDetailData.info?.apr ? poolDetailData.info.apr.toFixed(2) : 0;
  const originalApr = Number(totalApr) - Number(aprBoost);

  return (
    <section className={styles.overview}>
      <div className={classNames(styles.totalLiquidity, { [styles.isShowMore]: isShowMore })}>
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
        {mobileMode &&
          (!isShowMore ? (
            <div className={styles.showMore} onClick={() => setIsShowMore(true)}>
              Show more
              <ArrowDownIcon />
            </div>
          ) : (
            <div className={styles.showMore} onClick={() => setIsShowMore(false)}>
              Show less
              <ArrowUpIcon />
            </div>
          ))}
      </div>
      <div className={classNames(styles.volume, { [styles.open]: isShowMore })}>
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
        <div
          className={classNames(
            styles.percent,
            +poolDetailData.info?.volume24hChange > 0 ? styles.positiveVol : styles.negativeVol
          )}
        >
          <span>{+poolDetailData.info?.volume24hChange > 0 && '+'}</span>
          {poolDetailData.info?.volume24hChange ? toFixedIfNecessary(poolDetailData.info?.volume24hChange, 2) : 0}%
        </div>
      </div>
      {/* <div className={classNames(styles.apr, { [styles.open]: isShowMore })}>
        <div className={styles.icon}>
          <AprIcon />
        </div>
        <div className={styles.title}>Total APR</div>
        <div className={styles.volumeAmount}>{totalApr}%</div>
        <div className={styles.aprDetail}>
          <div className={styles.fee}>
            <span>Earn swap fees</span>
            <span>
              <span>{isApproximatelyZero ? '≈ ' : ''}</span>
              {aprBoost}%
            </span>
          </div>
          <div className={styles.aprBoost}>
            <div className={styles.text}>
              <div>{theme === 'light' ? <BoostIconLight /> : <BoostIconDark />}</div>
              <span>{poolReward?.reward?.join('+')}</span>
              Boost
            </div>

            <span>{`${originalApr.toFixed(2)}%`}</span>
          </div>
        </div>
      </div> */}
    </section>
  );
};
