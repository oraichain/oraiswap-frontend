import { AssetInfo } from '@oraichain/common-contracts-sdk';
import { ReactComponent as DownIcon } from 'assets/icons/ic_down.svg';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType, cw20TokenMap, tokenMap } from 'config/bridgeTokens';
import { ORAI, xOCH_PRICE } from 'config/constants';
import { network } from 'config/networks';
import { Pairs } from 'config/pools';
import { handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import CosmJs from 'libs/cosmjs';
import { getUsd } from 'libs/utils';
import { isEqual } from 'lodash';
import { useGetPoolDetail, useGetRewardInfo } from 'pages/Pools/hookV3';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Type, WithdrawMining, fetchTokenInfo, generateMiningMsgs } from 'rest/api';
import styles from './Earning.module.scss';

type TokenItemTypeExtended = TokenItemType & {
  amount: bigint;
  pendingWithdraw: bigint;
};
export const Earning = ({ onLiquidityChange }: { onLiquidityChange: () => void }) => {
  let { poolUrl } = useParams();
  const theme = useTheme();
  const [address] = useConfigReducer('address');
  const [cachePrices] = useConfigReducer('coingecko');
  const [pendingRewards, setPendingRewards] = useState<TokenItemTypeExtended[]>([]);
  const [stakingToken, setStakingToken] = useState<TokenItemType>();
  const [stakingAssetInfo, setStakingAssetInfo] = useState<AssetInfo>();
  const [actionLoading, setActionLoading] = useState(false);
  const poolDetailData = useGetPoolDetail({ pairDenoms: poolUrl });
  const { info } = poolDetailData;

  useEffect(() => {
    if (poolDetailData?.token1?.name === ORAI) {
      setStakingToken(poolDetailData.token2);
    } else if (!!poolDetailData) {
      setStakingToken(poolDetailData.token1);
    }
  }, [poolDetailData]);

  useEffect(() => {
    if (!info) return;
    const stakingAssetInfo = Pairs.getStakingAssetInfo([
      JSON.parse(info.firstAssetInfo),
      JSON.parse(info.secondAssetInfo)
    ]);
    setStakingAssetInfo(stakingAssetInfo);
  }, [info]);

  const { totalRewardInfoData, refetchRewardInfo } = useGetRewardInfo({
    address,
    stakingAssetInfo
  });

  useEffect(() => {
    if (totalRewardInfoData && info) {
      setNewReward();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalRewardInfoData, info]);

  const setNewReward = async () => {
    const rewardPerSecInfoData = JSON.parse(info.rewardPerSec);
    const totalRewardAmount = BigInt(totalRewardInfoData?.reward_infos[0]?.pending_reward ?? 0);

    const totalRewardPerSec = rewardPerSecInfoData.assets
      .map((a) => BigInt(a.amount))
      .reduce((a, b) => a + b, BigInt(0));

    const result = rewardPerSecInfoData.assets
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

  const onBondingAction = () => {
    refetchRewardInfo();
    setPendingRewards([]);
    onLiquidityChange();
  };

  const handleClaimReward = async () => {
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msgs = generateMiningMsgs({
        type: Type.WITHDRAW_LIQUIDITY_MINING,
        sender: address,
        assetToken: stakingToken
      } as WithdrawMining);

      const msg = msgs[0];

      const result = await CosmJs.execute({
        address: msg.contract,
        walletAddr: address,
        handleMsg: msg.msg.toString(),
        gasAmount: { denom: ORAI, amount: '0' },
        handleOptions: { funds: msg.sent_funds }
      });

      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        onBondingAction();
      }
    } catch (error) {
      console.log('error when claim reward: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className={styles.earning}>
      <div className={styles.earningLeft}>
        {pendingRewards.length > 0 &&
          pendingRewards.map((pendingReward, idx) => {
            return (
              <div className={styles.assetEarning} key={idx}>
                <div className={styles.title}>
                  {pendingReward.Icon ? (
                    theme === 'dark' ? (
                      <pendingReward.Icon style={{ width: 18, marginRight: 6 }} />
                    ) : (
                      <pendingReward.IconLight style={{ width: 18, marginRight: 6 }} />
                    )
                  ) : null}
                  <span>{pendingReward.denom.toUpperCase()} Earning</span>
                </div>
                <div className={styles.amount}>
                  <TokenBalance
                    balance={{
                      amount: pendingReward.amount,
                      denom: pendingReward?.denom.toUpperCase(),
                      decimals: 6
                    }}
                    decimalScale={6}
                  />
                </div>
                <div className={styles.amountOrai}>
                  <TokenBalance
                    balance={getUsd(
                      pendingReward.amount,
                      pendingReward,
                      cachePrices,
                      pendingReward.coinGeckoId === 'scatom' && xOCH_PRICE
                    )}
                    decimalScale={4}
                  />
                </div>
              </div>
            );
          })}
      </div>

      <div className={styles.claim}>
        <Button
          type="primary"
          onClick={() => handleClaimReward()}
          disabled={actionLoading || pendingRewards.length === 0}
          icon={actionLoading ? <Loader width={20} height={20} /> : null}
        >
          Claim Your Earned
        </Button>
        <div className={styles.earnMore}>
          <div>
            Add more liquidity to earn more <DownIcon className={styles.downIcon} />
          </div>
        </div>
      </div>
    </section>
  );
};
