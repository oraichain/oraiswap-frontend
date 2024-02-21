import { isMobile } from '@walletconnect/browser-utils';
import Bidding from './components/Bidding';
import BiddingChart from './components/BiddingChart';
import BiddingHistory from './components/BiddingHistory';
import HarvestInfo from './components/HarvestInfo';
import { useGetBidding, useGetRound } from './hooks/useGetBidRound';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import ExplainReturnModal from './components/ExplainReturnModal';

const CoHarvest = () => {
  const mobileMode = isMobile();
  const currentActiveRound = useGetRound();
  const [selectedRound, setSelectedRound] = useState(currentActiveRound);
  const { biddingInfo } = useGetBidding(selectedRound);
  const isCurrentRound = selectedRound === currentActiveRound;

  const poolValue = biddingInfo.distribution_info.total_distribution;

  const [isStarted, setIsStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentActiveRound && !selectedRound && currentActiveRound !== selectedRound) {
      setSelectedRound(currentActiveRound);
    }
  }, [currentActiveRound]);

  console.log('currentActiveRound', currentActiveRound);
  const onStart = () => {
    setIsStarted(true);
  };

  const onEnd = () => {
    setIsEnd(true);
  };

  return (
    <div className={styles.container}>
      <ExplainReturnModal open={isOpen} onClose={() => setIsOpen(false)} />

      {!mobileMode ? (
        <div className={styles.auction}>
          <div className={styles.top}>
            <div className={styles.bid}>
              <Bidding
                openExplainModal={() => setIsOpen(true)}
                round={selectedRound}
                isEnd={isEnd}
                isStarted={isStarted}
                isCurrentRound={isCurrentRound}
                backToCurrentRound={() => setSelectedRound(currentActiveRound)}
              />
            </div>
            <div className={styles.info}>
              <HarvestInfo
                openExplainModal={() => setIsOpen(true)}
                poolValue={poolValue}
                bidInfo={biddingInfo.bid_info}
                onEnd={onEnd}
                onStart={onStart}
                isCurrentRound={isCurrentRound}
              />
              <BiddingChart bidInfo={biddingInfo.bid_info} round={selectedRound} />
            </div>
          </div>
          <BiddingHistory round={currentActiveRound} filterRound={selectedRound} setFilterRound={setSelectedRound} />
        </div>
      ) : (
        <div className={styles.auction}>
          <HarvestInfo
            openExplainModal={() => setIsOpen(true)}
            poolValue={poolValue}
            bidInfo={biddingInfo.bid_info}
            onEnd={onEnd}
            onStart={onStart}
            isCurrentRound={isCurrentRound}
          />
          <Bidding
            openExplainModal={() => setIsOpen(true)}
            round={selectedRound}
            isEnd={isEnd}
            isStarted={isStarted}
            isCurrentRound={isCurrentRound}
            backToCurrentRound={() => setSelectedRound(currentActiveRound)}
          />
          <BiddingChart bidInfo={biddingInfo.bid_info} round={selectedRound} />
          <BiddingHistory round={currentActiveRound} filterRound={selectedRound} setFilterRound={setSelectedRound} />
        </div>
      )}
    </div>
  );
};

export default CoHarvest;
