import { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss';
import { getWalletByNetworkFromStorage } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { isMobile } from '@walletconnect/browser-utils';

export const postMessagePoolV3 = (
  statusWallet: 'connect' | 'disconnect',
  walletType?: string,
  address?: string,
  allowUrl?: string
) => {
  const iframe = document.getElementById('iframe-v3');
  //@ts-ignore
  iframe.contentWindow.postMessage({ walletType, address, statusWallet: statusWallet }, allowUrl ?? '*');
};

const PoolV3 = () => {
  const iframeRef = useRef(null);
  const [address] = useConfigReducer('address');

  const mobileMode = isMobile();

  useEffect(() => {
    if (mobileMode && window.top !== window.self) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://static.orai.io/injected-provider-merge.bundle.js';
      document.body.appendChild(script);
    }
  }, [mobileMode]);

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
    const walletType = getWalletByNetworkFromStorage();

    postMessagePoolV3(
      !walletType?.cosmos ? 'disconnect' : 'connect',
      isMobile() ? 'owallet' : walletType?.cosmos,
      address
    );
  };

  return (
    <div className={styles.poolV3}>
      <iframe
        ref={iframeRef}
        // key={address}
        id={'iframe-v3'}
        src="https://oraidex-amm-v3-staging.web.app"
        // src="http://localhost:3001/pool"
        // src="https://0726-222-252-31-239.ngrok-free.app"
        title="pool-v3"
        frameBorder={0}
      />
    </div>
  );
};

export default PoolV3;
