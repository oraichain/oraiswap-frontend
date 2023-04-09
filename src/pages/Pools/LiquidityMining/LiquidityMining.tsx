import miningImage from 'assets/images/Liquidity_mining_illus.png';
import cn from 'classnames/bind';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { cw20TokenMap, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import { Asset, RewardInfoResponseItem } from 'libs/contracts';
import { PoolInfoResponse, RewardInfoResponse } from 'libs/contracts/OraiswapStaking.types';
import CosmJs from 'libs/cosmjs';
import useLoadTokens from 'hooks/useLoadTokens';
import { toDecimal } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { generateMiningMsgs, Type, WithdrawMining } from 'rest/api';
import { TokenInfo } from 'types/token';
import styles from './LiquidityMining.module.scss';

const cx = cn.bind(styles);

interface LiquidityMiningProps {
  setIsOpenBondingModal: (val: boolean) => void;
  lpTokenBalance: string;
  rewardInfoFirst: RewardInfoResponseItem;
  lpTokenInfoData: TokenInfo;
  setIsOpenUnbondModal: (val: boolean) => void;
  pairAmountInfoData: PairAmountInfo;
  assetToken: TokenItemType;
  onBondingAction: Function;
  totalRewardInfoData: RewardInfoResponse;
  rewardPerSecInfoData: Asset[];
  stakingPoolInfoData: PoolInfoResponse;
  apr: number;
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
  apr
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingRewards, setPendingRewards] = useState<TokenItemTypeExtended[]>();
  const [address] = useConfigReducer('address');
  const loadTokenAmounts = useLoadTokens();

  useEffect(() => {
    if (!!totalRewardInfoData && !!rewardPerSecInfoData) {
      // let interval = setInterval(() => setNewReward(), 1000);
      // return () => clearInterval(interval);
      setNewReward();
    }
  }, [totalRewardInfoData, rewardPerSecInfoData, stakingPoolInfoData]);

  const setNewReward = () => {
    const totalRewardAmount = BigInt(totalRewardInfoData?.reward_infos[0]?.pending_reward ?? 0);

    const totalRewardPerSec = rewardPerSecInfoData.map((a) => BigInt(a.amount)).reduce((a, b) => a + b, BigInt(0));

    let res = rewardPerSecInfoData
      .filter((p) => parseInt(p.amount))
      .map((r) => {
        const pendingWithdraw = BigInt(
          totalRewardInfoData.reward_infos[0]?.pending_withdraw.find((e) => isEqual(e.info, r.info))?.amount ?? 0
        );

        const amount = (totalRewardAmount * BigInt(r.amount)) / totalRewardPerSec + pendingWithdraw;

        const token =
          'token' in r.info ? cw20TokenMap[r.info.token.contract_addr] : tokenMap[r.info.native_token.denom];

        return {
          ...token,
          amount,
          pendingWithdraw
        };
      });

    setPendingRewards(res);
  };

  const handleBond = async () => {
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      // const msgs = await generateMiningMsgs({
      //   type: Type.BOND_LIQUIDITY,
      //   sender: `${walletAddr}`,
      //   amount: `${parsedAmount}`,
      //   lpToken: lpTokenInfoData.contract_addr,
      //   assetToken
      // });

      const msgs = await generateMiningMsgs({
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
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = error as string;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError
      });
    }
    setActionLoading(false);
  };

  return (
    <>
      <div className={cx('row')} style={{ marginBottom: '30px', marginTop: '40px' }}>
        <>
          <div className={cx('mining')}>
            <div className={cx('label--bold')}>Liquidity Mining</div>
            <div className={cx('label--sub')}>Bond liquidity to earn ORAI liquidity reward and swap fees</div>
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
            <div className={cx('container', 'container_mining')}>
              <img className={cx('icon')} src={miningImage} />
              <div className={cx('bonded')}>
                <div className={cx('label')}>Bonded</div>
                <div>
                  <TokenBalance
                    balance={{
                      amount: BigInt(rewardInfoFirst?.bond_amount ?? '0'),
                      decimals: lpTokenInfoData.coinDecimals,
                      denom: lpTokenInfoData?.symbol
                    }}
                    className={cx('amount')}
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
                    borderTop: '1px  dashed #2D2938',
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
            <div className={cx('container', 'container_earning')}>
              <div className={cx('label')}>Estimated Earnings</div>
              {!!pendingRewards &&
                pendingRewards.map((r, idx) => (
                  <div key={idx}>
                    <div className={cx('amount')}>
                      <TokenBalance
                        balance={{
                          amount: r.amount,
                          denom: r.coinDenom.toUpperCase(),
                          decimals: 6
                        }}
                        decimalScale={6}
                      />
                    </div>
                    {/* <TokenBalance
                              balance={r.usdValue}
                              className={cx('amount-usd')}
                              decimalScale={2}
                            /> */}
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
