import { ORAI } from '@oraichain/oraidex-common/build/constant';
import { TokenItemType } from '@oraichain/oraidex-common/build/token';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { cw20TokenMap, tokenMap } from 'config/bridgeTokens';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import CosmJs from 'libs/cosmjs';
import isEqual from 'lodash/isEqual';
import { useGetMyStake } from 'pages/Pools/hooks/useGetMyStake';
import { useGetPoolDetail } from 'pages/Pools/hooks/useGetPoolDetail';
import { useGetRewardInfoDetail } from 'pages/Pools/hooks/useGetRewardInfo';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Type, fetchTokenInfo, generateMiningMsgs } from 'rest/api';
import { WithdrawLP } from 'types/pool';
import { SCATOM_COINGECKO_ID } from '../constants';

export type TokenItemTypeExtended = TokenItemType & {
  amount: bigint;
  pendingWithdraw: bigint;
};
export const useEarningReward = ({ onLiquidityChange }: { onLiquidityChange: () => void }) => {
  let { poolUrl } = useParams();
  const [address] = useConfigReducer('address');
  const [pendingRewards, setPendingRewards] = useState<TokenItemTypeExtended[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const poolDetailData = useGetPoolDetail({ pairDenoms: poolUrl });
  const { myStakes } = useGetMyStake({
    stakerAddress: address,
    pairDenoms: poolUrl
  });

  const { info } = poolDetailData;

  const { totalRewardInfoData, refetchRewardInfo } = useGetRewardInfoDetail({
    stakerAddr: address,
    poolInfo: poolDetailData.info
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
    // unit LP
    const totalRewardPerSec = rewardPerSecInfoData.assets
      .map((asset) => BigInt(asset.amount))
      .reduce((a, b) => a + b, BigInt(0));

    const result = rewardPerSecInfoData.assets
      .filter((asset) => parseInt(asset.amount))
      .map(async (asset) => {
        const pendingWithdraw = BigInt(
          totalRewardInfoData.reward_infos[0]?.pending_withdraw.find((e) => isEqual(e.info, asset.info))?.amount ?? 0
        );

        const amount = (totalRewardAmount * BigInt(asset.amount)) / totalRewardPerSec + pendingWithdraw;
        let token =
          'token' in asset.info
            ? cw20TokenMap[asset.info.token.contract_addr]
            : tokenMap[asset.info.native_token.denom];

        // only for atom/scatom pool
        if (!token && 'token' in asset.info && asset.info?.token?.contract_addr) {
          const tokenInfo = await fetchTokenInfo({
            contractAddress: asset.info.token.contract_addr,
            name: '',
            org: 'Oraichain',
            denom: '',
            Icon: undefined,
            chainId: 'Oraichain',
            rpc: '',
            decimals: 0,
            coinGeckoId: SCATOM_COINGECKO_ID,
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
    onLiquidityChange();
  };

  const handleClaimReward = async () => {
    if (!poolDetailData || !poolDetailData.info)
      return displayToast(TToastType.TX_FAILED, { message: 'Pool information does not exist' });

    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msg = generateMiningMsgs({
        type: Type.WITHDRAW_LIQUIDITY_MINING,
        sender: address,
        lpAddress: poolDetailData.info.liquidityAddr
      } as WithdrawLP);

      const result = await CosmJs.execute({
        address: msg.contractAddress,
        walletAddr: address,
        handleMsg: msg.msg,
        gasAmount: { denom: ORAI, amount: '0' },
        funds: msg.funds
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

  return { actionLoading, myStakes, pendingRewards, handleClaimReward };
};
