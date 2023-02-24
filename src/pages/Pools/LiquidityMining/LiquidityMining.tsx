import React, { FC, memo, useEffect, useState } from 'react';
import { Button, Divider, Input } from 'antd';
import styles from './LiquidityMining.module.scss';
import cn from 'classnames/bind';
import { Type, generateMiningMsgs, WithdrawMining } from 'rest/api';
import { filteredTokens, TokenItemType, tokens } from 'config/bridgeTokens';
import TokenBalance from 'components/TokenBalance';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import CosmJs from 'libs/cosmjs';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import Loader from 'components/Loader';
import _ from 'lodash';
import { TokenInfo } from 'types/token';
import useGlobalState from 'hooks/useGlobalState';
import miningImage from 'assets/images/Liquidity_mining_illus.png';

const cx = cn.bind(styles);

interface LiquidityMiningProps {
  setIsOpenBondingModal: any;
  rewardInfoFirst: any;
  lpTokenInfoData: TokenInfo;
  setIsOpenUnbondModal: any;
  pairAmountInfoData: any;
  assetToken: TokenItemType;
  onBondingAction: any;
  totalRewardInfoData: any;
  rewardPerSecInfoData: any;
  stakingPoolInfoData: any;
  pairInfoData: any;
}

const LiquidityMining: React.FC<LiquidityMiningProps> = ({
  setIsOpenBondingModal,
  rewardInfoFirst,
  lpTokenInfoData,
  setIsOpenUnbondModal,
  pairAmountInfoData,
  assetToken,
  onBondingAction,
  totalRewardInfoData,
  rewardPerSecInfoData,
  stakingPoolInfoData,
  pairInfoData
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingRewards, setPendingRewards] = useState<[any]>();
  const [address] = useGlobalState('address');

  useEffect(() => {
    if (!!totalRewardInfoData && !!rewardPerSecInfoData) {
      // let interval = setInterval(() => setNewReward(), 1000);
      // return () => clearInterval(interval);
      setNewReward();
    }
  }, [
    JSON.stringify(totalRewardInfoData),
    JSON.stringify(rewardPerSecInfoData),
    JSON.stringify(stakingPoolInfoData)
  ]);

  const setNewReward = () => {
    let totalRewardAmount = !!totalRewardInfoData.reward_infos.length
      ? +totalRewardInfoData.reward_infos[0]?.pending_reward
      : 0;

    const totalRewardPerSec =
      rewardPerSecInfoData.length > 1
        ? rewardPerSecInfoData.reduce((a: any, b: any) => +a.amount + +b.amount)
        : +rewardPerSecInfoData[0].amount;

    let res = rewardPerSecInfoData.map((r: any) => {
      const pendingWithdraw = +(
        totalRewardInfoData.reward_infos[0]?.pending_withdraw.find((e: any) =>
          _.isEqual(e.info, r.info)
        )?.amount ?? 0
      );
      const amount =
        (totalRewardAmount * +r.amount) / totalRewardPerSec + pendingWithdraw;
      if (!!r.info.token) {
        let token = filteredTokens.find(
          (t) => t.contractAddress === r.info.token.contract_addr!
        );
        // const usdValue = getUsd(
        //   amount,
        //   prices[token!.coingeckoId],
        //   token!.decimals
        // );
        return {
          ...token,
          amount,
          rewardPerSec: +r.amount,
          pendingWithdraw
          // usdValue
        };
      } else {
        let token = filteredTokens.find(
          (t) => t.denom === r.info.native_token.denom!
        );
        // const usdValue = getUsd(
        //   amount,
        //   prices[token!.coingeckoId],
        //   token!.decimals
        // );
        return {
          ...token,
          amount,
          rewardPerSec: +r.amount,
          pendingWithdraw
          // usdValue
        };
      }
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
      <div
        className={cx('row')}
        style={{ marginBottom: '30px', marginTop: '40px' }}
      >
        <>
          <div className={cx('mining')}>
            <div className={cx('label--bold')}>Liquidity Mining</div>
            <div className={cx('label--sub')}>
              Bond liquidity to earn ORAI liquidity reward and swap fees
            </div>
          </div>
          <div className={cx('earning')}>
            <Button
              className={cx('btn')}
              onClick={() => setIsOpenBondingModal(true)}
            >
              Start Earning
            </Button>
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
                      amount: rewardInfoFirst
                        ? rewardInfoFirst.bond_amount ?? 0
                        : 0,
                      denom: `${
                        lpTokenInfoData?.symbol.charAt(0) === 'u'
                          ? lpTokenInfoData?.symbol.substring(1)
                          : lpTokenInfoData?.symbol
                      }` // symbol should not be minimal
                    }}
                    className={cx('amount')}
                    decimalScale={6}
                  />
                  <div>
                    {!!pairAmountInfoData && !!lpTokenInfoData && (
                      <TokenBalance
                        balance={
                          (rewardInfoFirst
                            ? rewardInfoFirst.bond_amount *
                              pairAmountInfoData.usdAmount
                            : 0) / +lpTokenInfoData.total_supply
                        }
                        className={cx('amount-usd')}
                        decimalScale={2}
                      />
                    )}
                  </div>
                </div>
                <Divider
                  dashed
                  style={{
                    background: '#2D2938',
                    width: '100%',
                    height: '1px'
                    // margin: '16px 0'
                  }}
                />
                {!!pairInfoData?.apr && (
                  <div className={cx('bonded-apr')}>
                    <div className={cx('bonded-name')}>Current APR</div>
                    <div className={cx('bonded-value')}>
                      {(pairInfoData?.apr).toFixed(2)}%
                    </div>
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
                pendingRewards.map((r: any, idx) => (
                  <div key={idx}>
                    <div className={cx('amount')}>
                      <TokenBalance
                        balance={{
                          amount: r.amount,
                          denom: r.denom.toUpperCase(),
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
              <Button
                className={cx('btn')}
                onClick={() => handleBond()}
                disabled={
                  actionLoading ||
                  !+totalRewardInfoData?.reward_infos[0]?.pending_reward
                }
              >
                {actionLoading && <Loader width={20} height={20} />}
                <span>Claim Rewards</span>
              </Button>
              <Button
                className={cx('btn', 'btn--dark')}
                onClick={() => setIsOpenUnbondModal(true)}
              >
                <span>Unbond</span>
              </Button>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default LiquidityMining;
