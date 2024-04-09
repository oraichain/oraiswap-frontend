import styles from './WhatIsVault.module.scss';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';

export const MyTotalSharePerf = () => {
  return (
    <div className={styles.myTotalShare}>
      <h3>My Total Share Performance</h3>
      <div className={styles.amountPerf}>
        <div className={styles.amount}>
          <div className={styles.amountText}>Max Available to Withdraw</div>
          <div className={styles.value}>
            <span>140.6 USDT</span>
            <UsdtIcon width={24} height={24} />
          </div>
        </div>
        <div className={styles.amount}>
          <div className={styles.amountText}>Total Share Amount</div>
          <div className={styles.value}>
            <span>120 USDT</span>
            <UsdtIcon width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const WhatIsVault = () => {
  return (
    <div className={styles.whatIsVault}>
      <div className={styles.content}>
        <div className={styles.vaultLeft}>
          <h1 className={styles.heading}>What is the vault?</h1>
          <p className={styles.description}>
            OraiDEX empowers you to tap into automated trading and collect rewards through our smart contract vaults.
            Simply deposit your USDT to start earning.
          </p>
        </div>
        <MyTotalSharePerf />
      </div>
      <div className={styles.shadow}></div>
    </div>
  );
};
