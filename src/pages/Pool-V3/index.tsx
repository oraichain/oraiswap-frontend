import React, { IframeHTMLAttributes, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { useDispatchEvent } from './hooks/useAddCustomEvent';

const PoolV3 = () => {
  const ref = useRef<any>();
  // useDispatchEvent('connectWallet', window.Keplr);

  // useEffect(() => {
  //   console.log('ref.current', ref.current);
  //   if (ref?.current) {
  //     ref.current.postMessage('Hello, window-2! i am window-1', '*');
  //   }
  // }, [ref.current]);

  return (
    <div className={styles.poolV3}>
      <iframe ref={ref} src="http://localhost:3001/pool" title="pool-v3" frameBorder={0} />
    </div>
  );
};

export default PoolV3;
