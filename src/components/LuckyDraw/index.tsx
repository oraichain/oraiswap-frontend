import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { isMobile } from '@walletconnect/browser-utils';
import LuckyDrawImg from 'assets/images/OraiDEX 2-YEAR-side.png';
import LuckyDrawImgMobile from 'assets/images/OraiDEX 2-YEAR.png';
import ModalCustom from 'components/ModalCustom';
import useConfigReducer from 'hooks/useConfigReducer';
import useWindowSize from 'hooks/useWindowSize';
import { FC, useEffect, useRef, useState } from 'react';
// import { LuckyWheel } from 'react-luck-draw';
import { LuckyWheel } from '@lucky-canvas/react';
import { DATA_LUCKY_DRAW, LUCKY_DRAW_CONTRACT, REWARD_MAP, SPIN_ID_KEY } from './constants';
import styles from './index.module.scss';
import { getDataLogByKey, useGetSpinResult, useLuckyDrawConfig } from './useLuckyDraw';

const LuckyDraw: FC<{}> = () => {
  const [address] = useConfigReducer('address');
  const [isOpen, setIsOpen] = useState(false);
  const [spinId, setSpinId] = useState(0);
  const myLuckyRef = useRef(null);
  const [item, setItem] = useState('');
  const [isStart, setIsStart] = useState(false);
  const [wheelSize, setWheelSize] = useState('500px');
  const [loaded, setLoaded] = useState(false);
  const mobileMode = isMobile();
  const { isSmallMobileView, windowSize } = useWindowSize();
  const [dataSource, setDataSource] = useState<any>(DATA_LUCKY_DRAW);

  const { spinConfig } = useLuckyDrawConfig();

  useEffect(() => {
    const { width = 500 } = windowSize || {};

    if (!width) {
      return;
    }

    setLoaded(false);
    const size = isSmallMobileView ? width - 20 : 500;

    if (size > 0) {
      setWheelSize(`${size}px`);
      setLoaded(true);
    }

    return () => setLoaded(false);
  }, [windowSize, isSmallMobileView]);

  const { spinResult } = useGetSpinResult({ id: spinId });

  console.log('spinId', spinId);

  useEffect(() => {
    if (spinId && spinResult?.result_time && myLuckyRef?.current) {
      const indexPrize = REWARD_MAP[spinResult?.reward];
      const randomItemIndex = (Math.random() * 2) >> 0;

      // console.log('indexPrize', {
      //   indexPrize,
      //   reward: spinResult?.reward as REWARD_ENUM,
      //   rew: indexPrize[randomItemIndex] ?? indexPrize[0]
      // });

      // console.log('randomItemIndex', randomItemIndex);
      myLuckyRef.current.stop(indexPrize?.[randomItemIndex] ?? indexPrize?.[0]);
    }
  }, [spinResult, spinId]);

  // useEffect(() => {
  //   if (isLoading) {
  //     setLoaded(false);
  //   }

  //   setLoaded(true);
  // }, [isLoading]);

  return (
    <>
      <div className={styles.btn} onClick={() => setIsOpen(true)}>
        <img src={mobileMode ? LuckyDrawImgMobile : LuckyDrawImg} alt="LuckyDrawImg" />
      </div>
      <ModalCustom
        title="Lucky Draw"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setItem('');
          setIsStart(false);
        }}
        className={styles.contentModal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.wheel}>
          <h2>
            {!isStart ? 'Let Spin...' : !item ? `Opps! You Loose... Try Again!` : `Congratulation! You Won: ${item}`}
          </h2>
          {loaded && (
            <LuckyWheel
              ref={myLuckyRef}
              width={wheelSize}
              height={wheelSize}
              blocks={dataSource.blocks}
              prizes={dataSource.prizes}
              buttons={dataSource.buttons}
              defaultStyle={dataSource.defaultStyle}
              onStart={async () => {
                setIsStart(false);
                setItem('');
                setSpinId(0);

                if (!myLuckyRef) return;
                // setTimeout(() => {
                // let indexPrize = (Math.random() * 14) >> 0;
                // while (indexPrize === 0 || indexPrize === 3 || indexPrize === 4) {
                //   indexPrize = (Math.random() * 14) >> 0;
                // }
                // }, timeDuration);

                try {
                  const { feeDenom, feeToken, fee } = spinConfig;

                  const sendResult = await window.client.execute(
                    address,
                    feeDenom,
                    {
                      send: {
                        contract: LUCKY_DRAW_CONTRACT,
                        amount: fee,
                        msg: toBinary({
                          spin: {}
                        })
                      }
                    },
                    'auto'
                  );

                  myLuckyRef?.current?.play();

                  const { logs = [] } = sendResult;

                  const { value: spinId } = getDataLogByKey(logs, SPIN_ID_KEY);

                  if (spinId) {
                    setSpinId(Number(spinId));
                  }
                } catch (error) {
                  console.log('error', error);
                }
              }}
              onEnd={(prize) => {
                console.log(prize);
                setIsStart(true);
                setItem(prize.title as string);
              }}
            />
          )}
        </div>
      </ModalCustom>
    </>
  );
};

export default LuckyDraw;
