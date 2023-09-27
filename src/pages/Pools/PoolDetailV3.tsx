import cn from 'classnames/bind';
import Content from 'layouts/Content';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchPairInfo,
  fetchRewardInfo,
  fetchRewardPerSecInfo,
  fetchStakingPoolInfo,
  fetchTokenInfo,
  getPairAmountInfo
} from 'rest/api';
import BondingModal from './BondingModal/BondingModal';
import LiquidityModal from './LiquidityModal/LiquidityModal';
import styles from './PoolDetailV3.module.scss';

import { useQuery } from '@tanstack/react-query';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType, oraichainTokens } from 'config/bridgeTokens';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { getUsd, toDecimal } from 'libs/utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCacheLpPools } from './helpers';
import { RootState } from 'store/configure';
import LiquidityMining from './LiquidityMining/LiquidityMining';
import UnbondModal from './UnbondModal/UnbondModal';
import { ReactComponent as LpTokenIcon } from 'assets/icons/lp_token.svg';
import { network } from 'config/networks';
import { PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { useFetchAllPairs } from './hooks';
import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { updateLpPools } from 'reducer/token';
import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { OverviewPool } from './components/OverviewPool';
import { Earning } from './components/Earning';
import { MyPoolInfo } from './components/MyPoolInfo/MyPoolInfo';
const cx = cn.bind(styles);

interface PoolDetailProps {}

const PoolDetailV3: React.FC<PoolDetailProps> = () => {
  let { poolUrl } = useParams();
  const navigate = useNavigate();
  const [isOpenLiquidityModal, setIsOpenLiquidityModal] = useState(false);
  const [isOpenBondingModal, setIsOpenBondingModal] = useState(false);
  const [isOpenUnbondModal, setIsOpenUnbondModal] = useState(false);
  const [address] = useConfigReducer('address');
  const [cachedApr] = useConfigReducer('apr');
  const [theme] = useConfigReducer('theme');
  const { data: prices } = useCoinGeckoPrices();
  const [assetToken, setAssetToken] = useState<TokenItemType>();
  const pairs = useFetchAllPairs();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const dispatch = useDispatch();
  const loadTokenAmounts = useLoadTokens();
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));
  const getPairInfo = async () => {
    if (!poolUrl) return;
    const pairRawData = poolUrl.split('_');
    const tokenTypes = pairRawData.map((raw) =>
      oraichainTokens.find((token) => token.denom === raw || token.contractAddress === raw)
    );
    let isPairExist = true;
    let info: PairInfo;
    try {
      info = await fetchPairInfo([tokenTypes[0], tokenTypes[1]]);
    } catch (error) {
      console.log('error getting pair info in pool details: ', error);
      isPairExist = false;
    }
    if (!isPairExist) return;
    return {
      info,
      token1: tokenTypes[0],
      token2: tokenTypes[1],
      apr: cachedApr?.[info.contract_addr] ?? 0
    };
  };

  const fetchCachedLpTokenAll = async () => {
    const lpTokenData = await fetchCacheLpPools(
      pairs,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedLpPools(lpTokenData);
  };

  const onBondingAction = () => {
    refetchRewardInfo();
    refetchPairAmountInfo();
    fetchCachedLpTokenAll();
    loadTokenAmounts({ oraiAddress: address });
  };

  const { data: pairInfoData } = useQuery(['pair-info', poolUrl], () => getPairInfo(), {
    refetchOnWindowFocus: false
  });

  let { data: pairAmountInfoData, refetch: refetchPairAmountInfo } = useQuery(
    ['pair-amount-info', pairInfoData],
    () => {
      return getPairAmountInfo(pairInfoData.token1, pairInfoData.token2);
    },
    {
      enabled: !!pairInfoData,
      refetchOnWindowFocus: false,
      refetchInterval: 15000
    }
  );

  const lpTokenBalance = BigInt(pairInfoData ? lpPools[pairInfoData.info.liquidity_token]?.balance ?? '0' : 0);

  const { data: lpTokenInfoData } = useQuery(
    ['token-info', pairInfoData],
    () =>
      fetchTokenInfo({
        contractAddress: pairInfoData?.info.liquidity_token
      } as TokenItemType),
    {
      enabled: !!pairInfoData,
      refetchOnWindowFocus: false
    }
  );

  const { data: totalRewardInfoData, refetch: refetchRewardInfo } = useQuery(
    ['reward-info', address, pairInfoData, assetToken],
    () => fetchRewardInfo(address, assetToken!),
    { enabled: !!address && !!assetToken, refetchOnWindowFocus: false }
  );

  const { data: rewardPerSecInfoData } = useQuery(
    ['reward-per-sec-info', address, pairInfoData, assetToken],
    async () => {
      let t = await fetchRewardPerSecInfo(assetToken!);
      return t.assets;
    },
    { enabled: !!address && !!assetToken, refetchOnWindowFocus: false }
  );

  const { data: stakingPoolInfoData } = useQuery(
    ['staking-pool-info', address, pairInfoData, assetToken],
    () => fetchStakingPoolInfo(assetToken!),
    { enabled: !!address && !!assetToken, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (pairInfoData?.token1?.name === 'ORAI') {
      setAssetToken(pairInfoData.token2);
    } else if (!!pairInfoData) {
      setAssetToken(pairInfoData.token1);
    }
  }, [pairInfoData]);

  const Token1Icon =
    theme === 'light' && pairInfoData?.token1?.IconLight ? pairInfoData?.token1?.IconLight : pairInfoData?.token1?.Icon;
  const Token2Icon =
    theme === 'light' && pairInfoData?.token2?.IconLight ? pairInfoData?.token2?.IconLight : pairInfoData?.token2?.Icon;

  const token1Amount = BigInt(pairAmountInfoData?.token1Amount ?? 0);
  const token2Amount = BigInt(pairAmountInfoData?.token2Amount ?? 0);

  const lpTotalSupply = BigInt(lpTokenInfoData?.total_supply ?? 0);
  const liquidity1 = lpTotalSupply === BigInt(0) ? BigInt(0) : (lpTokenBalance * token1Amount) / lpTotalSupply;
  const liquidity2 = lpTotalSupply === BigInt(0) ? BigInt(0) : (lpTokenBalance * token2Amount) / lpTotalSupply;
  const liquidityUsd = toDecimal(lpTokenBalance, lpTotalSupply) * (pairAmountInfoData?.tokenUsd ?? 0);

  const rewardInfoFirst = totalRewardInfoData?.reward_infos[0];

  const bondAmountUsd = rewardInfoFirst
    ? toDecimal(BigInt(rewardInfoFirst?.bond_amount ?? 0), lpTotalSupply) * (pairAmountInfoData?.tokenUsd ?? 0)
    : 0;

  return (
    <Content nonBackground>
      <div className={styles.pool_detail}>
        <div
          className={styles.back}
          onClick={() => {
            navigate(`/pools`);
          }}
        >
          <BackIcon className={styles.backIcon} />
          <span>Back to all pools</span>
        </div>
        <OverviewPool />
        <Earning />
        <MyPoolInfo />
      </div>
    </Content>
  );
};

export default PoolDetailV3;

/**
 * fetch LP balance
 * earning: orai, oraix
 * my staked (usd, lp)
 * my liquidity (usd, lp)
 */
