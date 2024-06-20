import React from 'react';
import styles from './index.module.scss';
import { useDispatchEvent } from './hooks/useAddCustomEvent';

const PoolV3 = () => {
  useDispatchEvent('connectWallet', window.Keplr);

  return (
    <div className={styles.poolV3}>
      <iframe src="http://localhost:3001/pool" title="pool-v3" frameBorder={0} />
    </div>
  );
};

export default PoolV3;
