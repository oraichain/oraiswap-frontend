import { NetworkChainId } from '@oraichain/oraidex-common';
import { isEvmNetworkNativeSwapSupported } from '@oraichain/oraidex-universal-swap';
import { getTransferTokenFee } from 'pages/UniversalSwap/helpers';
import { useEffect, useState } from 'react';

export default function useTokenFee(
  remoteTokenDenom: string,
  fromChainId?: NetworkChainId,
  toChainId?: NetworkChainId
) {
  const [tokenFee, setTokenFee] = useState(0);

  useEffect(() => {
    const getTokenFee = async () => {
      let tokenFee = 0;
      const ratio = await getTransferTokenFee({ remoteTokenDenom });
      if (ratio) {
        tokenFee = (ratio.nominator / ratio.denominator) * 100;
      }
      setTokenFee(tokenFee);
    };

    if (!remoteTokenDenom) return;
    // since we have supported evm swap, tokens that are on the same supported evm chain id don't have any token fees (because they are not bridged to Oraichain)
    if (isEvmNetworkNativeSwapSupported(fromChainId) && fromChainId === toChainId) return;
    getTokenFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteTokenDenom]);

  return tokenFee;
}
