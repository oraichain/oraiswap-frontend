import { tokenMap } from '@oraichain/oraidex-common';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const FROM_QUERY_KEY = 'from';
export const TO_QUERY_KEY = 'to';

// URL: /universalswap?from=orai&to=usdt
export const useFillToken = (setSwapTokens: (denoms: [string, string]) => void) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleUpdateQueryURL = ([fromDenom, toDenom]: [string, string]) => {
    const queryString = location.search;
    const path = location.pathname;

    if (!fromDenom || !toDenom) {
      return;
    }
    const params = new URLSearchParams(queryString || '');

    const currentFromDenom = params.get(FROM_QUERY_KEY);
    const currentToDenom = params.get(TO_QUERY_KEY);

    const originalFromToken = tokenMap[fromDenom];
    const originalToToken = tokenMap[toDenom];

    if (originalFromToken && originalToToken && (currentFromDenom !== fromDenom || currentToDenom !== toDenom)) {
      currentFromDenom !== fromDenom && params.set(FROM_QUERY_KEY, fromDenom);
      currentToDenom !== toDenom && params.set(TO_QUERY_KEY, toDenom);

      const newUrl = `${path}?${params.toString()}`;

      navigate(newUrl);
    }
  };

  useEffect(() => {
    const queryString = location.search;
    const params = new URLSearchParams(queryString || '');
    const fromDenom = params.get(FROM_QUERY_KEY);
    const toDenom = params.get(TO_QUERY_KEY);

    if (!queryString || !fromDenom || !toDenom) {
      return;
    }

    const originalFromToken = tokenMap[fromDenom];
    const originalToToken = tokenMap[toDenom];

    if (originalFromToken && originalToToken) {
      setSwapTokens([fromDenom, toDenom]);
    } else {
      navigate(location.pathname);
    }
  }, [location.search, location.pathname]);

  return {
    handleUpdateQueryURL
  };
};
