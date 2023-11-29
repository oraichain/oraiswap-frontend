import Content from 'layouts/Content';
import React, { useState } from 'react';
import NewPoolModal from './NewPoolModal/NewPoolModal';
import NewTokenModal from './NewTokenModal/NewTokenModal';
import { Header } from './components/Header';
import { ListPools } from './components/ListPool';
import { ListPoolsMobile } from './components/ListPoolMobile';
import { useFetchAllPairs, useFetchCachePairs, useFetchCacheReward } from './hooks';

import { CW20_DECIMALS, INJECTIVE_CONTRACT, ORAI, TokenItemType, toDisplay } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { oraichainTokensWithIcon } from 'config/chainInfos';
import { Pairs } from 'config/pools';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import isEqual from 'lodash/isEqual';
import { PoolInfoResponse } from 'types/pool';
import { Filter } from './components/Filter';
import { parseAssetOnlyDenom } from './helpers';
import {
  useFetchLpPoolsV3,
  useGetMyStake,
  useGetPools,
  useGetPoolsWithClaimableAmount,
  useGetRewardInfo
} from './hookV3';
import styles from './index.module.scss';

export type PoolTableData = PoolInfoResponse & {
  reward: string[];
  myStakedLP: number;
  earned: number;
  claimable: number;
  baseToken: TokenItemType;
  quoteToken: TokenItemType;
};

const Pools: React.FC<{}> = () => {
  const [isOpenNewPoolModal, setIsOpenNewPoolModal] = useState(false);
  const [isOpenNewTokenModal, setIsOpenNewTokenModal] = useState(false);
  const [filteredPools, setFilteredPools] = useState<PoolInfoResponse[]>([]);

  const pairs = useFetchAllPairs();
  const [address] = useConfigReducer('address');
  const theme = useTheme();
  const mobileMode = isMobile();
  useFetchCacheReward(pairs);
  useFetchCachePairs(pairs);

  const pools = useGetPools();
  const lpAddresses = pools.map((pool) => pool.liquidityAddr);
  useFetchLpPoolsV3(lpAddresses);

  const { myStakes } = useGetMyStake({
    stakerAddress: address
  });
  const { totalRewardInfoData } = useGetRewardInfo({
    stakerAddr: address
  });

  const listClaimableData = useGetPoolsWithClaimableAmount({
    poolTableData: filteredPools,
    totalRewardInfoData
  });
  const [cachedReward] = useConfigReducer('rewardPools');

  const poolTableData: PoolTableData[] = filteredPools
    .map((pool) => {
      const poolReward = cachedReward.find((item) => item.liquidity_token === pool.liquidityAddr);
      const stakingAssetInfo = Pairs.getStakingAssetInfo([
        JSON.parse(pool.firstAssetInfo),
        JSON.parse(pool.secondAssetInfo)
      ]);

      // calculate my stake in usdt, we calculate by bond_amount from contract and totalLiquidity from backend.
      const myStakedLP = stakingAssetInfo
        ? totalRewardInfoData?.reward_infos.find((item) => isEqual(item.asset_info, stakingAssetInfo))?.bond_amount ||
          '0'
        : 0;
      const totalSupply = pool.totalSupply;
      const lpPrice = pool.totalSupply ? pool.totalLiquidity / Number(totalSupply) : 0;
      const myStakeLPInUsdt = +myStakedLP * lpPrice;

      const earned = stakingAssetInfo
        ? myStakes.find((item) => item.stakingAssetDenom === parseAssetOnlyDenom(stakingAssetInfo))?.earnAmountInUsdt ||
          0
        : 0;

      const [baseDenom, quoteDenom] = [
        parseAssetOnlyDenom(JSON.parse(pool.firstAssetInfo)),
        parseAssetOnlyDenom(JSON.parse(pool.secondAssetInfo))
      ];
      const [baseToken, quoteToken] = [baseDenom, quoteDenom].map((denom) =>
        oraichainTokensWithIcon.find((token) => token.denom === denom || token.contractAddress === denom)
      );
      // TODO: hardcode reverse symbol order for ORAI/INJ pools, need to update later
      let { symbols } = pool;
      if (baseDenom === INJECTIVE_CONTRACT && quoteDenom === ORAI) {
        symbols = symbols.split('/').reverse().join('/');
      }

      // calc claimable of each pool
      const poolAssetInfo = Pairs.getStakingAssetInfo([
        JSON.parse(pool.firstAssetInfo),
        JSON.parse(pool.secondAssetInfo)
      ]);
      const claimableAmount = listClaimableData.find(
        (e) => parseAssetOnlyDenom(e.assetInfo) === parseAssetOnlyDenom(poolAssetInfo)
      );

      return {
        ...pool,
        reward: poolReward?.reward ?? [],
        myStakedLP: toDisplay(BigInt(Math.trunc(myStakeLPInUsdt)), CW20_DECIMALS),
        earned: toDisplay(BigInt(Math.trunc(earned)), CW20_DECIMALS),
        baseToken,
        quoteToken,
        symbols,
        claimable: claimableAmount?.amountEachPool || 0
      };
    })
    .sort((poolA, poolB) => {
      return poolB.totalLiquidity - poolA.totalLiquidity;
    });

  const generateIcon = (baseToken: TokenItemType, quoteToken: TokenItemType): JSX.Element => {
    const BaseTokenIcon = theme === 'light' ? baseToken.IconLight : baseToken.Icon;
    const QuoteTokenIcon = theme === 'light' ? quoteToken.IconLight : quoteToken.Icon;
    // TODO: hardcode reverse logo for ORAI/INJ, need to update later
    if (baseToken.coinGeckoId === 'injective-protocol' && quoteToken.coinGeckoId === 'oraichain-token') {
      return (
        <div className={styles.symbols}>
          <QuoteTokenIcon className={styles.symbols_logo_left} />
          <BaseTokenIcon className={styles.symbols_logo_right} />
        </div>
      );
    }

    return (
      <div className={styles.symbols}>
        <BaseTokenIcon className={styles.symbols_logo_left} />
        <QuoteTokenIcon className={styles.symbols_logo_right} />
      </div>
    );
  };

  return (
    <Content nonBackground>
      <div className={styles.pools}>
        <Header dataSource={poolTableData} />
        <div>
          <Filter setFilteredPools={setFilteredPools} setIsOpenNewTokenModal={setIsOpenNewTokenModal} />
          {mobileMode ? (
            <ListPoolsMobile poolTableData={poolTableData} generateIcon={generateIcon} />
          ) : (
            <ListPools poolTableData={poolTableData} generateIcon={generateIcon} />
          )}
        </div>

        <NewPoolModal
          isOpen={isOpenNewPoolModal}
          open={() => setIsOpenNewPoolModal(true)}
          close={() => setIsOpenNewPoolModal(false)}
        />
        <NewTokenModal
          isOpen={isOpenNewTokenModal}
          open={() => setIsOpenNewTokenModal(true)}
          close={() => setIsOpenNewTokenModal(false)}
        />
      </div>
    </Content>
  );
};

export default Pools;
