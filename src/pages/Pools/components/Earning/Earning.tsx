import styles from './Earning.module.scss';
import { ReactComponent as DownIcon } from 'assets/icons/ic_down.svg';
import { Button } from 'components/Button';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as OraixLightIcon } from 'assets/icons/oraix_light.svg';
import { ReactComponent as OraixIcon } from 'assets/icons/oraix.svg';
import useTheme from 'hooks/useTheme';

export const Earning = () => {
  const theme = useTheme();
  return (
    <section className={styles.earning}>
      <div className={styles.earningLeft}>
        <div className={styles.assetEarning}>
          <div className={styles.title}>
            {theme === 'dark' ? (
              <OraiIcon style={{ width: 18, marginRight: 6 }} />
            ) : (
              <OraiLightIcon style={{ width: 18, marginRight: 6 }} />
            )}
            <span>ORAI Earning</span>
          </div>
          <div className={styles.amount}>$1.24</div>
          <div className={styles.amountOrai}>0.52 ORAI</div>
        </div>
        <div className={styles.assetEarning}>
          <div className={styles.title}>
            {theme === 'dark' ? (
              <OraixIcon style={{ width: 18, marginRight: 6 }} />
            ) : (
              <OraixLightIcon style={{ width: 18, marginRight: 6 }} />
            )}
            <span>ORAIX Earning</span>
          </div>
          <div className={styles.amount}>$1.24</div>
          <div className={styles.amountOrai}>0.52 ORAIX</div>
        </div>
      </div>

      <div className={styles.claim}>
        <Button type="primary" onClick={() => {}}>
          Claim Your Earned
        </Button>
        <div className={styles.earnMore}>
          <div>
            Add more liquidity to earn more <DownIcon className={styles.downIcon} />
          </div>
        </div>
      </div>
    </section>
  );
};
