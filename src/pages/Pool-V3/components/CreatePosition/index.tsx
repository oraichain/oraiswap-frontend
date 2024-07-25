import classNames from 'classnames';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { ReactComponent as Continuous } from 'assets/images/continuous.svg';
import { ReactComponent as Discrete } from 'assets/images/discrete.svg';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import useTheme from 'hooks/useTheme';
import PriceRangePlot from '../PriceRangePlot/PriceRangePlot';
import { useEffect, useState } from 'react';
import { calcPrice, calcTicksAmountInRange, spacingMultiplicityGte } from '../PriceRangePlot/utils';
import { TokenItemType, truncDecimals } from '@oraichain/oraidex-common';
import TokenForm from '../TokenForm';
// import { getMinTick } from 'pages/Pool-V3/packages/wasm/oraiswap_v3_wasm.js';

const args = {
  currentPrice: 10000,
  data: [
    {
      index: 1,
      x: 1,
      y: 1
    }
  ],
  initialIsDiscreteValue: false,
  leftRange: {
    index: 2,
    x: 10000
  },
  rightRange: {
    index: 2,
    x: 10000
  },
  max: 100,
  min: 0,
  midPrice: {
    x: 1,
    index: 1
  },
  onDiscreteChange: () => {},
  reloadHandler: () => {},
  ticksLoading: false,
  tickSpacing: 1,
  tokenX: {
    name: 'BTC',
    decimal: 9
  },
  tokenY: {
    name: 'ETH',
    decimal: 12
  },
  xToY: true,
  hasTicksError: false
};

const CreatePosition = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tokenFrom, setTokenFrom] = useState<TokenItemType>();
  const [tokenTo, setTokenTo] = useState<TokenItemType>();
  const [fee, setFee] = useState<number>(0.01);
  const [toAmount, setToAmount] = useState();
  const [fromAmount, setFromAmount] = useState();

  const [plotMin, setPlotMin] = useState(0);
  const [plotMax, setPlotMax] = useState(1);

  const [isPlotDiscrete, setIsPlotDiscrete] = useState(false);

  const currentPrice = 10000;
  const leftRange = {
    index: 2,
    x: 10000
  };
  const rightRange = {
    index: 2,
    x: 10000
  };
  const midPrice = {
    index: 2,
    x: 1020
  };
  const tokenX = {
    name: 'BTC',
    decimal: 9
  };
  const tokenY = {
    name: 'ETH',
    decimal: 12
  };

  useEffect(() => {
    // const initSideDist = Math.abs(
    //   leftRange.x -
    //     calcPrice(
    //       Math.max(
    //         spacingMultiplicityGte(Number(getMinTick(Number(args.tickSpacing))), Number(args.tickSpacing)),
    //         Number(leftRange.index) - Number(args.tickSpacing) * 15
    //       ),
    //       args.xToY,
    //       tokenX.decimal,
    //       tokenY.decimal
    //     )
    // );
    // setPlotMin(leftRange.x - initSideDist);
    // setPlotMax(rightRange.x + initSideDist);
  }, [args.ticksLoading, leftRange, rightRange]);

  const zoomMinus = () => {
    const diff = plotMax - plotMin;
    const newMin = plotMin - diff / 4;
    const newMax = plotMax + diff / 4;
    setPlotMin(newMin);
    setPlotMax(newMax);
  };

  const zoomPlus = () => {
    const diff = plotMax - plotMin;
    const newMin = plotMin + diff / 6;
    const newMax = plotMax - diff / 6;

    if (
      calcTicksAmountInRange(
        Math.max(newMin, 0),
        newMax,
        Number(args.tickSpacing),
        args.xToY,
        Number(tokenX.decimal),
        Number(tokenY.decimal)
      ) >= 4
    ) {
      setPlotMin(newMin);
      setPlotMax(newMax);
    }
  };

  return (
    <div className={classNames('small_container', styles.createPosition)}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.back} onClick={() => navigate('/pools-v3')}>
            <BackIcon />
          </div>
          <h1>Add new liquidity position</h1>
          <div className={styles.setting}>
            <SettingIcon />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.item}>
            <TokenForm
              tokenFrom={tokenFrom}
              handleChangeTokenFrom={(tk) => setTokenFrom(tk)}
              tokenTo={tokenTo}
              handleChangeTokenTo={(tk) => setTokenTo(tk)}
              setFee={setFee}
              setToAmount={setToAmount}
              setFromAmount={setFromAmount}
              fromAmount={fromAmount}
              toAmount={toAmount}
              fee={fee}
            />
          </div>
          <div className={styles.item}>
            <div className={styles.wrapper}>
              <div className={styles.itemTitleWrapper}>
                <p className={styles.itemTitle}>Price Range</p>
                <p className={styles.liquidityActive}>
                  Active Liquidity <span className={styles.activeLiquidityIcon}>i</span>
                </p>
              </div>
              <div className={styles.itemSwitcherWrapper}>
                <div className={styles.switcherContainer}>
                  <div className={styles.singleTabClasses}>
                    <div className={styles.continuous}>
                      <Continuous />
                    </div>
                  </div>
                  <div className={styles.singleTabClasses}>
                    <div className={styles.discrete}>
                      <Discrete />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.itemChartAndPriceWrapper}>
              <div>
                Chart
                {/* <PriceRangePlot
                data={args.data}
                plotMin={args.min}
                plotMax={args.max}
                zoomMinus={zoomMinus}
                zoomPlus={zoomPlus}
                disabled
                leftRange={leftRange}
                rightRange={rightRange}
                midPrice={midPrice}
                className={styles.plot}
                loading={args.ticksLoading}
                isXtoY={args.xToY}
                tickSpacing={args.tickSpacing}
                xDecimal={tokenX.decimal}
                yDecimal={tokenY.decimal}
                isDiscrete={isPlotDiscrete}
                coverOnLoading
                hasError={args.hasTicksError}
                reloadHandler={args.reloadHandler}
              /> */}
              </div>

              <div className={styles.currentPriceWrapper}>
                <div className={styles.currentPriceTitle}>
                  <p>Current Price</p>
                </div>
                <div className={styles.currentPriceValue}>
                  <p>
                    <p>0.081242</p>
                    <p className={styles.pair}>ORAI / USDT</p>
                  </p>
                </div>
              </div>

              <div className={styles.minMaxPriceWrapper}>
                <div className={styles.minMaxPrice}>
                  <div className={styles.minMaxPriceTitle}>
                    <p>Min Price</p>
                  </div>
                  <div className={styles.minMaxPriceValue}>
                    <p>
                      <p>0.081242</p>
                      <p className={styles.pair}>ORAI / USDT</p>
                    </p>
                  </div>
                </div>

                <div className={styles.minMaxPrice}>
                  <div className={styles.minMaxPriceTitle}>
                    <p>Max Price</p>
                  </div>
                  <div className={styles.minMaxPriceValue}>
                    <p>
                      <p>0.081242</p>
                      <p className={styles.pair}>ORAI / USDT</p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosition;
