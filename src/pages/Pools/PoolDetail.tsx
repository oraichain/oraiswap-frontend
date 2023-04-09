import cn from 'classnames/bind';
import Pie from 'components/Pie';
import { getPair, Pair, pairs, poolTokens } from 'config/pools';
import Content from 'layouts/Content';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import styles from './PoolDetail.module.scss';

import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { useQuery } from '@tanstack/react-query';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType } from 'config/bridgeTokens';
import { Contract } from 'config/contracts';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { toDecimal } from 'libs/utils';
import { useDispatch, useSelector } from 'react-redux';
import { updateLpPools } from 'reducer/token';
import { RootState } from 'store/configure';
import LiquidityMining from './LiquidityMining/LiquidityMining';
import UnbondModal from './UnbondModal/UnbondModal';

const cx = cn.bind(styles);

interface PoolDetailProps { }

const PoolDetail: React.FC<PoolDetailProps> = () => {
  let { poolUrl } = useParams();
  let pair: Pair | undefined;

  const [isOpenLiquidityModal, setIsOpenLiquidityModal] = useState(false);
  const [isOpenBondingModal, setIsOpenBondingModal] = useState(false);
  const [isOpenUnbondModal, setIsOpenUnbondModal] = useState(false);
  const [address] = useConfigReducer('address');
  const [cachedApr] = useConfigReducer('apr');
  const [assetToken, setAssetToken] = useState<TokenItemType>();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const dispatch = useDispatch();
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));
  const loadTokenAmounts = useLoadTokens();

  const getPairInfo = async () => {
    if (!poolUrl) return;

    pair = getPair(poolUrl.split('_'));
    if (!pair) return;
    const token1 = poolTokens.find((token) => token.coinDenom === pair!.asset_denoms[0]);

    const token2 = poolTokens.find((token) => token.coinDenom === pair!.asset_denoms[1]);

    const info = await fetchPairInfo([token1!, token2!]);

    return {
      info,
      token1,
      token2,
      apr: cachedApr?.[pair.contract_addr] || 0
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

  const onBondingAction = () => {
    refetchRewardInfo();
    refetchPairAmountInfo();
    fetchCachedLpTokenAll();
    loadTokenAmounts({ oraiAddress: address });
  };

  const { data: pairInfoData } = useQuery(['pair-info', poolUrl], () => getPairInfo(), {
    // enabled: !!token1! && !!token2!,
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

  const Token1Icon = pairInfoData?.token1?.Icon,
    Token2Icon = pairInfoData?.token2?.Icon;

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

  const ratio = pairAmountInfoData ? toDecimal(token1Amount, token2Amount) : 0;
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
                  <div className={cx('name')}>{`${pairInfoData.token1!.name}/${pairInfoData.token2!.name}`}</div>
                  <TokenBalance balance={pairAmountInfoData?.tokenUsd} className={cx('value')} decimalScale={2} />
                </div>
              </div>
              {!!pairAmountInfoData && (
                <div className={cx('des')}>
                  <span>{`1 ${pairInfoData.token2!.name} ≈ `}</span>
                  <span>
                    {ratio} {pairInfoData.token1!.name}
                  </span>
                </div>
              )}
            </div>
            <div className={cx('info')}>
              {!!pairAmountInfoData && lpTokenInfoData && (
                <div className={cx('row')}>
                  <div className={cx('container', 'tokens')}>
                    <div className={cx('available-tokens')}>
                      <div className={cx('label')}>Available LP tokens</div>
                      <Pie percent={50}>
                        <div>
                          <TokenBalance
                            balance={{
                              amount: lpTokenBalance,
                              decimals: lpTokenInfoData.coinDecimals,
                              denom: lpTokenInfoData.symbol
                            }}
                            decimalScale={6}
                            className={cx('amount')}
                          />
                        </div>
                        <TokenBalance balance={liquidityUsd} decimalScale={2} className={cx('amount-usd')} />
                      </Pie>
                    </div>
                    <div className={cx('liquidity')}>
                      <div className={cx('label')}>My liquidity</div>
                      <div className={cx('liquidity_token')}>
                        <div className={cx('liquidity_token_name')}>
                          <span className={cx('mark')} style={{ background: '#FFD5AE' }}></span>
                          <span className={cx('icon')}></span>
                          <span className={cx('token-name')}>{pairInfoData.token1?.name}</span>
                        </div>
                        <div className={cx('liquidity_token_value')}>
                          <TokenBalance
                            balance={{
                              amount: liquidity1,
                              decimals: pairInfoData.token1.coinDecimals
                            }}
                            className={cx('amount')}
                            decimalScale={6}
                          />
                          <TokenBalance balance={liquidityUsd / 2} className={cx('amount-usd')} decimalScale={2} />
                        </div>
                      </div>
                      <div className={cx('liquidity_token')}>
                        <div className={cx('liquidity_token_name')}>
                          <span className={cx('mark')} style={{ background: '#612FCA' }}></span>
                          <span className={cx('icon')}></span>
                          <span className={cx('token-name')}>{pairInfoData.token2?.name}</span>
                        </div>
                        <div className={cx('liquidity_token_value')}>
                          <TokenBalance
                            balance={{
                              amount: liquidity2,
                              decimals: pairInfoData.token2.coinDecimals
                            }}
                            className={cx('amount')}
                            decimalScale={6}
                          />
                          <TokenBalance balance={liquidityUsd / 2} className={cx('amount-usd')} decimalScale={2} />
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
                          <span className={cx('token-name')}>{pairInfoData.token1!.name}</span>
                        </div>
                        <div className={cx('pool-catalyst_token_value')}>
                          <TokenBalance
                            balance={{
                              amount: pairAmountInfoData.token1Amount,
                              decimals: pairInfoData.token1.coinDecimals
                            }}
                            className={cx('amount')}
                            decimalScale={6}
                          />
                          <TokenBalance
                            balance={pairAmountInfoData.tokenUsd / 2}
                            className={cx('amount-usd')}
                            decimalScale={2}
                          />
                        </div>
                      </div>
                      <div className={cx('pool-catalyst_token')}>
                        <div className={cx('pool-catalyst_token_name')}>
                          {Token2Icon! && <Token2Icon className={cx('icon')} />}
                          <span className={cx('token-name')}>{pairInfoData.token2?.name}</span>
                        </div>
                        <div className={cx('pool-catalyst_token_value')}>
                          <TokenBalance
                            balance={{
                              amount: pairAmountInfoData.token2Amount,
                              decimals: pairInfoData.token2.coinDecimals
                            }}
                            className={cx('amount')}
                            decimalScale={6}
                          />
                          <TokenBalance
                            balance={pairAmountInfoData.tokenUsd / 2}
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
                  lpTokenBalance={lpTokenBalance.toString()}
                  rewardInfoFirst={rewardInfoFirst}
                  lpTokenInfoData={lpTokenInfoData}
                  setIsOpenUnbondModal={setIsOpenUnbondModal}
                  pairAmountInfoData={pairAmountInfoData}
                  assetToken={assetToken}
                  onBondingAction={onBondingAction}
                  totalRewardInfoData={totalRewardInfoData}
                  rewardPerSecInfoData={rewardPerSecInfoData}
                  stakingPoolInfoData={stakingPoolInfoData}
                  apr={pairInfoData.apr}
                />
              )}
            </div>
          </div>
          {isOpenLiquidityModal &&
            pairAmountInfoData &&
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
                lpTokenBalance={lpTokenBalance.toString()}
                pairAmountInfoData={pairAmountInfoData}
                refetchPairAmountInfo={refetchPairAmountInfo}
                pairInfoData={pairInfoData.info}
                fetchCachedLpTokenAll={fetchCachedLpTokenAll}
              />
            )}
          {isOpenBondingModal && lpTokenInfoData && lpTokenBalance > 0 && (
            <BondingModal
              isOpen={isOpenBondingModal}
              open={() => setIsOpenBondingModal(true)}
              close={() => setIsOpenBondingModal(false)}
              lpTokenInfoData={lpTokenInfoData}
              lpTokenBalance={lpTokenBalance.toString()}
              liquidityValue={liquidityUsd}
              assetToken={assetToken}
              onBondingAction={onBondingAction}
              apr={pairInfoData.apr}
            />
          )}
          {isOpenUnbondModal && (
            <UnbondModal
              isOpen={isOpenUnbondModal}
              open={() => setIsOpenUnbondModal(true)}
              close={() => setIsOpenUnbondModal(false)}
              bondAmount={rewardInfoFirst?.bond_amount ?? '0'}
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
