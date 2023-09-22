import styles from './OverviewPool.module.scss';
import { ReactComponent as AiriIcon } from 'assets/icons/airi.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as VolumeIcon } from 'assets/icons/ic_volume.svg';
import { ReactComponent as AprIcon } from 'assets/icons/ic_apr.svg';

export const OverviewPool = () => {
  return (
    <section className={styles.overview}>
      <div className={styles.totalLiquidity}>
        <h3 className={styles.title}>Total Liquidity</h3>
        <div className={styles.totalTop}>
          <div className={styles.pairLogos}>
            <AiriIcon className={styles.logo1} />
            <OraiIcon className={styles.logo2} />
          </div>
          <div className={styles.pairAmount}>
            <div className={styles.amountUsdt}>$12,435,6000</div>
            <div className={styles.amountLp}>98.28 LP</div>
          </div>
        </div>
        <div className={styles.amountToken}>
          <div className={styles.percent}>
            <span>ORAI: 50%</span>
            <div className={styles.bar}>
              <div className={styles.barActive}></div>
            </div>
            <span>ATOM: 50%</span>
          </div>
          <div className={styles.amount}>
            <span>274,996.5</span>
            <span>274,996.5</span>
          </div>
        </div>
      </div>
      <div className={styles.volume}>
        <div className={styles.icon}>
          <VolumeIcon />
        </div>
        <div className={styles.title}>Volume (24H)</div>
        <div className={styles.volumeAmount}>$735,195</div>
        <div className={styles.positivePercent}>+0.2%</div>
      </div>
      <div className={styles.apr}>
        <div className={styles.icon}>
          <AprIcon />
        </div>
        <div className={styles.title}>APR</div>
        <div className={styles.volumeAmount}>76.20%</div>
        {/* <div className={styles.positivePercent}>6.35%</div> */}
      </div>
    </section>
  );
};
