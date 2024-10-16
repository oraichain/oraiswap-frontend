import { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-fill-ic.svg';
import { useDispatch } from 'react-redux';
import { fetchPool, poolDetailV3Slice, setPoolId } from 'reducer/poolDetailV3';
import usePoolDetailV3Reducer from 'hooks/usePoolDetailV3Reducer';
import useAddLiquidityNew from 'pages/Pool-V3/hooks/useAddLiquidityNew';
import HistoricalChartDataWrapper from '../HistoricalChartDataWrapper';
import LiquidityChartWrapper from '../LiquidityChartWrapper';
import PriceDetail from '../PriceDetail';
import classNames from 'classnames';

interface CreatePositionFormProps {
  poolId: string;
  slippage: number;
  showModal: boolean;
  onCloseModal: () => void;
}

const CreatePositionFormNew: FC<CreatePositionFormProps> = ({ poolId, slippage, showModal, onCloseModal }) => {
  const [toggleZap, setToggleZap] = useState(false);
  const {
    tokenX,
    tokenY,
    historicalChartData,
    fullRange,
    xRange,
    yRange,
    currentPrice,
    liquidityChartData,
    hoverPrice,
    minPrice,
    maxPrice,
    isXToY,
    setHoverPrice,
    changeHistoricalRange,
    zoomIn,
    zoomOut,
    resetRange,
    setMinPrice,
    setMaxPrice,
    flipToken
  } = useAddLiquidityNew(poolId);
  // console.log({minPrice, maxPrice})

  return (
    <div className={styles.createPositionForm}>
      <div className={styles.tab}>
        <div className={styles.header}>
          <p>Price range</p>
          <button onClick={flipToken}>Swap token X/Y</button>
        </div>

        <div className={styles.alert}>
          <div>
            <WarningIcon />
          </div>
          <span>
            Your position will not earn fees or be used in trades until the market price moves into your range.
          </span>
        </div>

        <div className={styles.actionWrapper}>
          <button className={styles.five} onClick={() => console.log('5%')}>
            5%
          </button>
          <button className={styles.twenty} onClick={() => console.log('20%')}>
            20%
          </button>
          <button className={styles.fifty} onClick={() => console.log('50%')}>
            50%
          </button>
          <button className={styles.full} onClick={() => console.log('100%')}>
            100%
          </button>
        </div>

        <div className={styles.wrapChart}>
          {historicalChartData && yRange ? (
            <HistoricalChartDataWrapper
              hoverPrice={hoverPrice}
              tokenX={tokenX}
              tokenY={tokenY}
              historicalChartData={historicalChartData}
              fullRange={fullRange}
              yRange={yRange}
              addRange={[minPrice, maxPrice]}
              currentPrice={currentPrice}
              isXToY={isXToY}
              setHoverPrice={setHoverPrice}
              setHistoricalRange={changeHistoricalRange}
            />
          ) : (
            <span>Loading</span>
          )}

          {liquidityChartData && yRange && xRange ? (
            <LiquidityChartWrapper
              minPrice={minPrice}
              maxPrice={maxPrice}
              yRange={yRange}
              xRange={xRange}
              liquidityChartData={liquidityChartData}
              currentPrice={currentPrice}
              fullRange={fullRange}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetRange={resetRange}
            />
          ) : (
            <span>Loading</span>
          )}
        </div>

        {minPrice && maxPrice && currentPrice && tokenX && tokenY ? (
          <PriceDetail
            leftInput={minPrice}
            rightInput={maxPrice}
            currentPrice={currentPrice}
            tokenX={tokenX}
            tokenY={tokenY}
          />
        ) : (
          <span>Loading...</span>
        )}
      </div>

      <div className={styles.tab}>
        <div className={styles.menuWrapper}>
          <button
            className={classNames(styles.btnOption, { [styles.activeBtn]: toggleZap })}
            onClick={() => setToggleZap(true)}
          >
            Zap In
            <span>NEW</span>
          </button>
          <button
            className={classNames(styles.btnOption, { [styles.activeBtn]: !toggleZap })}
            onClick={() => setToggleZap(false)}
          >
            Manual Deposit
          </button>
        </div>

        {toggleZap ? <div className={styles.zapWrapper}></div> : <div className={styles.manuallyWrapper}></div>}

        <div className={styles.btn}></div>
      </div>
    </div>
  );
};

export default CreatePositionFormNew;
