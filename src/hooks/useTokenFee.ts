import {
  NetworkChainId,
  TokenItemType,
  network,
  oraichainTokens,
  toDisplay,
  toAmount,
  BigDecimal,
  ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_DENOM_PREFIX
} from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { handleSimulateSwap, isEvmNetworkNativeSwapSupported } from '@oraichain/oraidex-universal-swap';
import { useQuery } from '@tanstack/react-query';
import { EVM_CHAIN_ID } from 'helper';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFeeConfig } from 'reducer/token';
import { fetchFeeConfig } from 'rest/api';
import { RootState } from 'store/configure';

export default function useTokenFee(
  remoteTokenDenom: string,
  fromChainId?: NetworkChainId,
  toChainId?: NetworkChainId
) {
  const [bridgeFee, setBridgeFee] = useState(0);
  const feeConfig = useSelector((state: RootState) => state.token.feeConfigs);

  useEffect(() => {
    let fee = 0;
    if (!remoteTokenDenom || !feeConfig) return;

    // since we have supported evm swap, tokens that are on the same supported evm chain id
    // don't have any token fees (because they are not bridged to Oraichain)
    if (isEvmNetworkNativeSwapSupported(fromChainId) && fromChainId === toChainId) return;

    const { token_fees: tokenFees } = feeConfig;
    const isNativeEth = remoteTokenDenom === 'eth';
    const isNativeBnb = remoteTokenDenom === 'bnb';
    const tokenFee = tokenFees.find(
      (tokenFee) =>
        tokenFee.token_denom === remoteTokenDenom ||
        // TODO
        (isNativeEth && tokenFee.token_denom.includes(ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX)) ||
        (isNativeBnb && tokenFee.token_denom.includes(ORAI_BRIDGE_EVM_DENOM_PREFIX))
    );
    if (tokenFee) fee = (tokenFee.ratio.nominator / tokenFee.ratio.denominator) * 100;

    setBridgeFee(fee);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeConfig, remoteTokenDenom]);
  return bridgeFee;
}

export const useRelayerFeeToken = (originalFromToken: TokenItemType, originalToToken: TokenItemType) => {
  const [relayerFeeInOrai, setRelayerFeeInOrai] = useState(0);
  const [relayerFee, setRelayerFeeAmount] = useState(0);
  const feeConfig = useSelector((state: RootState) => state.token.feeConfigs);

  const { data: relayerFeeAmount } = useQuery(
    ['simulate-relayer-data', originalFromToken, originalToToken, relayerFeeInOrai],
    () => {
      const routerClient = new OraiswapRouterQueryClient(window.client, network.router);
      const oraiToken = oraichainTokens.find((token) => token.coinGeckoId === 'oraichain-token');
      return handleSimulateSwap({
        originalFromInfo: oraiToken,
        originalToInfo: originalToToken,
        originalAmount: relayerFeeInOrai,
        routerClient
      });
    },
    {
      enabled: !!originalFromToken && !!originalToToken && relayerFeeInOrai > 0
    }
  );

  // get relayer fee in token, by simulate orai vs to token.
  useEffect(() => {
    if (relayerFeeAmount) setRelayerFeeAmount(new BigDecimal(relayerFeeAmount?.displayAmount || 0).toNumber());
  }, [relayerFeeAmount]);

  // get relayer fee in ORAI
  useEffect(() => {
    if (!originalFromToken || !originalToToken || !feeConfig) return;
    if (
      isEvmNetworkNativeSwapSupported(originalFromToken.chainId) &&
      originalFromToken.chainId === originalToToken.chainId
    ) {
      setRelayerFeeAmount(0);
      setRelayerFeeInOrai(0);
      return;
    }
    const { relayer_fees: relayerFees } = feeConfig;
    const relayerFeeInOrai = relayerFees.reduce((acc, cur) => {
      const isFromToPrefix = cur.prefix === originalFromToken.prefix || cur.prefix === originalToToken.prefix;
      if (isFromToPrefix) return +cur.amount + acc;
      return acc;
    }, 0);
    if (!relayerFeeInOrai) {
      setRelayerFeeAmount(0);
      setRelayerFeeInOrai(0);
      return;
    }
    setRelayerFeeInOrai(toDisplay(relayerFeeInOrai.toString()));
  }, [feeConfig, originalFromToken, originalToToken]);

  return {
    relayerFee,
    relayerFeeInOraiToDisplay: relayerFeeInOrai,
    relayerFeeInOraiToAmount: toAmount(relayerFeeInOrai)
  };
};
export const useUsdtToBtc = (amount) => {
  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);
  const originalFromToken = oraichainTokens.find((token) => token.coinGeckoId === 'tether');
  const originalToToken = oraichainTokens.find((token) => token.coinGeckoId === 'bitcoin');
  const { data } = useQuery(
    ['convert-btc-to-usdt', originalFromToken, originalToToken],
    () => {
      return handleSimulateSwap({
        originalFromInfo: originalToToken,
        originalToInfo: originalFromToken,
        originalAmount: amount,
        routerClient
      });
    },
    {
      enabled: !!originalFromToken && !!originalToToken && !!amount,
      placeholderData: {
        displayAmount: 0,
        amount: '0'
      }
    }
  );
  return data;
};

export const useGetFeeConfig = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const queryRelayerFee = async () => {
      const feeConfig = await fetchFeeConfig();
      if (feeConfig) {
        dispatch(updateFeeConfig(feeConfig));
      }
    };

    queryRelayerFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
