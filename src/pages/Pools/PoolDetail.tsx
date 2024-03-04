import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { useQueryClient } from '@tanstack/react-query';
import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import Content from 'layouts/Content';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateLpPools } from 'reducer/token';
import { PoolInfoResponse } from 'types/pool';
import styles from './PoolDetail.module.scss';
import { Earning } from './components/Earning';
import { MyPoolInfo } from './components/MyPoolInfo/MyPoolInfo';
import { OverviewPool } from './components/OverviewPool';
import { fetchLpPoolsFromContract, useGetPoolDetail, useGetPools, useGetPriceChange } from './hooks';
import { useGetPairInfo } from './hooks/useGetPairInfo';
import { useGetLpBalance } from './hooks/useGetLpBalance';
import TransactionHistory from './components/TransactionHistory';
import ChartDetail from './components/ChartDetail';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import useTheme from 'hooks/useTheme';

const PoolDetail: React.FC = () => {
  const theme = useTheme();
  let { poolUrl } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address] = useConfigReducer('address');
  const poolDetailData = useGetPoolDetail({ pairDenoms: poolUrl });
  const loadTokenAmounts = useLoadTokens();
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));
  const pools = useGetPools();
  const lpAddresses = pools.map((pool) => pool.liquidityAddr);
  const { refetchPairAmountInfo, refetchLpTokenInfoData } = useGetPairInfo(poolDetailData);
  const queryClient = useQueryClient();

  const { lpBalanceInfoData, refetchLpBalanceInfoData } = useGetLpBalance(poolDetailData);
  const lpTokenBalance = BigInt(lpBalanceInfoData?.balance || '0');

  const refetchAllLpPools = async () => {
    if (lpAddresses.length === 0) return;
    const lpTokenData = await fetchLpPoolsFromContract(
      lpAddresses,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedLpPools(lpTokenData);
  };

  const onLiquidityChange = useCallback(
    (amountLpInUsdt = 0) => {
      refetchPairAmountInfo();
      refetchLpTokenInfoData();
      refetchLpBalanceInfoData();
      refetchAllLpPools();
      loadTokenAmounts({ oraiAddress: address });

      // Update in an immutable way.
      const queryKey = ['pool-detail', poolUrl];
      queryClient.setQueryData(queryKey, (oldPoolDetail: PoolInfoResponse) => {
        const updatedTotalLiquidity = oldPoolDetail.totalLiquidity + amountLpInUsdt;
        return {
          ...oldPoolDetail,
          totalLiquidity: updatedTotalLiquidity
        };
      });
    },
    [address, pools]
  );

  const { token1, token2 } = poolDetailData;

  const pair = (poolUrl || '')
    .split('_')
    .map((e) => decodeURIComponent(e))
    .join('-');

  const params = {
    base_denom: pair.split('-')[0],
    quote_denom: pair.split('-')[1],
    tf: 1440
  };

  const { priceChange } = useGetPriceChange(params);

  const baseToken = (token1?.contractAddress || token1?.denom) === params.base_denom ? token1 : token2;
  const quoteToken = (token2?.contractAddress || token2?.denom) === params.base_denom ? token1 : token2;

  let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];
  if (baseToken) BaseTokenIcon = theme === 'light' ? baseToken.IconLight || baseToken.Icon : baseToken.Icon;
  if (quoteToken) QuoteTokenIcon = theme === 'light' ? quoteToken.IconLight || quoteToken.Icon : quoteToken.Icon;

  return (
    <Content nonBackground>
      <div className={styles.pool_detail}>
        <div className={styles.backWrapper}>
          <div
            className={styles.back}
            onClick={() => {
              navigate(`/pools`);
            }}
          >
            <BackIcon className={styles.backIcon} />
            <span>Back to all pools</span>
          </div>
          <div className={styles.price}>
            <div>
              <BaseTokenIcon />
            </div>
            1 {baseToken?.name} = {(priceChange?.price || 0).toFixed(6)} {quoteToken?.name}
            {/* ≈ */}
          </div>
        </div>
        <div className={styles.summary}>
          <div className={styles.overview}>
            <OverviewPool poolDetailData={poolDetailData} />
          </div>
          <div className={styles.chart}>
            <ChartDetail pair={pair} />
          </div>
        </div>
        <Earning onLiquidityChange={onLiquidityChange} />
        <MyPoolInfo myLpBalance={lpTokenBalance} onLiquidityChange={onLiquidityChange} />
        <TransactionHistory baseToken={token1} quoteToken={token2} />
      </div>
    </Content>
  );
};

export default PoolDetail;
