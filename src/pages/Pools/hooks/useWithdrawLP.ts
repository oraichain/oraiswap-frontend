import { ORAI } from '@oraichain/oraidex-common/build/constant';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import CosmJs from 'libs/cosmjs';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { useGetPoolDetail } from 'pages/Pools/hooks/useGetPoolDetail';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Type, generateContractMessages } from 'rest/api';
import { RootState } from 'store/configure';
import { PoolModalProps } from 'types/pool';

export const useWithdrawLP = ({
  onLiquidityChange,
  myLpBalance,
  myLpUsdt
}: Pick<PoolModalProps, 'myLpBalance' | 'myLpUsdt' | 'onLiquidityChange'>) => {
  let { poolUrl } = useParams();
  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });

  const { token1, token2, info: pairInfoData } = poolDetail;
  const { lpTokenInfoData, pairAmountInfoData } = useGetPairInfo(poolDetail);
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const [lpAmountBurn, setLpAmountBurn] = useState<bigint | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const lpTokenBalance = BigInt(pairInfoData ? lpPools[pairInfoData?.liquidityAddr]?.balance ?? '0' : 0);
  const token1Amount = BigInt(pairAmountInfoData?.token1Amount || 0);
  const token2Amount = BigInt(pairAmountInfoData?.token2Amount || 0);

  const handleWithdrawLiquidity = async (amount: string) => {
    if (!pairInfoData) return;
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const oraiAddress = await handleCheckAddress('Oraichain');

      const msg = generateContractMessages({
        type: Type.WITHDRAW,
        sender: oraiAddress,
        lpAddr: lpTokenInfoData!.contractAddress!,
        amount,
        pair: pairInfoData.pairAddr
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
        setLpAmountBurn(0n);
        onLiquidityChange && onLiquidityChange(-lpAmountBurnUsdt);
      }
    } catch (error) {
      console.log('error in Withdraw Liquidity: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  const totalSupply = BigInt(lpTokenInfoData?.total_supply || 0);
  const lp1BurnAmount =
    totalSupply === BigInt(0) || !lpAmountBurn ? BigInt(0) : (token1Amount * BigInt(lpAmountBurn)) / totalSupply;
  const lp2BurnAmount =
    totalSupply === BigInt(0) || !lpAmountBurn ? BigInt(0) : (token2Amount * BigInt(lpAmountBurn)) / totalSupply;
  const lpAmountBurnUsdt = !myLpBalance ? 0 : (Number(lpAmountBurn) / Number(myLpBalance)) * Number(myLpUsdt);

  return {
    actionLoading,
    token1,
    token2,
    pairInfoData,
    lpTokenBalance,
    lpTokenInfoData,
    lp1BurnAmount,
    lp2BurnAmount,
    lpAmountBurnUsdt,
    lpAmountBurn,
    setLpAmountBurn,
    handleWithdrawLiquidity
  };
};
