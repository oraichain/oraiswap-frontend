import { NetworkChainId, TokenItemType, flattenTokens } from '@oraichain/oraidex-common';
import useTokenFee, { useRelayerFeeToken } from 'hooks/useTokenFee';

const getRemoteTokenDenom = (token: TokenItemType): string => {
  if (!token) return null;
  if (token.contractAddress) return token.prefix + token.contractAddress;
  return token.denom;
};

export const useVaultFee = (tokenDeposit: TokenItemType, vaultNetworkChainId: NetworkChainId) => {
  const tokenTo = flattenTokens.find(
    (t) => t.coinGeckoId === tokenDeposit.coinGeckoId && t.chainId === vaultNetworkChainId
  );
  const [remoteTokenDenomFrom, remoteTokenDenomTo] = [getRemoteTokenDenom(tokenDeposit), getRemoteTokenDenom(tokenTo)];

  const fromTokenFee = useTokenFee(remoteTokenDenomFrom);
  const toTokenFee = useTokenFee(remoteTokenDenomTo);
  const bridgeFee = fromTokenFee + toTokenFee;

  const { relayerFee } = useRelayerFeeToken(tokenDeposit, tokenTo);

  return {
    bridgeFee,
    relayerFee
  };
};
