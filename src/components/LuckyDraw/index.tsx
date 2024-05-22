import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { LuckyWheel } from '@lucky-canvas/react';
import { ORAIX_CONTRACT, toDisplay } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import LuckyDrawImg from 'assets/images/OraiDEX 2-YEAR-side.png';
import LuckyDrawImgMobile from 'assets/images/OraiDEX 2-YEAR.png';
import ModalCustom from 'components/ModalCustom';
import useConfigReducer from 'hooks/useConfigReducer';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import useWindowSize from 'hooks/useWindowSize';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { DATA_LUCKY_DRAW, LUCKY_DRAW_CONTRACT, LUCKY_DRAW_FEE, MSG_TITLE, REWARD_MAP, SPIN_ID_KEY } from './constants';
import styles from './index.module.scss';
import { getDataLogByKey, useGetSpinResult, useLuckyDrawConfig } from './useLuckyDraw';
import { handleErrorTransaction } from 'helper';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import { network } from 'config/networks';
import classNames from 'classnames';
import Loader from 'components/Loader';

const LuckyDraw: FC<{}> = () => {
  const [address] = useConfigReducer('address');
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFee, setLoadingFee] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinId, setSpinId] = useState(0);
  const myLuckyRef = useRef(null);
  const [item, setItem] = useState('');
  const [isSuccessSpin, setIsSuccessSpin] = useState(false);
  const [wheelSize, setWheelSize] = useState('500px');
  const [loaded, setLoaded] = useState(false);
  const mobileMode = isMobile();
  const { isSmallMobileView, windowSize } = useWindowSize();
  const [dataSource, setDataSource] = useState<any>(DATA_LUCKY_DRAW);

  const amounts = useSelector((state: RootState) => state.token.amounts);
  const loadOraichainToken = useLoadOraichainTokens();
  const balance = amounts['oraix'];

  const { spinConfig } = useLuckyDrawConfig();
  const { fee = LUCKY_DRAW_FEE, feeDenom = ORAIX_CONTRACT, feeToken } = spinConfig || {};

  const insufficientFund = fee && Number(fee) > Number(balance);

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

  useEffect(() => {
    if (spinId && spinResult?.result_time && myLuckyRef?.current) {
      const indexPrize = REWARD_MAP[spinResult?.reward];
      const randomItemIndex = (Math.random() * 2) >> 0;
      myLuckyRef.current.stop(indexPrize?.[randomItemIndex] ?? indexPrize?.[0]);
    }
  }, [spinResult, spinId]);

  const onStart = async () => {
    setIsSuccessSpin(false);
    setItem('');
    setSpinId(0);
    setLoadingFee(true);
    setIsSpinning(true);

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
      handleErrorTransaction(error, {
        tokenName: 'ORAIX',
        chainName: network.chainId
      });
      setIsSpinning(false);
    } finally {
      setLoadingFee(false);
    }
  };

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
          setIsSuccessSpin(false);
        }}
        className={styles.contentModal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.wheel}>
          <div className={styles.info}>
            <span className={styles.detail}>
              Each spin only costs <strong>{toDisplay(fee || LUCKY_DRAW_FEE)}</strong> ORAIX
            </span>
            <span>
              Balance:{' '}
              <span className={styles.balance}>
                {toDisplay(balance)} {feeToken?.name || 'ORAIX'}
              </span>
            </span>
          </div>

          {loaded && (
            <div className={styles.spin}>
              <LuckyWheel
                ref={myLuckyRef}
                width={wheelSize}
                height={wheelSize}
                blocks={dataSource.blocks}
                prizes={dataSource.prizes}
                buttons={dataSource.buttons}
                defaultStyle={dataSource.defaultStyle}
                onStart={() => {
                  // onStart
                  console.log('Spin...');
                }}
                onEnd={(prize) => {
                  console.log(prize);
                  setIsSuccessSpin(true);
                  setIsSpinning(false);
                  setItem(prize.title as string);
                  loadOraichainToken(address, [feeDenom || ORAIX_CONTRACT]);
                }}
              />
              <button
                disabled={insufficientFund || loadingFee || isSpinning}
                // disabled
                className={styles.spinMask}
                onClick={onStart}
                title={insufficientFund ? 'Insufficient Fee!' : 'Spin the wheel to win!'}
              >
                <span className={styles.spinTxt}>
                  {loadingFee && <Loader width={16} height={16} />}
                  Spin
                </span>
                <span className={styles.token}>
                  {toDisplay(fee)} <OraiXLightIcon />
                </span>
              </button>
            </div>
          )}
          <span className={classNames(styles.result, { [styles.done]: isSuccessSpin })}>
            {!isSuccessSpin ? (
              'Ready to test your luck? Spin the wheel to win!'
            ) : (
              <span>
                <strong>{item}: &nbsp;</strong>
                {MSG_TITLE[item]}
              </span>
            )}
          </span>
        </div>
      </ModalCustom>
    </>
  );
};

export default LuckyDraw;
