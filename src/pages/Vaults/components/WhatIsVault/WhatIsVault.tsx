import { formatDisplayUsdt } from 'helper/format';
import { useTotalSharePerformance } from 'pages/Vaults/hooks';
// import { useGetTotalDeposit } from 'pages/Vaults/hooks/useGetTotalDeposit';
import styles from './WhatIsVault.module.scss';

export const TotalSharePerf = () => {
  const { totalTvlUsd } = useTotalSharePerformance();
  // const { totalDepositInUsd } = useGetTotalDeposit();
  return (
    <div className={styles.myTotalShare}>
      <h3>Total Share Performance</h3>
      <div className={styles.amountPerf}>
        <div className={styles.amount}>
          <div className={styles.amountText}>Total Value Locked (TVL)</div>
          <div className={styles.value}>
            <span>{formatDisplayUsdt(totalTvlUsd, 2, '$')}</span>
          </div>
        </div>
        {/* <div className={styles.amount}>
          <div className={styles.amountText}>Total Deposit</div>
          <div className={styles.value}>
            <span>{formatDisplayUsdt(totalDepositInUsd, 2, '$')}</span>
          </div>
        </div> */}
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
        <TotalSharePerf />
      </div>
      <div className={styles.shadow}></div>
    </div>
  );
};

export const WhatIsVaultMobile = () => {
  return (
    <div className={styles.whatIsVaultMobile}>
      <div className={styles.content}>
        <div className={styles.vaultLeft}>
          <h1 className={styles.heading}>What is the vault?</h1>
          <p className={styles.description}>
            OraiDEX empowers you to tap into automated trading and collect rewards through our smart contract vaults.
            Simply deposit your USDT to start earning.
          </p>
        </div>
      </div>
      <TotalSharePerf />
    </div>
  );
};
