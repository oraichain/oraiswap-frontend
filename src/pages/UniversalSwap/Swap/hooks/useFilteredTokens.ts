import { SwapDirection, UniversalSwapHelper } from '@oraichain/oraidex-universal-swap';
import { useEffect, useState } from 'react';
import { TokenItemType } from '@oraichain/oraidex-common';

const useFilteredTokens = (
  originalFromToken: TokenItemType,
  originalToToken: TokenItemType,
  searchTokenName: string,
  fromTokenDenomSwap: string,
  toTokenDenomSwap: string
) => {
  const [filteredToTokens, setFilteredToTokens] = useState<TokenItemType[]>([]);
  const [filteredFromTokens, setFilteredFromTokens] = useState<TokenItemType[]>([]);

  useEffect(() => {
    const filteredToTokens = UniversalSwapHelper.filterNonPoolEvmTokens(
      originalFromToken.chainId,
      originalFromToken.coinGeckoId,
      originalFromToken.denom,
      searchTokenName,
      SwapDirection.To
    );
    setFilteredToTokens(filteredToTokens);

    const filteredFromTokens = UniversalSwapHelper.filterNonPoolEvmTokens(
      originalToToken.chainId,
      originalToToken.coinGeckoId,
      originalToToken.denom,
      searchTokenName,
      SwapDirection.From
    );
    setFilteredFromTokens(filteredFromTokens);
  }, [originalFromToken, originalToToken, searchTokenName, toTokenDenomSwap, fromTokenDenomSwap]);

  return { filteredToTokens, filteredFromTokens };
};

export default useFilteredTokens;
