import miningImage from 'assets/images/Liquidity_mining_illus.png';
import miningLightImage from 'assets/images/Liquidity_mining_illus_light.png';
import cn from 'classnames/bind';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { cw20TokenMap, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import { Asset, OraiswapStakingTypes, PairInfo } from '@oraichain/oraidex-contracts-sdk';
import CosmJs from 'libs/cosmjs';
import useLoadTokens from 'hooks/useLoadTokens';
import { getUsd, toDecimal } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { fetchTokenInfo, generateMiningMsgs, Type, WithdrawMining } from 'rest/api';
import { TokenInfo } from 'types/token';
import styles from './LiquidityMining.module.scss';
import { handleErrorTransaction } from 'helper';

const cx = cn.bind(styles);

interface LiquidityMiningProps {
  setIsOpenBondingModal: (val: boolean) => void;
  lpTokenBalance: string;
  rewardInfoFirst: OraiswapStakingTypes.RewardInfoResponseItem;
  lpTokenInfoData: TokenInfo;
  setIsOpenUnbondModal: (val: boolean) => void;
  pairAmountInfoData: PairAmountInfo;
  assetToken: TokenItemType;
  onBondingAction: Function;
  totalRewardInfoData: OraiswapStakingTypes.RewardInfoResponse;
  rewardPerSecInfoData: Asset[];
  stakingPoolInfoData: OraiswapStakingTypes.PoolInfoResponse;
  apr: number;
  pairInfoData: PairInfo;
}

type TokenItemTypeExtended = TokenItemType & {
  amount: bigint;
  pendingWithdraw: bigint;
};

const LiquidityMining: React.FC<LiquidityMiningProps> = ({
  setIsOpenBondingModal,
  lpTokenBalance,
  rewardInfoFirst,
  lpTokenInfoData,
  setIsOpenUnbondModal,
  pairAmountInfoData,
  assetToken,
  onBondingAction,
  totalRewardInfoData,
  rewardPerSecInfoData,
  stakingPoolInfoData,
  apr,
  pairInfoData
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingRewards, setPendingRewards] = useState<TokenItemTypeExtended[]>();
  const [address] = useConfigReducer('address');
  const [cachePrices] = useConfigReducer('coingecko');
  const [cachedReward] = useConfigReducer('rewardPools');
  const [theme] = useConfigReducer('theme');
  const loadTokenAmounts = useLoadTokens();
  const reward = cachedReward?.find(e => e?.liquidity_token === pairInfoData?.liquidity_token)?.reward || ['ORAIX'];
  useEffect(() => {
    if (!!totalRewardInfoData && !!rewardPerSecInfoData) {
      // let interval = setInterval(() => setNewReward(), 1000);
      // return () => clearInterval(interval);
      setNewReward();
    }
  }, [totalRewardInfoData, rewardPerSecInfoData, stakingPoolInfoData]);

  const setNewReward = async () => {
    const totalRewardAmount = BigInt(totalRewardInfoData?.reward_infos[0]?.pending_reward ?? 0);

    const totalRewardPerSec = rewardPerSecInfoData.map((a) => BigInt(a.amount)).reduce((a, b) => a + b, BigInt(0));

    const result = rewardPerSecInfoData
      .filter((p) => parseInt(p.amount))
      .map(async (r) => {
        const pendingWithdraw = BigInt(
          totalRewardInfoData.reward_infos[0]?.pending_withdraw.find((e) => isEqual(e.info, r.info))?.amount ?? 0
        );

        const amount = (totalRewardAmount * BigInt(r.amount)) / totalRewardPerSec + pendingWithdraw;

        let token = 'token' in r.info ? cw20TokenMap[r.info.token.contract_addr] : tokenMap[r.info.native_token.denom];
        if (!token && 'token' in r.info && r.info?.token?.contract_addr) {
          const tokenInfo = await fetchTokenInfo({
            contractAddress: r.info.token.contract_addr,
            name: '',
            org: 'Oraichain',
            denom: '',
            Icon: undefined,
            chainId: 'Oraichain',
            rpc: '',
            decimals: 0,
            coinGeckoId: 'scatom',
            cosmosBased: undefined
          });

          token = {
            ...tokenInfo,
            denom: tokenInfo?.symbol
          };
        }
        return {
          ...token,
          amount,
          pendingWithdraw
        };
      });

    const res = await Promise.all(result);
    setPendingRewards(res);
  };

  const handleBond = async () => {
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msgs = generateMiningMsgs({
        type: Type.WITHDRAW_LIQUIDITY_MINING,
        sender: address,
        assetToken: assetToken
      } as WithdrawMining);

      const msg = msgs[0];

      const result = await CosmJs.execute({
        address: msg.contract,
        walletAddr: address,
        handleMsg: msg.msg.toString(),
        gasAmount: { denom: ORAI, amount: '0' },
        handleOptions: { funds: msg.sent_funds }
      });
      console.log('result provide tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        loadTokenAmounts({ oraiAddress: address });
        setActionLoading(false);
        onBondingAction();
        return;
      }
    } catch (error) {
      console.log('error in bond form: ', error);
      handleErrorTransaction(error);
    }
    setActionLoading(false);
  };

  return (
    <>
      <div className={cx('row')} style={{ marginBottom: '30px', marginTop: '40px' }}>
        <>
          <div className={cx('mining')}>
            <div className={cx('label--bold', theme)}>Liquidity Mining</div>
            <div className={cx('label--sub')}>Bond liquidity to earn {reward.join(' / ')} liquidity reward and swap fees</div>
          </div>
          <div className={cx('earning')}>
            <button
              disabled={BigInt(lpTokenBalance) <= 0}
              className={cx('btn')}
              onClick={() => setIsOpenBondingModal(true)}
            >
              Start Earning
            </button>
          </div>
        </>
      </div>
      <div className={cx('row')} style={{ flexWrap: 'wrap' }}>
        <>
          <div className={cx('mining')}>
            <div className={cx('container', 'container_mining', theme)}>
              <img className={cx('icon')} src={theme === 'light' ? miningLightImage : miningImage} />
              <div className={cx('bonded')}>
                <div className={cx('label')}>Bonded</div>
                <div>
                  <TokenBalance
                    balance={{
                      amount: BigInt(rewardInfoFirst?.bond_amount ?? '0'),
                      decimals: lpTokenInfoData.decimals,
                      denom: lpTokenInfoData?.symbol
                    }}
                    className={cx('amount', theme)}
                    decimalScale={6}
                  />
                  <div>
                    {!!pairAmountInfoData && !!lpTokenInfoData && (
                      <TokenBalance
                        balance={
                          toDecimal(BigInt(rewardInfoFirst?.bond_amount ?? 0), BigInt(lpTokenInfoData.total_supply)) *
                          pairAmountInfoData.tokenUsd
                        }
                        className={cx('amount-usd')}
                        decimalScale={2}
                      />
                    )}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: theme === 'light' ? '1px  solid #CCCDD0' : '1px  solid #2D2938',
                    width: '100%'
                    // margin: '16px 0'
                  }}
                />
                {apr && (
                  <div className={cx('bonded-apr')}>
                    <div className={cx('bonded-name')}>Current APR</div>
                    <div className={cx('bonded-value')}>{apr.toFixed(2)}%</div>
                  </div>
                )}
                {/* <div className={cx('bonded-unbouding')}>
                          <div className={cx('bonded-name')}>
                            Unbonding Duration
                          </div>
                          <div className={cx('bonded-value')}>7 days</div>
                        </div> */}
              </div>
            </div>
          </div>
          <div className={cx('earning')}>
            <div className={cx('container', 'container_earning', theme)}>
              <div className={cx('label')}>Estimated Earnings</div>
              {!!pendingRewards &&
                pendingRewards.map((r, idx) => (
                  <div key={idx}>
                    <div className={cx('amount', theme)}>
                      <TokenBalance
                        balance={{
                          amount: r.amount,
                          denom: r?.denom.toUpperCase(),
                          decimals: 6
                        }}
                        decimalScale={6}
                      />
                    </div>
                    <TokenBalance
                      balance={getUsd(r.amount, r, cachePrices, r.coinGeckoId === 'scatom' && 0.4)}
                      className={cx('amount-usd')}
                      decimalScale={2}
                    />
                  </div>
                ))}
              <button
                className={cx('btn')}
                onClick={() => handleBond()}
                disabled={actionLoading || !+totalRewardInfoData?.reward_infos[0]?.pending_reward}
              >
                {actionLoading && <Loader width={20} height={20} />}
                <span>Claim Rewards</span>
              </button>
              <button className={cx('btn', 'btn--dark', 'btn-unbond')} onClick={() => setIsOpenUnbondModal(true)}>
                <span>Unbond</span>
              </button>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default LiquidityMining;
