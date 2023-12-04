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
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Type, generateMiningMsgs } from 'rest/api';
import { RootState } from 'store/configure';
import { PoolModalProps } from 'types/pool';

export const useStakeLP = ({
  myLpBalance,
  myLpUsdt,
  onLiquidityChange
}: Pick<PoolModalProps, 'myLpBalance' | 'myLpUsdt' | 'onLiquidityChange'>) => {
  let { poolUrl } = useParams();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const [address] = useConfigReducer('address');
  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { info: pairInfoData } = poolDetail;
  const { lpTokenInfoData } = useGetPairInfo(poolDetail);

  const { refetchRewardInfo } = useGetRewardInfoDetail({
    stakerAddr: address,
    poolInfo: poolDetail.info
  });
  const [bondAmount, setBondAmount] = useState<bigint | null>(null);
  const [bondAmountInUsdt, setBondAmountInUsdt] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const lpTokenBalance = BigInt(pairInfoData ? lpPools[pairInfoData?.liquidityAddr]?.balance || '0' : 0);

  // handle update bond amount in usdt
  useEffect(() => {
    if (!myLpBalance) return;
    const bondAmountInUsdt = (Number(bondAmount) / Number(myLpBalance)) * Number(myLpUsdt);
    setBondAmountInUsdt(bondAmountInUsdt);
  }, [bondAmount, myLpBalance, myLpUsdt]);

  const onBonedSuccess = () => {
    onLiquidityChange();
    refetchRewardInfo();
  };

  const handleBond = async (parsedAmount: bigint) => {
    if (!poolDetail || !poolDetail.info)
      return displayToast(TToastType.TX_FAILED, { message: 'Pool information does not exist' });

    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const oraiAddress = await handleCheckAddress('Oraichain');
      // generate bonding msg
      const msg = generateMiningMsgs({
        type: Type.BOND_LIQUIDITY,
        sender: oraiAddress,
        amount: parsedAmount.toString(),
        lpAddress: poolDetail.info.liquidityAddr
      });

      // execute msg
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
        onBonedSuccess();
      }
    } catch (error) {
      console.log('error in bond: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    lpTokenInfoData,
    lpTokenBalance,
    pairInfoData,
    bondAmountInUsdt,
    bondAmount,
    setBondAmount,
    handleBond
  };
};
