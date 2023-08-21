import { NetworkChainId } from 'config/chainInfos';
import { getTransferTokenFee } from 'pages/UniversalSwap/helpers';
import { useEffect, useState } from 'react';
import { isEvmNetworkNativeSwapSupported } from 'rest/api';

export default function useTokenFee(remoteTokenDenom: string, fromChainId: NetworkChainId, toChainId: NetworkChainId) {
  const [tokenFee, setTokenFee] = useState<number>(0);

  useEffect(() => {
    (async () => {
      // since we have supported evm swap, tokens that are on the same supported evm chain id don't have any token fees (because they are not bridged to Oraichain)
      if (isEvmNetworkNativeSwapSupported(fromChainId) && fromChainId === toChainId) return;
      if (remoteTokenDenom) {
        let tokenFee = 0;
        const ratio = await getTransferTokenFee({ remoteTokenDenom });
        if (ratio) {
          tokenFee = (ratio.nominator / ratio.denominator) * 100;
        }
        setTokenFee(tokenFee);
      }
    })();
  }, [remoteTokenDenom]);
  return tokenFee;
}
