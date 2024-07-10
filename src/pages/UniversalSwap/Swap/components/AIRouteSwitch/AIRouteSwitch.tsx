import AiRouteLottie from 'assets/lottie/flicker-green.json';
import cn from 'classnames/bind';
import Lottie from 'lottie-react';
import styles from './AIRouteSwitch.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';
import { useState } from 'react';
import { sleep } from 'helper';
import Loader from 'components/Loader';

const cx = cn.bind(styles);

type Props = {
  isLoading: boolean;
};

export default function AIRouteSwitch({ isLoading }: Props) {
  const [isAIRoute, setIsAIRoute] = useConfigReducer('AIRoute');
  const [loadingTurnOnAiRoute, setLoadingTurnOnAiRoute] = useState(false);

  return (
    <>
      <div
        className={cx('ai-dot', isAIRoute ? 'ai-dot-active' : null)}
        onClick={async () => {
          setLoadingTurnOnAiRoute(true);
          await sleep(500);
          setIsAIRoute(!isAIRoute);
          setLoadingTurnOnAiRoute(false);
        }}
      >
        <span className={cx('ai-text')}>AI ROUTE</span>

        {isAIRoute ? (
          <>
            <div className={cx('dot-active')}>
              <Lottie animationData={AiRouteLottie} autoPlay={isAIRoute} loop={isAIRoute} />
            </div>
          </>
        ) : (
          <div className={cx('dot')}></div>
        )}
      </div>
      {(loadingTurnOnAiRoute || isLoading) && <Loader width={15} height={15} />}
    </>
  );
}
