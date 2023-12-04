import { ORAI } from '@oraichain/oraidex-common/build/constant';
import { buildMultipleExecuteMessages, getSubAmountDetails, toAmount } from '@oraichain/oraidex-common/build/helper';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import CosmJs from 'libs/cosmjs';
import { getUsd, toSumDisplay } from 'libs/utils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ProvideQuery,
  Type,
  generateContractMessages,
  generateConvertErc20Cw20Message,
  generateMiningMsgs
} from 'rest/api';
import { RootState } from 'store/configure';
import { estimateShare } from '../helpers';
import { useGetPairInfo } from './useGetPairInfo';
import { useGetPoolDetail } from './useGetPoolDetail';
import { useTokenAllowance } from './useTokenAllowance';
import { PoolModalProps } from 'types/pool';

export const useAddLiquidity = ({
  pairDenoms,
  onLiquidityChange
}: Pick<PoolModalProps, 'pairDenoms' | 'onLiquidityChange'>) => {
  const { data: prices } = useCoinGeckoPrices();

  const poolDetail = useGetPoolDetail({ pairDenoms });
  const { token1, token2, info: pairInfoData } = poolDetail;
  const { lpTokenInfoData, pairAmountInfoData } = useGetPairInfo(poolDetail);

  const [baseAmount, setBaseAmount] = useState<bigint | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<bigint | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionAllLoading, setActionAllLoading] = useState(false);
  const [recentInput, setRecentInput] = useState(1);
  const [estimatedShare, setEstimatedShare] = useState(0);
  const totalBaseAmount = BigInt(pairAmountInfoData?.token1Amount ?? 0);
  const totalQuoteAmount = BigInt(pairAmountInfoData?.token2Amount ?? 0);

  const amounts = useSelector((state: RootState) => state.token.amounts);

  let token1Balance = BigInt(amounts[token1?.denom] ?? '0');
  let token2Balance = BigInt(amounts[token2?.denom] ?? '0');
  let subAmounts: AmountDetails;
  if (token1.contractAddress && token1.evmDenoms) {
    subAmounts = getSubAmountDetails(amounts, token1);
    const subAmount = toAmount(toSumDisplay(subAmounts), token1.decimals);
    token1Balance += subAmount;
  }

  if (token2.contractAddress && token2.evmDenoms) {
    subAmounts = getSubAmountDetails(amounts, token2);
    const subAmount = toAmount(toSumDisplay(subAmounts), token2.decimals);
    token2Balance += subAmount;
  }

  // fetch token allowance
  const {
    data: token1AllowanceToPair,
    isLoading: isToken1AllowanceToPairLoading,
    refetch: refetchToken1Allowance
  } = useTokenAllowance(pairInfoData?.pairAddr, token1);

  const {
    data: token2AllowanceToPair,
    isLoading: isToken2AllowanceToPairLoading,
    refetch: refetchToken2Allowance
  } = useTokenAllowance(pairInfoData?.pairAddr, token2);

  useEffect(() => {
    if (baseAmount === 0n || quoteAmount === 0n) return;

    const share = estimateShare({
      baseAmount: Number(baseAmount),
      quoteAmount: Number(quoteAmount),
      totalShare: Number(lpTokenInfoData?.total_supply),
      totalBaseAmount: Number(totalBaseAmount),
      totalQuoteAmount: Number(totalQuoteAmount)
    });
    setEstimatedShare(Math.trunc(share));
  }, [baseAmount, quoteAmount, lpTokenInfoData, totalBaseAmount, totalQuoteAmount]);

  useEffect(() => {
    if (recentInput === 1 && baseAmount > BigInt(0)) {
      setQuoteAmount((baseAmount * totalQuoteAmount) / totalBaseAmount);
    } else if (recentInput === 2 && quoteAmount > BigInt(0))
      setBaseAmount((quoteAmount * totalBaseAmount) / totalQuoteAmount);
  }, [pairAmountInfoData]);

  const onChangeAmount1 = (value: bigint) => {
    setRecentInput(1);
    setBaseAmount(value);
    if (totalBaseAmount > 0) setQuoteAmount((value * totalQuoteAmount) / totalBaseAmount);
  };

  const onChangeAmount2 = (value: bigint) => {
    setRecentInput(2);
    setQuoteAmount(value);
    if (totalQuoteAmount > 0) setBaseAmount((value * totalBaseAmount) / totalQuoteAmount);
  };

  const increaseAllowance = async (amount: string, token: string, walletAddr: string) => {
    const msg = generateContractMessages({
      type: Type.INCREASE_ALLOWANCE,
      amount,
      sender: walletAddr,
      spender: pairInfoData.pairAddr,
      token
    });

    const result = await CosmJs.execute({
      address: msg.contractAddress,
      walletAddr,
      handleMsg: msg.msg,
      gasAmount: { denom: ORAI, amount: '0' },
      funds: msg.funds
    });
    console.log('result increase allowance tx hash: ', result);

    if (result) {
      console.log('in correct result');
      displayToast(TToastType.TX_SUCCESSFUL, {
        customLink: `${network.explorer}/txs/${result.transactionHash}`
      });
    }
  };

  const handleAddLiquidity = async (amount1: bigint, amount2: bigint) => {
    if (!pairInfoData) return;
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);

    try {
      const oraiAddress = await handleCheckAddress('Oraichain');

      if (token1AllowanceToPair < amount1) {
        await increaseAllowance('9'.repeat(30), token1!.contractAddress!, oraiAddress);
        refetchToken1Allowance();
      }
      if (token2AllowanceToPair < amount2) {
        await increaseAllowance('9'.repeat(30), token2!.contractAddress!, oraiAddress);
        refetchToken2Allowance();
      }

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const firstTokenConverts = generateConvertErc20Cw20Message(amounts, token1, oraiAddress);
      const secTokenConverts = generateConvertErc20Cw20Message(amounts, token2, oraiAddress);

      const msg = generateContractMessages({
        type: Type.PROVIDE,
        sender: oraiAddress,
        fromInfo: token1!,
        toInfo: token2!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: pairInfoData.pairAddr
        // slippage: (userSlippage / 100).toString() // TODO: enable this again and fix in the case where the pool is empty
      } as ProvideQuery);

      const messages = buildMultipleExecuteMessages(msg, ...firstTokenConverts, ...secTokenConverts);

      const result = await CosmJs.executeMultiple({
        msgs: messages,
        walletAddr: oraiAddress,
        gasAmount: { denom: ORAI, amount: '0' }
      });
      console.log('result provide tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });

        const amountUsdt = Number(toAmount(getUsd(baseAmount, token1, prices) * 2));

        if (typeof onLiquidityChange == 'function') {
          onLiquidityChange(amountUsdt);
        }
      }
    } catch (error) {
      console.log('error in providing liquidity: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDepositAndStakeAll = async (amount1: bigint, amount2: bigint) => {
    if (!pairInfoData) return displayToast(TToastType.TX_FAILED, { message: 'Pool information does not exist' });

    setActionAllLoading(true);
    displayToast(TToastType.TX_BROADCASTING);

    try {
      const oraiAddress = await handleCheckAddress('Oraichain');

      if (token1AllowanceToPair < amount1) {
        await increaseAllowance('9'.repeat(30), token1!.contractAddress!, oraiAddress);
        refetchToken1Allowance();
      }
      if (token2AllowanceToPair < amount2) {
        await increaseAllowance('9'.repeat(30), token2!.contractAddress!, oraiAddress);
        refetchToken2Allowance();
      }

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const firstTokenConverts = generateConvertErc20Cw20Message(amounts, token1, oraiAddress);
      const secTokenConverts = generateConvertErc20Cw20Message(amounts, token2, oraiAddress);

      const msg = generateContractMessages({
        type: Type.PROVIDE,
        sender: oraiAddress,
        fromInfo: token1!,
        toInfo: token2!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: pairInfoData.pairAddr
        // slippage: (userSlippage / 100).toString() // TODO: enable this again and fix in the case where the pool is empty
      } as ProvideQuery);

      // generate staking msg
      const msgStake = generateMiningMsgs({
        type: Type.BOND_LIQUIDITY,
        sender: oraiAddress,
        amount: estimatedShare.toString(),
        lpAddress: pairInfoData.liquidityAddr
      });

      const messages = buildMultipleExecuteMessages(msg, ...firstTokenConverts, ...secTokenConverts);

      const result = await CosmJs.executeMultiple({
        msgs: [...messages, msgStake],
        walletAddr: oraiAddress,
        gasAmount: { denom: ORAI, amount: '0' }
      });
      console.log('result provide tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });

        const amountUsdt = Number(toAmount(getUsd(baseAmount, token1, prices) * 2));

        if (typeof onLiquidityChange == 'function') {
          onLiquidityChange(amountUsdt);
        }
      }
    } catch (error) {
      console.log('error in providing liquidity: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionAllLoading(false);
    }
  };

  return {
    token1,
    token2,
    baseAmount,
    quoteAmount,
    recentInput,
    actionAllLoading,
    actionLoading,
    isToken1AllowanceToPairLoading,
    isToken2AllowanceToPairLoading,
    token1Balance,
    token2Balance,
    lpTokenInfoData,
    pairInfoData,
    estimatedShare,
    toAmount,
    onChangeAmount1,
    onChangeAmount2,
    handleAddLiquidity,
    handleDepositAndStakeAll
  };
};
