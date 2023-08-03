import { getTransferTokenFee } from 'pages/UniversalSwap/helpers';
import { useEffect, useState } from 'react';

export default function useTokenFee(remoteTokenDenom) {
  const [tokenFee, setTokenFee] = useState<number>(0);

  useEffect(() => {
    (async () => {
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
