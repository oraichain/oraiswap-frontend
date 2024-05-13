import { PAIRS_CHART } from 'config/pools';
import { useEffect, useState } from 'react';

const checkIsPairOfPool = ({ fromName, toName }: { fromName: string; toName: string }) => {
  const check = PAIRS_CHART.find((p) => {
    const symbols = p.symbols.map((symbol) => symbol.toUpperCase());
    return symbols.includes(fromName) && symbols.includes(toName);
  });

  return !!check;
};

export const useSwapFee = ({ fromToken, toToken }) => {
  const [fee, setFee] = useState(0);

  const SWAP_FEE_PER_ROUTE = 0.003;

  const isDependOnNetwork = fromToken.chainId !== 'Oraichain' || toToken.chainId !== 'Oraichain';

  useEffect(() => {
    if (!fromToken || !toToken) return;

    const { denom: fromDenom, name: fromName = '', chainId: fromChainId } = fromToken;
    const { denom: toDenom, name: toName = '', chainId: toChainId } = toToken;

    // case: same chainId as evm, or bnb => swap fee = 0
    // case: same Token Name and !== chainId => bridge token => swap fee = 0

    if (fromChainId === 'Oraichain' && toChainId === 'Oraichain') {
      if (checkIsPairOfPool({ fromName: fromName.toUpperCase(), toName: toName.toUpperCase() })) {
        setFee(SWAP_FEE_PER_ROUTE);
        return;
      }

      setFee(() => SWAP_FEE_PER_ROUTE * 2);
      return;
    }

    // swap to oraichain and bridge
    if (
      fromChainId !== toChainId &&
      toName !== fromName &&
      (fromChainId === 'Oraichain' || toChainId === 'Oraichain')
    ) {
      setFee(() => SWAP_FEE_PER_ROUTE);
      return;
    }
  }, [fromToken, toToken]);

  return { fee, isDependOnNetwork };
};
