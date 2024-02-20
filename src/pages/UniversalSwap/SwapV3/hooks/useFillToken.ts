import { tokenMap } from '@oraichain/oraidex-common';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const FROM_QUERY_KEY = 'from';
export const TO_QUERY_KEY = 'to';

// URL: /universalswap?from=orai&to=usdt
export const useFillToken = (setSwapTokens: (denoms: [string, string]) => void) => {
  const location = useLocation();

  const queryString = location.search;
  const params = new URLSearchParams(queryString || '');
  const fromDenom = params.get(FROM_QUERY_KEY);
  const toDenom = params.get(TO_QUERY_KEY);

  useEffect(() => {
    if (!location.search || !fromDenom || !toDenom) {
      return;
    }

    const originalFromToken = tokenMap[fromDenom];
    const originalToToken = tokenMap[toDenom];

    if (originalFromToken && originalToToken) {
      setSwapTokens([fromDenom, toDenom]);
    }
  }, [location.search, fromDenom, toDenom]);

  return {
    fromDenom,
    toDenom
  };
};
