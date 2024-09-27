import { BigDecimal, toAmount, TokenItemType } from '@oraichain/oraidex-common';
import {
  FeeTier,
  PoolKey,
  PoolWithPoolKey,
  TokenAmount
} from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { ReactComponent as Continuous } from 'assets/images/continuous.svg';
import { ReactComponent as Discrete } from 'assets/images/discrete.svg';
import classNames from 'classnames';
import { oraichainTokens } from '@oraichain/oraidex-common';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useTheme from 'hooks/useTheme';
import SingletonOraiswapV3, { ALL_FEE_TIERS_DATA } from 'libs/contractSingleton';
import {
  calculateSqrtPrice,
  getLiquidityByX,
  getLiquidityByY,
  getMaxTick,
  getMinTick,
  isTokenX,
  Price
} from '@oraichain/oraiswap-v3';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NewPositionNoPool from '../NewPositionNoPool';
import PriceRangePlot, { PlotTickData, TickPlotPositionData } from '../PriceRangePlot/PriceRangePlot';
import {
  calcPrice,
  calcTicksAmountInRange,
  calculateConcentrationRange,
  extractDenom,
  getConcentrationArray,
  getTickAtSqrtPriceFromBalance,
  handleGetCurrentPlotTicks,
  nearestTickIndex,
  printBigint,
  toMaxNumericPlaces,
  trimLeadingZeros
} from '../PriceRangePlot/utils';
import SlippageSetting from '../SettingSlippage';
import TokenForm from '../TokenForm';
import styles from './index.module.scss';
import { convertBalanceToBigint } from 'pages/Pool-V3/helpers/number';
import { calculateTokenAmountsWithSlippage, calcYPerXPriceBySqrtPrice } from 'pages/Pool-V3/helpers/helper';
import { numberWithCommas } from 'helper/format';
import { extractAddress } from 'pages/Pool-V3/helpers/format';

export type PriceInfo = {
  startPrice: number;
  minPrice?: number;
  maxPrice?: number;
};

export enum TYPE_CHART {
  CONTINUOUS,
  DISCRETE
}

