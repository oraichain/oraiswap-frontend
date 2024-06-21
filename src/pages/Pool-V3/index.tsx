import { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss';
import { getWalletByNetworkFromStorage } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';

const PoolV3 = () => {
  const iframeRef = useRef(null);
  const [address] = useConfigReducer('address');

  useEffect(() => {
    const iframe = iframeRef.current;
    const handleLoad = () => {
      callFunctionInIframe();
    };

    if (iframe) iframe.addEventListener('load', handleLoad);
    return () => {
      if (iframe) iframe.removeEventListener('load', handleLoad);
    };
  }, [address]);

  const callFunctionInIframe = () => {
    const iframe = document.getElementById('iframe-v3');
    const walletType = getWalletByNetworkFromStorage();
    //@ts-ignore
    iframe.contentWindow.postMessage({ walletType: walletType?.cosmos, address }, '*');
  };

  return (
    <div className={styles.poolV3}>
      <iframe
        ref={iframeRef}
        // key={address}
        id={'iframe-v3'}
        src="http://localhost:3001/pool"
        title="pool-v3"
        frameBorder={0}
      />
    </div>
  );
};

export default PoolV3;
