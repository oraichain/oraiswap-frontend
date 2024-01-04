import { isMobile } from '@walletconnect/browser-utils';
import Bidding from './components/Bidding';
import BiddingChart from './components/BiddingChart';
import BiddingHistory from './components/BiddingHistory';
import HarvestInfo from './components/HarvestInfo';
import { useCountdown } from './hooks/useCountdown';
import styles from './index.module.scss';

const CoHarvest = () => {
  const mobileMode = isMobile();
  const { timeRemaining, percent, isEnd } = useCountdown();

  return (
    <div className={styles.container}>
      {!mobileMode ? (
        <div className={styles.auction}>
          <div className={styles.top}>
            <div className={styles.bid}>
              <Bidding isEnd={isEnd} />
            </div>
            <div className={styles.info}>
              <HarvestInfo timeRemaining={timeRemaining} percent={percent} isEnd={isEnd} />
              <BiddingChart />
            </div>
          </div>
          <BiddingHistory />
        </div>
      ) : (
        <div className={styles.auction}>
          <HarvestInfo timeRemaining={timeRemaining} percent={percent} isEnd={isEnd} />
          <Bidding isEnd={isEnd} />
          <BiddingChart />
          <BiddingHistory />
        </div>
      )}
    </div>
  );
};

export default CoHarvest;