const CreatePosition = () => {
  const navigate = useNavigate();
  const { data: prices } = useCoinGeckoPrices();
  const theme = useTheme();
  const { item } = useParams();
  const [tokenX, tokenY, fee] = item.split('-');
  const [tokenFrom, setTokenFrom] = useState<TokenItemType>(
    tokenX && oraichainTokens.find((orai) => [orai.denom, orai.contractAddress].includes(tokenX))
  );
  const [tokenTo, setTokenTo] = useState<TokenItemType>(
    tokenY && oraichainTokens.find((orai) => [orai.denom, orai.contractAddress].includes(tokenY))
  );
  const [feeTier, setFeeTier] = useState<FeeTier>(
    fee
      ? ALL_FEE_TIERS_DATA.find((allFee) => allFee.fee === Number(fee)) || ALL_FEE_TIERS_DATA[0]
      : ALL_FEE_TIERS_DATA[0]
  );

  const [priceInfo, setPriceInfo] = useState<PriceInfo>({
    startPrice: 1.0
  });
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const [typeChart, setTypeChart] = useState(TYPE_CHART.CONTINUOUS);
  const [focusId, setFocusId] = useState<'from' | 'to' | null>(null);

  const [notInitPoolKey, setNotInitPoolKey] = useState<PoolKey>({
    token_x: tokenFrom?.denom || '',
    token_y: tokenTo?.denom || '',
    fee_tier: {
      fee: feeTier.fee,
      tick_spacing: 1
    }
  });

  const [leftRange, setLeftRange] = useState(getMinTick(notInitPoolKey.fee_tier.tick_spacing));
  const [rightRange, setRightRange] = useState(getMaxTick(notInitPoolKey.fee_tier.tick_spacing));

  // for showing
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');

  // for showing
  const [leftInputRounded, setLeftInputRounded] = useState('');
  const [rightInputRounded, setRightInputRounded] = useState('');

  // range of chart
  const [plotMin, setPlotMin] = useState(0);
  const [plotMax, setPlotMax] = useState(1);

  const [isPlotDiscrete, setIsPlotDiscrete] = useState(false);

  const [isPoolExist, setIsPoolExist] = useState(false);

  const [poolInfo, setPoolInfo] = useState<PoolWithPoolKey>();

  const [currentPrice, setCurrentPrice] = useState(1);

  const [midPrice, setMidPrice] = useState<TickPlotPositionData>(() => {
    const isXToY = isTokenX(extractAddress(tokenFrom), extractAddress(tokenTo));
    const tokenXDecimals = isXToY ? tokenFrom.decimals : tokenTo.decimals;
    const tokenYDecimals = isXToY ? tokenTo.decimals : tokenFrom.decimals;
    const tickIndex = getTickAtSqrtPriceFromBalance(
      priceInfo.startPrice,
      feeTier.tick_spacing,
      isXToY,
      tokenXDecimals,
      tokenYDecimals
    );

    return {
      index: tickIndex,
      x: calcPrice(tickIndex, isXToY, tokenXDecimals, tokenYDecimals)
    };
  });

  const isXtoY = useMemo(() => {
    if (tokenFrom && tokenTo) {
      return extractDenom(tokenFrom) < extractDenom(tokenTo);
    }
    return true;
  }, [tokenFrom, tokenTo]);

  const [amountTo, setAmountTo] = useState<string>('');
  const [amountFrom, setAmountFrom] = useState<string>('');

  useEffect(() => {
    const isXToY = isTokenX(extractAddress(tokenFrom), extractAddress(tokenTo));

    const tokenXDecimals = isXToY ? tokenFrom?.decimals ?? 6 : tokenTo?.decimals ?? 6;
    const tokenYDecimals = isXToY ? tokenTo?.decimals ?? 6 : tokenFrom?.decimals ?? 6;

    const tickIndex = nearestTickIndex(
      priceInfo.startPrice,
      feeTier.tick_spacing,
      isXToY,
      tokenXDecimals,
      tokenYDecimals
    );

    setMidPrice({
      index: tickIndex,
      x: calcPrice(tickIndex, isXToY, tokenXDecimals, tokenYDecimals)
    });
  }, [isXtoY]);

  useEffect(() => {
    if (focusId === 'from') {
      setAmountTo(
        getOtherTokenAmount(
          toAmount(amountFrom, tokenFrom.decimals).toString(),
          Number(leftRange),
          Number(rightRange),
          true
        )
      );
    }
  }, [amountFrom, focusId]);

  useEffect(() => {
    if (focusId === 'to') {
      setAmountFrom(
        getOtherTokenAmount(
          toAmount(amountTo, tokenTo.decimals).toString(),
          Number(leftRange),
          Number(rightRange),
          false
        )
      );
    }
  }, [amountTo, focusId]);

  const positionOpeningMethod = 'range'; // always range

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPrice(
      new BigDecimal(prices[tokenFrom?.coinGeckoId] || 0).div(prices[tokenTo?.coinGeckoId] || 1).toNumber()
    );
  }, [tokenFrom, tokenTo]);

  const concentrationArray = useMemo(
    () =>
      getConcentrationArray(Number(notInitPoolKey.fee_tier.tick_spacing), 2, Number(midPrice)).sort((a, b) => a - b),
    [notInitPoolKey.fee_tier.tick_spacing]
  );

  const liquidityRef = useRef<any>(0n);

  const [concentrationIndex, setConcentrationIndex] = useState(0);

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
        Number(notInitPoolKey.fee_tier.tick_spacing),
        isXtoY,
        tokenFrom.decimals,
        tokenTo.decimals
      ) >= 4
    ) {
      setPlotMin(newMin);
      setPlotMax(newMax);
    }
  };

  // from left range to right range to get ticks inside range
  const getTicksInsideRange = (left: number, right: number, isXtoY: boolean) => {
    // get max tick for this pool
    const leftMax = isXtoY
      ? getMinTick(notInitPoolKey.fee_tier.tick_spacing)
      : getMaxTick(notInitPoolKey.fee_tier.tick_spacing);

    // get min tick for this pool
    const rightMax = isXtoY
      ? getMaxTick(notInitPoolKey.fee_tier.tick_spacing)
      : getMinTick(notInitPoolKey.fee_tier.tick_spacing);

    let leftInRange: number;
    let rightInRange: number;

    if (isXtoY) {
      leftInRange = left < leftMax ? leftMax : left;
      rightInRange = right > rightMax ? rightMax : right;
    } else {
      leftInRange = left > leftMax ? leftMax : left;
      rightInRange = right < rightMax ? rightMax : right;
    }

    return { leftInRange, rightInRange };
  };

  const setLeftInputValues = (val: string) => {
    setLeftInput(val);
    setLeftInputRounded(toMaxNumericPlaces(+val, 5));
  };

  const setRightInputValues = (val: string) => {
    setRightInput(val);
    setRightInputRounded(toMaxNumericPlaces(+val, 5));
  };

  const onLeftInputChange = (val: string) => {
    setLeftInput(val);
    setLeftInputRounded(val);
  };

  const onRightInputChange = (val: string) => {
    setRightInput(val);
    setRightInputRounded(val);
  };

  // when change the range of the plot -> change the value of the input amount
  const onChangeRange = (left: number, right: number) => {
    let leftRange: number;
    let rightRange: number;

    // if (positionOpeningMethod === 'range') {
    const { leftInRange, rightInRange } = getTicksInsideRange(left, right, isXtoY);
    leftRange = leftInRange;
    rightRange = rightInRange;
    // } else {
    //   leftRange = left;
    //   rightRange = right;
    // }
    // leftRange = left;
    // rightRange = right;

    if (tokenFrom && (isXtoY ? rightRange > midPrice.index : rightRange < midPrice.index)) {
      const deposit = amountFrom;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint(deposit, tokenFrom.decimals).toString(),
        Number(leftRange),
        Number(rightRange),
        true
      );

      if (tokenTo && +deposit !== 0) {
        setAmountFrom(deposit);
        setAmountTo(amount);
        return;
      }
    }

    if (tokenTo && (isXtoY ? leftRange < midPrice.index : leftRange > midPrice.index)) {
      const deposit = amountTo;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint(deposit, tokenTo.decimals).toString(),
        Number(leftRange),
        Number(rightRange),
        false
      );

      if (tokenFrom && +deposit !== 0) {
        setAmountTo(deposit);
        setAmountFrom(amount);
      }
    }
  };

  const changeRangeHandler = (left: number, right: number) => {
    let leftRange: number;
    let rightRange: number;

    // if (positionOpeningMethod === 'range') {
    const { leftInRange, rightInRange } = getTicksInsideRange(left, right, isXtoY);
    leftRange = leftInRange;
    rightRange = rightInRange;
    // } else {
    //   leftRange = left;
    //   rightRange = right;
    // }

    setLeftRange(Number(leftRange));
    setRightRange(Number(rightRange));

    const tokenXDecimals = isXtoY ? tokenFrom.decimals : tokenTo.decimals;
    const tokenYDecimals = isXtoY ? tokenTo.decimals : tokenFrom.decimals;

    setLeftInputValues(calcPrice(Number(leftRange), isXtoY, tokenXDecimals, tokenYDecimals).toString());
    setRightInputValues(calcPrice(Number(rightRange), isXtoY, tokenXDecimals, tokenYDecimals).toString());

    onChangeRange(left, right);
  };

  const resetPlot = () => {
    if (positionOpeningMethod === 'range') {
      const tokenXDecimals = isXtoY ? tokenFrom.decimals : tokenTo.decimals;
      const tokenYDecimals = isXtoY ? tokenTo.decimals : tokenFrom.decimals;
      const initSideDist = Math.abs(
        midPrice.x -
          calcPrice(
            Math.max(
              getMinTick(notInitPoolKey.fee_tier.tick_spacing),
              Number(midPrice.index) - notInitPoolKey.fee_tier.tick_spacing * 15
            ),
            isXtoY,
            tokenXDecimals,
            tokenYDecimals
          )
      );

      const higherTick = Math.max(
        Number(getMinTick(Number(notInitPoolKey.fee_tier.tick_spacing))),
        Number(midPrice.index) - Number(notInitPoolKey.fee_tier.tick_spacing) * 10
      );

      const lowerTick = Math.min(
        Number(getMaxTick(Number(notInitPoolKey.fee_tier.tick_spacing))),
        Number(midPrice.index) + Number(notInitPoolKey.fee_tier.tick_spacing) * 10
      );

      changeRangeHandler(isXtoY ? higherTick : lowerTick, isXtoY ? lowerTick : higherTick);

      setPlotMin(midPrice.x - initSideDist);
      setPlotMax(midPrice.x + initSideDist);
    } else {
      setConcentrationIndex(0);
      const { leftRange, rightRange } = calculateConcentrationRange(
        1,
        concentrationArray[0],
        2,
        midPrice.index,
        isXtoY
      );
      changeRangeHandler(leftRange, rightRange);
      autoZoomHandler(leftRange, rightRange, true);
    }
  };

  // const reversePlot = () => {
  //   changeRangeHandler(rightRange, leftRange);
  //   if (plotMin > 0) {
  //     const pom = 1 / plotMin;
  //     setPlotMin(1 / plotMax);
  //     setPlotMax(pom);
  //   } else {
  //     const initSideDist = Math.abs(
  //       midPrice.x -
  //         calcPrice(
  //           Math.max(
  //             getMinTick(notInitPoolKey.fee_tier.tick_spacing),
  //             midPrice.index - notInitPoolKey.fee_tier.tick_spacing * 15
  //           ),
  //           isXtoY,
  //           tokenFrom.decimals,
  //           tokenTo.decimals
  //         )
  //     );

  //     setPlotMin(midPrice.x - initSideDist);
  //     setPlotMax(midPrice.x + initSideDist);
  //   }
  // };

  const autoZoomHandler = (left: number, right: number, canZoomCloser: boolean = false) => {
    const leftX = calcPrice(left, isXtoY, tokenFrom.decimals, tokenTo.decimals);
    const rightX = calcPrice(right, isXtoY, tokenFrom.decimals, tokenTo.decimals);

    const higherLeftIndex = Math.max(
      getMinTick(notInitPoolKey.fee_tier.tick_spacing),
      left - notInitPoolKey.fee_tier.tick_spacing * 15
    );

    const lowerLeftIndex = Math.min(
      getMaxTick(notInitPoolKey.fee_tier.tick_spacing),
      left + notInitPoolKey.fee_tier.tick_spacing * 15
    );

    const lowerRightIndex = Math.min(
      getMaxTick(notInitPoolKey.fee_tier.tick_spacing),
      right + notInitPoolKey.fee_tier.tick_spacing * 15
    );

    const higherRightIndex = Math.max(
      getMinTick(notInitPoolKey.fee_tier.tick_spacing),
      right - notInitPoolKey.fee_tier.tick_spacing * 15
    );

    if (leftX < plotMin || rightX > plotMax || canZoomCloser) {
      const leftDist = Math.abs(
        leftX - calcPrice(isXtoY ? higherLeftIndex : lowerLeftIndex, isXtoY, tokenFrom.decimals, tokenTo.decimals)
      );
      const rightDist = Math.abs(
        rightX - calcPrice(isXtoY ? lowerRightIndex : higherRightIndex, isXtoY, tokenFrom.decimals, tokenTo.decimals)
      );

      let dist;

      if (leftX < plotMin && rightX > plotMax) {
        dist = Math.max(leftDist, rightDist);
      } else if (leftX < plotMin) {
        dist = leftDist;
      } else {
        dist = rightDist;
      }

      setPlotMin(leftX - dist);
      setPlotMax(rightX + dist);
    }
  };

  const checkNoPool = async (
    fee: FeeTier,
    tokenFrom: TokenItemType | undefined,
    tokenTo: TokenItemType | undefined
  ) => {
    if (fee && tokenFrom && tokenTo) {
      const denom_x = extractAddress(tokenFrom);
      const denom_y = extractAddress(tokenTo);
      const token_x = isTokenX(denom_x, denom_y) ? denom_x : denom_y;
      const token_y = isTokenX(denom_x, denom_y) ? denom_y : denom_x;
      try {
        const pool = await SingletonOraiswapV3.getPool({
          fee_tier: fee,
          token_x: token_x,
          token_y: token_y
        });
        if (pool) {
          setPoolInfo(pool);
          setNotInitPoolKey(pool.pool_key);
        } else {
          const isXToY = isTokenX(extractAddress(tokenFrom), extractAddress(tokenTo));
          const tokenXDecimals = isXtoY ? tokenFrom.decimals : tokenTo.decimals;
          const tokenYDecimals = isXtoY ? tokenTo.decimals : tokenFrom.decimals;
          const tickIndex = nearestTickIndex(
            priceInfo.startPrice,
            feeTier.tick_spacing,
            isXToY,
            tokenXDecimals,
            tokenYDecimals
          );
          setMidPrice({
            index: tickIndex,
            x: calcPrice(tickIndex, isXtoY, tokenXDecimals, tokenYDecimals)
          });
          setNotInitPoolKey({
            fee_tier: fee,
            token_x: token_x,
            token_y: token_y
          });
        }
        setIsPoolExist(pool !== null);
        return;
      } catch (error) {
        const isXToY = isTokenX(extractAddress(tokenFrom), extractAddress(tokenTo));
        const tokenXDecimals = isXtoY ? tokenFrom.decimals : tokenTo.decimals;
        const tokenYDecimals = isXtoY ? tokenTo.decimals : tokenFrom.decimals;
        const tickIndex = nearestTickIndex(
          priceInfo.startPrice,
          feeTier.tick_spacing,
          isXToY,
          tokenXDecimals,
          tokenYDecimals
        );
        setMidPrice({
          index: tickIndex,
          x: calcPrice(tickIndex, isXtoY, tokenXDecimals, tokenYDecimals)
        });
        setNotInitPoolKey({
          fee_tier: fee,
          token_x: token_x,
          token_y: token_y
        });
        setIsPoolExist(false);
      }
      return;
    } else {
      setIsPoolExist(false);
    }
  };

  const calcAmount = (amount: TokenAmount, left: number, right: number, tokenAddress: string) => {
    if (!poolInfo) return BigInt(0);
    if (!tokenFrom || !tokenTo || isNaN(left) || isNaN(right)) {
      return BigInt(0);
    }

    const byX = tokenAddress === (isXtoY ? extractDenom(tokenFrom) : extractDenom(tokenTo));

    const lowerTick = Math.min(left, right);
    const upperTick = Math.max(left, right);

    try {
      if (byX) {
        const { amount: tokenYAmount, l: positionLiquidity } = getLiquidityByX(
          BigInt(amount),
          lowerTick,
          upperTick,
          isPoolExist ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index),
          true
        );

        let [, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
          poolInfo.pool_key.fee_tier.tick_spacing,
          BigInt(poolInfo.pool.sqrt_price),
          positionLiquidity,
          lowerTick,
          upperTick,
          Number(slippage),
          true
        );
        const finalYAmount = yAmountWithSlippage > tokenYAmount ? yAmountWithSlippage : tokenYAmount;

        if (isMountedRef.current) {
          liquidityRef.current = positionLiquidity;
        }

        return finalYAmount;
      }

      const { amount: tokenXAmount, l: positionLiquidity } = getLiquidityByY(
        BigInt(amount),
        lowerTick,
        upperTick,
        isPoolExist ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index),
        true
      );

      let [xAmountWithSlippage] = calculateTokenAmountsWithSlippage(
        poolInfo.pool_key.fee_tier.tick_spacing,
        BigInt(poolInfo.pool.sqrt_price),
        positionLiquidity,
        lowerTick,
        upperTick,
        Number(slippage),
        true
      );
      const finalXAmount = xAmountWithSlippage > tokenXAmount ? xAmountWithSlippage : tokenXAmount;

      if (isMountedRef.current) {
        liquidityRef.current = positionLiquidity;
      }

      return finalXAmount;
    } catch (error) {
      console.log('error', error);
      const result = (byX ? getLiquidityByY : getLiquidityByX)(
        BigInt(amount),
        lowerTick,
        upperTick,
        isPoolExist ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index),
        true
      );

      let [xAmountWithSlippage, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
        poolInfo.pool_key.fee_tier.tick_spacing,
        BigInt(poolInfo.pool.sqrt_price),
        result.l,
        lowerTick,
        upperTick,
        Number(slippage),
        true
      );

      if (isMountedRef.current) {
        liquidityRef.current = result.l;
      }
      if (byX) {
        return yAmountWithSlippage > result.amount ? yAmountWithSlippage : result.amount;
      } else {
        return xAmountWithSlippage > result.amount ? xAmountWithSlippage : result.amount;
      }
    }
  };

  const getOtherTokenAmount = (amount: TokenAmount, left: number, right: number, byFirst: boolean) => {
    const [printToken, calcToken] = byFirst ? [tokenTo, tokenFrom] : [tokenFrom, tokenTo];
    if (!printToken || !calcToken) {
      return '0.0';
    }

    const result = calcAmount(amount, left, right, extractAddress(calcToken));
    return trimLeadingZeros(printBigint(result, printToken.decimals));
  };

  const onChangeMidPrice = (mid: Price) => {
    const convertedMid = Number(mid);

    const tokenXDecimals = isXtoY ? tokenFrom.decimals : tokenTo.decimals;
    const tokenYDecimals = isXtoY ? tokenTo.decimals : tokenFrom.decimals;

    setMidPrice({
      index: convertedMid,
      x: calcPrice(convertedMid, isXtoY, tokenXDecimals, tokenYDecimals)
    });
    setPriceInfo({
      ...priceInfo,
      startPrice: calcPrice(convertedMid, isXtoY, tokenXDecimals, tokenYDecimals)
    });

    if (amountFrom && (isXtoY ? rightRange > convertedMid : rightRange < convertedMid)) {
      const deposit = amountFrom;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint(deposit, tokenFrom.decimals).toString(),
        leftRange,
        rightRange,
        true
      );
      if (tokenTo && +deposit !== 0) {
        setAmountFrom(deposit);
        setAmountTo(amount);
        return;
      }
    }
    if (amountTo && (isXtoY ? leftRange < convertedMid : leftRange > convertedMid)) {
      const deposit = amountTo;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint(deposit, tokenTo.decimals).toString(),
        leftRange,
        rightRange,
        false
      );
      if (tokenFrom && +deposit !== 0) {
        setAmountTo(deposit);
        setAmountFrom(amount);
      }
    }
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [liquidityData, setLiquidityData] = useState<PlotTickData[]>([]);

  useEffect(() => {
    if (isMountedRef.current && liquidityData) {
      resetPlot();
    }
  }, [liquidityData]); // midPrice TODO:

  useEffect(() => {
    checkNoPool(feeTier, tokenFrom, tokenTo);
  }, [feeTier, tokenFrom, tokenTo, isPoolExist]);

  const handleSuccessAdd = async () => {
    try {
      await checkNoPool(feeTier, tokenFrom, tokenTo);

      if (isPoolExist && notInitPoolKey) {
        handleGetTicks();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleGetTicks = () => {
    try {
      const fetchTickData = async () => {
        setLoading(true);
        const tokenX = extractAddress(tokenFrom) === notInitPoolKey.token_x ? tokenFrom : tokenTo;
        const tokenY = extractAddress(tokenTo) === notInitPoolKey.token_y ? tokenTo : tokenFrom;
        const ticksData = await handleGetCurrentPlotTicks({
          poolKey: notInitPoolKey,
          isXtoY: isXtoY,
          xDecimal: tokenX.decimals,
          yDecimal: tokenY.decimals
        });

        setLiquidityData(ticksData);
      };

      if (isPoolExist && notInitPoolKey) {
        fetchTickData();
      }
    } catch (error) {
      console.log('error: >> liquidity', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTicks();
  }, [isPoolExist, notInitPoolKey, isXtoY]);

  useEffect(() => {
    if (poolInfo) {
      const tokenXDecimals = isXtoY ? tokenFrom.decimals : tokenTo.decimals;
      const tokenYDecimals = isXtoY ? tokenTo.decimals : tokenFrom.decimals;

      setMidPrice({
        index: poolInfo.pool.current_tick_index,
        x:
          calcYPerXPriceBySqrtPrice(BigInt(poolInfo.pool.sqrt_price), tokenXDecimals, tokenYDecimals) **
          (isXtoY ? 1 : -1)
      });
    }
  }, [poolInfo, isXtoY, tokenFrom, tokenTo]);

  // render add new pool or new position liquidity
  const renderPriceSection = isPoolExist ? (
    <div className={styles.priceSectionExisted}>
      <div className={styles.wrapper}>
        <div className={styles.itemTitleWrapper}>
          <p className={styles.itemTitle}>Price Range</p>
          <p className={styles.liquidityActive}>
            Active Liquidity
            {/* <TooltipIcon
              className={styles.tooltipWrapper}
              placement="top"
              visible={openTooltip}
              icon={<TooltipIc />}
              setVisible={setOpenTooltip}
              content={<div className={classNames(styles.tooltip, styles[theme])}>Active Liquidity</div>}
            /> */}
          </p>
        </div>
        <div className={styles.itemSwitcherWrapper}>
          <div className={styles.switcherContainer}>
            <div
              className={classNames(
                styles.singleTabClasses,
                { [styles.chosen]: typeChart === TYPE_CHART.CONTINUOUS },
                styles[theme]
              )}
              onClick={() => {
                setTypeChart(TYPE_CHART.CONTINUOUS);
                setIsPlotDiscrete(false);
              }}
            >
              <div className={styles.continuous}>
                <Continuous />
              </div>
            </div>
            <div
              className={classNames(
                styles.singleTabClasses,
                { [styles.chosen]: typeChart === TYPE_CHART.DISCRETE },
                styles[theme]
              )}
              onClick={() => {
                setTypeChart(TYPE_CHART.DISCRETE);
                setIsPlotDiscrete(true);
              }}
            >
              <div className={styles.discrete}>
                <Discrete />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.itemChartAndPriceWrapper}>
        <div>
          <PriceRangePlot
            className={styles.plot}
            data={liquidityData}
            onChangeRange={changeRangeHandler}
            leftRange={{
              index: leftRange,
              x: calcPrice(
                leftRange,
                isXtoY,
                isXtoY ? tokenFrom.decimals : tokenTo.decimals,
                isXtoY ? tokenTo.decimals : tokenFrom.decimals
              )
            }}
            rightRange={{
              index: rightRange,
              x: calcPrice(
                rightRange,
                isXtoY,
                isXtoY ? tokenFrom.decimals : tokenTo.decimals,
                isXtoY ? tokenTo.decimals : tokenFrom.decimals
              )
            }}
            midPrice={midPrice}
            plotMin={plotMin}
            plotMax={plotMax}
            zoomMinus={zoomMinus}
            zoomPlus={zoomPlus}
            loading={loading}
            coverOnLoading={true}
            isXtoY={isXtoY}
            tickSpacing={notInitPoolKey.fee_tier.tick_spacing}
            xDecimal={isXtoY ? tokenFrom.decimals : tokenTo.decimals}
            yDecimal={isXtoY ? tokenTo.decimals : tokenFrom.decimals}
            isDiscrete={isPlotDiscrete}
            // disabled={positionOpeningMethod === 'concentration'}
            disabled={false}
            // hasError={args.hasError}
            // reloadHandler={reloadHandler}
            reloadHandler={() => {}}
          />
        </div>

        <div className={styles.currentPriceWrapper}>
          <div className={styles.currentPriceTitle}>
            <p>Current Price</p>
          </div>
          <div className={styles.currentPriceValue}>
            <p>
              <p>{numberWithCommas(midPrice.x, undefined, { maximumFractionDigits: 9 })}</p>
              <p className={styles.pair}>
                {tokenTo.name.toUpperCase()} / {tokenFrom.name.toUpperCase()}
              </p>
            </p>
          </div>
        </div>

        <div className={styles.minMaxPriceWrapper}>
          <div className={styles.item}>
            <div className={styles.minMaxPrice}>
              <div className={styles.minMaxPriceTitle}>
                <p>Min Price</p>
              </div>
              <div className={styles.minMaxPriceValue}>
                <p>
                  <p>{numberWithCommas(Number(leftInputRounded), undefined, { maximumFractionDigits: 6 })}</p>
                  <p className={styles.pair}>
                    {tokenTo.name.toUpperCase()} / {tokenFrom.name.toUpperCase()}
                  </p>
                </p>
              </div>
            </div>
            <div className={styles.percent}>
              <p>Min Current Price:</p>
              <span className={classNames(styles.value, { [styles.positive]: false })}>
                {(((+leftInput - midPrice.x) / midPrice.x) * 100).toLocaleString(undefined, {
                  maximumFractionDigits: 3
                })}
                %
              </span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.minMaxPrice}>
              <div className={styles.minMaxPriceTitle}>
                <p>Max Price</p>
              </div>
              <div className={styles.minMaxPriceValue}>
                <p>
                  <p>{numberWithCommas(Number(rightInputRounded), undefined, { maximumFractionDigits: 6 })}</p>
                  <p className={styles.pair}>
                    {tokenTo.name.toUpperCase()} / {tokenFrom.name.toUpperCase()}
                  </p>
                </p>
              </div>
            </div>
            <div className={styles.percent}>
              <p>Max Current Price:</p>
              <span className={classNames(styles.value, { [styles.positive]: true })}>
                {numberWithCommas(((+rightInput - midPrice.x) / midPrice.x) * 100, undefined, {
                  maximumFractionDigits: 3
                })}
                %
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={resetPlot}>Reset range</button>
          <button
            onClick={() => {
              const left = isXtoY
                ? getMinTick(poolInfo.pool_key.fee_tier.tick_spacing)
                : getMaxTick(poolInfo.pool_key.fee_tier.tick_spacing);
              const right = isXtoY
                ? getMaxTick(poolInfo.pool_key.fee_tier.tick_spacing)
                : getMinTick(poolInfo.pool_key.fee_tier.tick_spacing);
              changeRangeHandler(left, right);
              autoZoomHandler(left, right);
            }}
          >
            Set full range
          </button>
        </div>
      </div>
    </div>
  ) : (
    <NewPositionNoPool
      fromToken={tokenFrom} // symbol + decimal
      toToken={tokenTo} // symbol + decimal
      priceInfo={priceInfo} // startPrice, minPrice, maxPrice
      setPriceInfo={setPriceInfo} // setStartPrice, setMinPrice, setMaxPrice
      onChangeMidPrice={onChangeMidPrice}
      tickSpacing={notInitPoolKey.fee_tier.tick_spacing}
      isXtoY={isXtoY}
      onChangeRange={changeRangeHandler}
      midPrice={midPrice.index}
    />
  );

  /* add liquidity depends on
  tick range: left, right
  pool key: tokenFrom, tokenTo, fee
  liquidity delta: liquidity 
  mid sqrt price: pool exist ? poolData.pool.sqrt_price : calculateSqrtPrice(midPrice.index)
  token amount: fromAmount, toAmount
  init pool: !isPoolExist -> ok
*/

  return (
    <div className={classNames('small_container', styles.createPosition)}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div
            className={styles.back}
            onClick={() => {
              // navigate(-1);
              navigate('/pools');
            }}
          >
            <BackIcon />
          </div>
          <h1>Add new liquidity position</h1>
          <div className={styles.setting}>
            <SettingIcon onClick={() => setIsOpen(true)} />
            <SlippageSetting isOpen={isOpen} setIsOpen={setIsOpen} setSlippage={setSlippage} slippage={slippage} />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.item}>
            <TokenForm
              tokenFrom={tokenFrom}
              handleChangeTokenFrom={(tk) => setTokenFrom(tk)}
              tokenTo={tokenTo}
              handleChangeTokenTo={(tk) => setTokenTo(tk)}
              setFee={setFeeTier}
              setToAmount={setAmountTo}
              setFromAmount={setAmountFrom}
              fromAmount={amountFrom}
              toAmount={amountTo}
              fee={feeTier}
              setFocusInput={setFocusId}
              left={leftRange}
              right={rightRange}
              slippage={slippage}
              poolData={poolInfo}
              isPoolExist={isPoolExist}
              liquidity={liquidityRef.current}
              midPrice={midPrice}
              handleSuccessAdd={handleSuccessAdd}
            />
          </div>
          <div className={styles.item}>
            {!(tokenFrom && tokenTo) ? (
              <div className={styles.noToken}>
                <span>Select tokens to set price range.</span>
              </div>
            ) : (
              renderPriceSection
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosition;
