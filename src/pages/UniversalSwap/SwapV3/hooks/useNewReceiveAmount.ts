import { BigDecimal, getTokenOnOraichain, isInPairList, network, toAmount } from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { simulateSwap } from '@oraichain/oraidex-universal-swap';
import { useEffect, useState } from 'react';

type NewReceiveAmount = {
  relayerFeeToken;
  toTokenFee;
  fromTokenFee;
  minimumReceive;
  originalToToken;
  originalFromToken;
  fromAmountTokenBalance;
  simulateData;
};
export const useNewReceiveAmount = ({
  relayerFeeToken,
  toTokenFee,
  fromTokenFee,
  minimumReceive,
  originalToToken,
  originalFromToken,
  fromAmountTokenBalance,
  simulateData
}: NewReceiveAmount) => {
  const [newReceiveAmount, setNewReceiveAmount] = useState('0');
  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);

  const caculateNewReceive = async () => {
    try {
      if (!Number(relayerFeeToken) && !Number(toTokenFee) && !Number(fromTokenFee))
        return setNewReceiveAmount(minimumReceive);
      if (originalFromToken.coinGeckoId === 'oraichain-token' && originalToToken.coinGeckoId === 'oraichain-token') {
        setNewReceiveAmount(
          new BigDecimal(minimumReceive)
            .add(`-${relayerFeeToken}`)
            .add(`-${new BigDecimal(fromAmountTokenBalance).mul(toTokenFee).div(100).toString()}`)
            .add(`-${new BigDecimal(fromAmountTokenBalance).mul(fromTokenFee).div(100).toString()}`)
            .toString()
        );
        return;
      }
      if (isInPairList(originalToToken.denom) || isInPairList(originalToToken.contractAddress)) {
        const oraiToken = getTokenOnOraichain('oraichain-token');
        const { amount } = await simulateSwap({
          fromInfo: originalToToken,
          toInfo: oraiToken,
          amount: toAmount(relayerFeeToken, originalToToken.decimals).toString(),
          routerClient: routerClient
        });
        setNewReceiveAmount(
          new BigDecimal(minimumReceive)
            .add(`-${amount}`)
            .add(`-${new BigDecimal(fromAmountTokenBalance).mul(toTokenFee).div(100).toString()}`)
            .add(`-${new BigDecimal(fromAmountTokenBalance).mul(fromTokenFee).div(100).toString()}`)
            .toString()
        );
        return;
      }
      setNewReceiveAmount(minimumReceive);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (fromAmountTokenBalance || simulateData) {
      caculateNewReceive();
    }
    if (!fromAmountTokenBalance) {
      setNewReceiveAmount('0');
    }
  }, [simulateData, originalFromToken, originalToToken]);

  return Number(newReceiveAmount).toFixed(0);
};
