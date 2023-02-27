import React, { useEffect, useState } from 'react';
import styles from './PoolDetail.module.scss';
import cn from 'classnames/bind';
import { useParams } from 'react-router-dom';
import LiquidityModal from './LiquidityModal/LiquidityModal';
import BondingModal from './BondingModal/BondingModal';
import Content from 'layouts/Content';
import Pie from 'components/Pie';
import { getPair, Pair, pairs, poolTokens } from 'config/pools';
import {
  fetchPairInfo,
  fetchPoolInfoAmount,
  fetchTokenInfo,
  fetchRewardInfo,
  fetchRewardPerSecInfo,
  fetchStakingPoolInfo,
  fetchPoolApr
} from 'rest/api';

import { TokenItemType } from 'config/bridgeTokens';
import { useQuery } from '@tanstack/react-query';
import TokenBalance from 'components/TokenBalance';
import UnbondModal from './UnbondModal/UnbondModal';
import LiquidityMining from './LiquidityMining/LiquidityMining';
import useConfigReducer from 'hooks/useConfigReducer';
import { MILKY, ORAI, STABLE_DENOM } from 'config/constants';
import { RootState } from 'store/configure';
import { useDispatch, useSelector } from 'react-redux';
import { Contract } from 'config/contracts';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { updateLpPools } from 'reducer/token';
import { toDisplay } from 'libs/utils';

const cx = cn.bind(styles);

interface PoolDetailProps {}

