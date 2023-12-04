import { ORAI } from '@oraichain/oraidex-common/build/constant';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import CosmJs from 'libs/cosmjs';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { useGetPoolDetail } from 'pages/Pools/hooks/useGetPoolDetail';
import { useGetRewardInfoDetail } from 'pages/Pools/hooks/useGetRewardInfo';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Type, generateMiningMsgs } from 'rest/api';
import { PoolModalProps } from 'types/pool';

export const useUnstakeLP = ({ onLiquidityChange, lpPrice }: Pick<PoolModalProps, 'lpPrice' | 'onLiquidityChange'>) => {
  const { poolUrl } = useParams();
  const [address] = useConfigReducer('address');

  const [actionLoading, setActionLoading] = useState(false);
  const [unbondAmount, setUnbondAmount] = useState<bigint | null>(null);
  const [unbondAmountInUsdt, setUnBondAmountInUsdt] = useState(0);

  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { info: pairInfoData } = poolDetail;
  const { lpTokenInfoData } = useGetPairInfo(poolDetail);

  const { totalRewardInfoData, refetchRewardInfo } = useGetRewardInfoDetail({
    stakerAddr: address,
    poolInfo: poolDetail.info
  });

  const totalBondAmount =
    totalRewardInfoData && totalRewardInfoData.reward_infos[0]
      ? BigInt(totalRewardInfoData.reward_infos[0].bond_amount || '0')
      : BigInt(0);

  // handle update unbond amount in usdt
  useEffect(() => {
    if (!totalBondAmount) return;
    const unbondAmountInUsdt = Number(unbondAmount) * Number(lpPrice);
    setUnBondAmountInUsdt(unbondAmountInUsdt);
  }, [unbondAmount, totalBondAmount, lpPrice]);

  const onUnbonedSuccess = () => {
    onLiquidityChange();
    refetchRewardInfo();
  };

  const handleUnbond = async (parsedAmount: bigint) => {
    if (!poolDetail || !poolDetail.info)
      return displayToast(TToastType.TX_FAILED, { message: 'Pool information does not exist' });

    const oraiAddress = await handleCheckAddress('Oraichain');

    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msg = generateMiningMsgs({
        type: Type.UNBOND_LIQUIDITY,
        sender: oraiAddress,
        amount: parsedAmount.toString(),
        lpAddress: poolDetail.info.liquidityAddr
      });

      const result = await CosmJs.execute({
        address: msg.contractAddress,
        walletAddr: oraiAddress,
        handleMsg: msg.msg,
        gasAmount: { denom: ORAI, amount: '0' },
        funds: msg.funds
      });
      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        onUnbonedSuccess();
      }
    } catch (error) {
      console.log('error in unbond: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    totalBondAmount,
    pairInfoData,
    lpTokenInfoData,
    unbondAmountInUsdt,
    unbondAmount,
    setUnbondAmount,
    handleUnbond
  };
};