const PoolDetail: React.FC<PoolDetailProps> = () => {
  let { poolUrl } = useParams();
  let pair: Pair | undefined;

  const [isOpenLiquidityModal, setIsOpenLiquidityModal] = useState(false);
  const [isOpenBondingModal, setIsOpenBondingModal] = useState(false);
  const [isOpenUnbondModal, setIsOpenUnbondModal] = useState(false);
  const [address] = useConfigReducer('address');
  const [assetToken, setAssetToken] = useState<TokenItemType>();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const dispatch = useDispatch();
  const setCachedLpPools = (payload: LpPoolDetails) =>
    dispatch(updateLpPools(payload));

  const getPairInfo = async () => {
    if (!poolUrl) return;

    pair = getPair(poolUrl.split('_'));
    if (!pair) return;
    const token1 = poolTokens.find(
      (token) => token.denom === pair!.asset_denoms[0]
    );

    const token2 = poolTokens.find(
      (token) => token.denom === pair!.asset_denoms[1]
    );

    const pairInfo = await fetchPairInfo([token1!, token2!]);
    const apr = await fetchPoolApr(pair.contract_addr);

    return {
      ...pairInfo,
      token1,
      token2,
      apr
    };
  };

  useEffect(() => {
    fetchCachedLpTokenAll();
  }, []);

  const fetchCachedLpTokenAll = async () => {
    const queries = pairs.map((pair) => ({
      address: pair.liquidity_token,
      data: toBinary({
        balance: {
          address
        }
      })
    }));

    const res = await Contract.multicall.aggregate({
      queries
    });

    const lpTokenData = Object.fromEntries(
      pairs.map((pair, ind) => {
        const data = res.return_data[ind];
        if (!data.success) {
          return [pair.liquidity_token, {}];
        }
        return [pair.liquidity_token, fromBinary(data.data)];
      })
    );
    setCachedLpPools(lpTokenData);
  };

  const getPairAmountInfo = async () => {
    const token1 = pairInfoData?.token1,
      token2 = pairInfoData?.token2;

    let oraiPrice = 0;

    const poolData = await fetchPoolInfoAmount(token1!, token2!);
    let _poolData: any = {};
    if (token1?.denom === ORAI && token2?.denom === STABLE_DENOM) {
      oraiPrice = poolData.askPoolAmount / poolData.offerPoolAmount;
    }
    if (token1?.denom === MILKY && token2?.denom === STABLE_DENOM) {
      _poolData = await fetchPoolInfoAmount(
        poolTokens.find((token) => token.denom === MILKY)!,
        poolTokens.find((token) => token.denom === STABLE_DENOM)!
      );
      oraiPrice = _poolData.askPoolAmount / _poolData.offerPoolAmount;
    } else {
      _poolData = await fetchPoolInfoAmount(
        poolTokens.find((token) => token.denom === ORAI)!,
        poolTokens.find((token) => token.denom === STABLE_DENOM)!
      );
      oraiPrice = _poolData.askPoolAmount / _poolData.offerPoolAmount;
    }
    let halfValue = 0;
    if (token1?.denom === ORAI) {
      const oraiValue =
        toDisplay(poolData.offerPoolAmount, token1.decimals) * oraiPrice;
      halfValue = oraiValue;
    } else if (token2?.denom === ORAI) {
      const oraiValue =
        toDisplay(poolData.askPoolAmount, token2.decimals) * oraiPrice;
      halfValue = oraiValue;
    } else if (token1?.denom === MILKY) {
      const oraiValue =
        toDisplay(_poolData.offerPoolAmount, token1.decimals) * oraiPrice;
      halfValue = oraiValue;
    } else if (token2?.denom === MILKY) {
      const oraiValue =
        toDisplay(_poolData.askPoolAmount, token2.decimals) * oraiPrice;
      halfValue = oraiValue;
    }

    return {
      token1Amount: poolData.offerPoolAmount,
      token2Amount: poolData.askPoolAmount,
      token1Usd: halfValue,
      token2Usd: halfValue,
      usdAmount: 2 * halfValue,
      ratio: poolData.offerPoolAmount / poolData.askPoolAmount
    };
  };

  const onBondingAction = () => {
    refetchRewardInfo();
  };

  const { data: pairInfoData } = useQuery(
    ['pair-info', poolUrl],
    () => getPairInfo(),
    {
      // enabled: !!token1! && !!token2!,
      refetchOnWindowFocus: false
    }
  );

  let { data: pairAmountInfoData, refetch: refetchPairAmountInfo } = useQuery(
    ['pair-amount-info', pairInfoData],
    () => {
      return getPairAmountInfo();
    },
    {
      enabled: !!pairInfoData,
      refetchOnWindowFocus: false,
      refetchInterval: 15000
    }
  );

  const lpTokenBalance = pairInfoData
    ? +lpPools[pairInfoData.liquidity_token]?.balance ?? 0
    : 0;

  const { data: lpTokenInfoData } = useQuery(
    ['token-info', pairInfoData],
    () =>
      fetchTokenInfo({
        contractAddress: pairInfoData?.liquidity_token
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

  const Token1Icon = pairInfoData?.token1?.Icon,
    Token2Icon = pairInfoData?.token2?.Icon;

  const lpTotalSupply = lpTokenInfoData ? +lpTokenInfoData.total_supply : 0;
  const liquidity1 = lpTokenBalance
    ? (lpTokenBalance * (pairAmountInfoData?.token1Amount ?? 0)) / lpTotalSupply
    : 0;
  const liquidity2 = lpTokenBalance
    ? (lpTokenBalance * (pairAmountInfoData?.token2Amount ?? 0)) / lpTotalSupply
    : 0;
  const liquidity1Usd = lpTokenBalance
    ? (lpTokenBalance * (pairAmountInfoData?.token1Usd ?? 0)) / lpTotalSupply
    : 0;
  const liquidity2Usd = lpTokenBalance
    ? (lpTokenBalance * (pairAmountInfoData?.token2Usd ?? 0)) / lpTotalSupply
    : 0;

  const rewardInfoFirst = !!totalRewardInfoData?.reward_infos?.length
    ? totalRewardInfoData?.reward_infos[0]
    : 0;
  const bondAmountUsd = rewardInfoFirst
    ? (Number(rewardInfoFirst.bond_amount) *
        (pairAmountInfoData?.usdAmount ?? 0)) /
      +(lpTokenInfoData?.total_supply ?? 0)
    : 0;

  return (
    <Content nonBackground>
      {!!pairInfoData ? (
        <>
          <div className={cx('pool-detail')}>
            <div className={cx('header')}>
              <div className={cx('token-info')}>
                <div className={cx('logo')}>
                  {Token1Icon! && <Token1Icon className={cx('token1')} />}
                  {Token2Icon! && <Token2Icon className={cx('token2')} />}
                </div>

                <div className={cx('title')}>
                  <div className={cx('name')}>{`${pairInfoData.token1!.name}/${
                    pairInfoData.token2!.name
                  }`}</div>
                  <TokenBalance
                    balance={pairAmountInfoData?.usdAmount}
                    className={cx('value')}
                    decimalScale={2}
                  />
                </div>
              </div>
              {!!pairAmountInfoData && (
                <div className={cx('des')}>
                  <span>{`1 ${pairInfoData.token2!.name} ≈ `}</span>
                  <span>{`${+pairAmountInfoData?.ratio.toFixed(6)} ${
                    pairInfoData.token1!.name
                  }`}</span>
                </div>
              )}
            </div>
            <div className={cx('info')}>
              {!!pairAmountInfoData && (
                <div className={cx('row')}>
                  <div className={cx('container', 'tokens')}>
                    <div className={cx('available-tokens')}>
                      <div className={cx('label')}>Available LP tokens</div>
                      <Pie percent={50}>
                        <div>
                          <TokenBalance
                            balance={{
                              amount: lpTokenBalance,
                              denom: `${lpTokenInfoData?.symbol}`
                            }}
                            decimalScale={6}
                            className={cx('amount')}
                          />
                        </div>
                        <TokenBalance
                          balance={liquidity1Usd ?? 0 + liquidity2Usd ?? 0}
                          decimalScale={2}
                          className={cx('amount-usd')}
                        />
                      </Pie>
                    </div>
                    <div className={cx('liquidity')}>
                      <div className={cx('label')}>My liquidity</div>
                      <div className={cx('liquidity_token')}>
                        <div className={cx('liquidity_token_name')}>
                          <span
                            className={cx('mark')}
                            style={{ background: '#FFD5AE' }}
                          ></span>
                          <span className={cx('icon')}></span>
                          <span className={cx('token-name')}>
                            {pairInfoData.token1?.name}
                          </span>
                        </div>
                        <div className={cx('liquidity_token_value')}>
                          <TokenBalance
                            balance={liquidity1}
                            className={cx('amount')}
                            decimalScale={6}
                          />
                          <TokenBalance
                            balance={liquidity1Usd}
                            className={cx('amount-usd')}
                            decimalScale={2}
                          />
                        </div>
                      </div>
                      <div className={cx('liquidity_token')}>
                        <div className={cx('liquidity_token_name')}>
                          <span
                            className={cx('mark')}
                            style={{ background: '#612FCA' }}
                          ></span>
                          <span className={cx('icon')}></span>
                          <span className={cx('token-name')}>
                            {pairInfoData.token2?.name}
                          </span>
                        </div>
                        <div className={cx('liquidity_token_value')}>
                          <TokenBalance
                            balance={liquidity2}
                            className={cx('amount')}
                            decimalScale={6}
                          />
                          <TokenBalance
                            balance={liquidity2Usd}
                            className={cx('amount-usd')}
                            decimalScale={2}
                          />
                        </div>
                      </div>
                      <button
                        className={cx('btn')}
                        style={{ marginTop: 30 }}
                        onClick={() => setIsOpenLiquidityModal(true)}
                      >
                        Add/Remove Liquidity
                      </button>
                    </div>
                  </div>

                  <div className={cx('container', 'pool-catalyst')}>
                    <div className={cx('label')}>Total liquidity</div>
                    <div className={cx('content')}>
                      <div className={cx('pool-catalyst_token')}>
                        <div className={cx('pool-catalyst_token_name')}>
                          {Token1Icon! && <Token1Icon className={cx('icon')} />}
                          <span className={cx('token-name')}>
                            {pairInfoData.token1!.name}
                          </span>
                        </div>
                        <div className={cx('pool-catalyst_token_value')}>
                          <TokenBalance
                            balance={pairAmountInfoData?.token1Amount}
                            className={cx('amount')}
                            decimalScale={6}
                          />
                          <TokenBalance
                            balance={pairAmountInfoData?.token1Usd}
                            className={cx('amount-usd')}
                            decimalScale={2}
                          />
                        </div>
                      </div>
                      <div className={cx('pool-catalyst_token')}>
                        <div className={cx('pool-catalyst_token_name')}>
                          {Token2Icon! && <Token2Icon className={cx('icon')} />}
                          <span className={cx('token-name')}>
                            {pairInfoData.token2?.name}
                          </span>
                        </div>
                        <div className={cx('pool-catalyst_token_value')}>
                          <TokenBalance
                            balance={pairAmountInfoData?.token2Amount}
                            className={cx('amount')}
                            decimalScale={6}
                          />
                          <TokenBalance
                            balance={pairAmountInfoData?.token2Usd}
                            className={cx('amount-usd')}
                            decimalScale={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {lpTokenInfoData && assetToken && (
                <LiquidityMining
                  setIsOpenBondingModal={setIsOpenBondingModal}
                  rewardInfoFirst={rewardInfoFirst}
                  lpTokenInfoData={lpTokenInfoData}
                  setIsOpenUnbondModal={setIsOpenUnbondModal}
                  pairAmountInfoData={pairAmountInfoData}
                  assetToken={assetToken}
                  onBondingAction={onBondingAction}
                  totalRewardInfoData={totalRewardInfoData}
                  rewardPerSecInfoData={rewardPerSecInfoData}
                  stakingPoolInfoData={stakingPoolInfoData}
                  pairInfoData={pairInfoData}
                />
              )}
            </div>
          </div>
          {isOpenLiquidityModal &&
            lpTokenInfoData &&
            pairInfoData.token1 &&
            pairInfoData.token2 && (
              <LiquidityModal
                isOpen={isOpenLiquidityModal}
                open={() => setIsOpenLiquidityModal(true)}
                close={() => setIsOpenLiquidityModal(false)}
                token1InfoData={pairInfoData.token1}
                token2InfoData={pairInfoData.token2}
                lpTokenInfoData={lpTokenInfoData}
                lpTokenBalance={lpTokenBalance}
                pairAmountInfoData={pairAmountInfoData}
                refetchPairAmountInfo={refetchPairAmountInfo}
                pairInfoData={pairInfoData}
                fetchCachedLpTokenAll={fetchCachedLpTokenAll}
              />
            )}
          {isOpenBondingModal && !!lpTokenInfoData && !!lpTokenBalance && (
            <BondingModal
              isOpen={isOpenBondingModal}
              open={() => setIsOpenBondingModal(true)}
              close={() => setIsOpenBondingModal(false)}
              lpTokenInfoData={lpTokenInfoData}
              lpTokenBalance={lpTokenBalance}
              liquidityValue={liquidity1Usd + liquidity2Usd}
              assetToken={assetToken}
              onBondingAction={onBondingAction}
              pairInfoData={pairInfoData}
            />
          )}
          {isOpenUnbondModal && (
            <UnbondModal
              isOpen={isOpenUnbondModal}
              open={() => setIsOpenUnbondModal(true)}
              close={() => setIsOpenUnbondModal(false)}
              bondAmount={
                rewardInfoFirst ? Number(rewardInfoFirst.bond_amount) ?? 0 : 0
              }
              bondAmountUsd={bondAmountUsd}
              lpTokenInfoData={lpTokenInfoData}
              assetToken={assetToken}
              onBondingAction={onBondingAction}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </Content>
  );
};

export default PoolDetail;
