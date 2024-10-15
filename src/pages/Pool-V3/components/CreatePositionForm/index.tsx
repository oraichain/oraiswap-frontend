import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import {
  BigDecimal,
  CW20_DECIMALS,
  MULTICALL_CONTRACT,
  oraichainTokens,
  toAmount,
  toDisplay,
  TokenItemType,
  USDT_CONTRACT,
  ZAPPER_CONTRACT
} from '@oraichain/oraidex-common';
import { ZapperQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { FeeTier, PoolWithPoolKey, TokenAmount } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import {
  calculateSqrtPrice,
  getLiquidityByX,
  getLiquidityByY,
  getMaxTick,
  getMinTick,
  getTickAtSqrtPrice,
  isTokenX,
  newPoolKey,
  poolKeyToString,
  RouteNoLiquidity,
  RouteNotFoundError,
  SpamTooManyRequestsError,
  ZapConsumer,
  ZapInLiquidityResponse
} from '@oraichain/oraiswap-v3';
import { ReactComponent as ErrorIcon } from 'assets/icons/error-fill-icon.svg';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-fill-ic.svg';
import { ReactComponent as OutputIcon } from 'assets/icons/zapOutput-ic.svg';
import { ReactComponent as Continuous } from 'assets/images/continuous.svg';
import { ReactComponent as Discrete } from 'assets/images/discrete.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh-ccw.svg';
import { ReactComponent as ZoomInIcon } from 'assets/icons/zoom-in.svg';
import { ReactComponent as ZoomOutIcon } from 'assets/icons/zoom-out.svg';
import classNames from 'classnames';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TooltipHover from 'components/TooltipHover';
import ZappingText from 'components/Zapping';
import { network } from 'config/networks';
import { getIcon, getTransactionUrl, minimize } from 'helper';
import { numberWithCommas } from 'helper/format';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import useTheme from 'hooks/useTheme';
import mixpanel from 'mixpanel-browser';
import { extractAddress } from 'pages/Pool-V3/helpers/format';
import { calculateTokenAmountsWithSlippage, InitPositionData } from 'pages/Pool-V3/helpers/helper';
import { convertBalanceToBigint } from 'pages/Pool-V3/helpers/number';
import useAddLiquidity from 'pages/Pool-V3/hooks/useAddLiquidity';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';
import useZap from 'pages/Pool-V3/hooks/useZap';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'store/configure';
import PriceRangePlot, { PlotTickData, TickPlotPositionData } from '../PriceRangePlot/PriceRangePlot';
import {
  calcPrice,
  calcTicksAmountInRange,
  calculateConcentrationRange,
  determinePositionTokenBlock,
  extractDenom,
  getConcentrationArray,
  handleGetCurrentPlotTicks,
  logBase,
  nearestTickIndex,
  PositionTokenBlock,
  printBigint,
  toMaxNumericPlaces,
  trimLeadingZeros
} from '../PriceRangePlot/utils';
import SelectToken from '../SelectToken';
import styles from './index.module.scss';
import { PRICE_SCALE } from 'libs/contractSingleton';
import HistoricalPriceChart, { formatPretty } from '../HistoricalPriceChart';
import { ConcentratedLiquidityDepthChart } from '../ConcentratedLiquidityDepthChart';
import { Dec } from '@keplr-wallet/unit';
import { set } from 'lodash';
import useAddLiquidityNew from 'pages/Pool-V3/hooks/useAddLiquidityNew';
import HistoricalChartDataWrapper from '../HistoricalChartDataWrapper';
import LiquidityChartWrapper from '../LiquidityChartWrapper';

export type PriceInfo = {
  startPrice: number;
  minPrice?: number;
  maxPrice?: number;
};

export enum TYPE_CHART {
  CONTINUOUS,
  DISCRETE
}

interface CreatePoolFormProps {
  tokenFrom: TokenItemType;
  tokenTo: TokenItemType;
  feeTier: FeeTier;
  poolData: PoolWithPoolKey; // Replace with appropriate type
  slippage: number;
  showModal: boolean;
  onCloseModal: () => void;
}

const TOKEN_ZAP = oraichainTokens.find((e) => extractAddress(e) === USDT_CONTRACT);

const cx = cn.bind(styles);

const CreatePositionForm: FC<CreatePoolFormProps> = ({
  tokenFrom,
  tokenTo,
  feeTier,
  poolData,
  slippage,
  showModal,
  onCloseModal
}) => {
  const [tokenZap, setTokenZap] = useState<TokenItemType>(TOKEN_ZAP);
  const [zapAmount, setZapAmount] = useState<number | string>('');
  const [zapInResponse, setZapInResponse] = useState<ZapInLiquidityResponse>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [zapImpactPrice, setZapImpactPrice] = useState<number>(0.5);

  const endRef = useRef(null);

  const debounceZapAmount = useDebounce(zapAmount, 1000);

  const { data: prices } = useCoinGeckoPrices();
  const { poolList, poolPrice: extendPrices } = useGetPoolList(prices);

  const {
    pool,
    poolKey,
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
    lowerTick,
    higherTick,
    setLowerTick,
    setHigherTick,
    setHoverPrice,
    changeHistoricalRange,
    zoomIn,
    zoomOut,
    resetRange,
    setMinPrice,
    setMaxPrice
  } = useAddLiquidityNew(poolKeyToString(poolData.pool_key));

  const navigate = useNavigate();
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [walletAddress] = useConfigReducer('address');
  const theme = useTheme();
  const [priceInfo, setPriceInfo] = useState<PriceInfo>({
    startPrice: 1.0
  });
  const [typeChart, setTypeChart] = useState(TYPE_CHART.CONTINUOUS);
  const [isPlotDiscrete, setIsPlotDiscrete] = useState(false);
  const [toggleZapIn, setToggleZapIn] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const loadOraichainToken = useLoadOraichainTokens();
  const [focusId, setFocusId] = useState<'from' | 'to' | 'zapper' | null>(null);

  const [poolInfo, setPoolInfo] = useState<PoolWithPoolKey>(poolData);

  const [leftRange, setLeftRange] = useState(getMinTick(poolData.pool_key.fee_tier.tick_spacing));
  const [rightRange, setRightRange] = useState(getMaxTick(poolData.pool_key.fee_tier.tick_spacing));

  const [leftInputRounded, setLeftInputRounded] = useState('');
  const [rightInputRounded, setRightInputRounded] = useState('');

  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');

  const [plotMin, setPlotMin] = useState(0);
  const [plotMax, setPlotMax] = useState(1);

  const [zapError, setZapError] = useState<string | null>(null);

  const [isPoolExist, setIsPoolExist] = useState(false);

  const [midPrice, setMidPrice] = useState<TickPlotPositionData>(() => {
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

  const [amountTo, setAmountTo] = useState<number | string>();
  const [amountFrom, setAmountFrom] = useState<number | string>();

  const fromUsd = extendPrices?.[tokenFrom?.coinGeckoId]
    ? (extendPrices[tokenFrom.coinGeckoId] * Number(amountFrom || 0)).toFixed(6)
    : '0';
  const toUsd = extendPrices?.[tokenTo?.coinGeckoId]
    ? (extendPrices[tokenTo.coinGeckoId] * Number(amountTo || 0)).toFixed(6)
    : '0';
  const zapUsd = extendPrices?.[tokenZap?.coinGeckoId]
    ? (extendPrices[tokenZap.coinGeckoId] * Number(zapAmount || 0)).toFixed(6)
    : '0';

  const xUsd =
    zapInResponse &&
    (extendPrices?.[tokenFrom?.coinGeckoId] * (Number(zapInResponse.amountX || 0) / 10 ** tokenFrom.decimals)).toFixed(
      6
    );
  const yUsd =
    zapInResponse &&
    (extendPrices?.[tokenTo?.coinGeckoId] * (Number(zapInResponse.amountY || 0) / 10 ** tokenTo.decimals)).toFixed(6);

  const [swapFee, setSwapFee] = useState<number>(1.5);
  const [zapFee, setZapFee] = useState<number>(1);
  const [totalFee, setTotalFee] = useState<number>(1.75);
  const [matchRate, setMatchRate] = useState<number>(99.5);

  const isLightTheme = theme === 'light';

  const renderTokenObj = (coinGeckoId, size: number = 30) => {
    return {
      isLightTheme,
      type: 'token' as any,
      coinGeckoId,
      width: size,
      height: size
    };
  };

  const TokenFromIcon = tokenFrom && getIcon(renderTokenObj(tokenFrom.coinGeckoId));
  const TokenToIcon = tokenTo && getIcon(renderTokenObj(tokenTo.coinGeckoId));

  const TokenPriceFromIcon = tokenFrom && getIcon(renderTokenObj(tokenFrom.coinGeckoId, 18));
  const TokenPriceToIcon = tokenTo && getIcon(renderTokenObj(tokenTo.coinGeckoId, 18));

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
    if (simulating) {
      setZapError(null);
    }
    if (tokenZap && zapAmount == 0) {
      setZapError(null);
    }
  }, [zapInResponse, simulating, tokenZap, zapAmount]);

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

  const concentrationArray = useMemo(
    () =>
      getConcentrationArray(Number(poolData.pool_key.fee_tier.tick_spacing), 2, Number(midPrice)).sort((a, b) => a - b),
    [poolData.pool_key.fee_tier.tick_spacing, midPrice]
  );

  const liquidityRef = useRef<any>(0n);

  const [loading, setLoading] = useState<boolean>(false);
  const [liquidityData, setLiquidityData] = useState<PlotTickData[]>([]);

  useEffect(() => {
    if (isMountedRef.current && liquidityData) {
      resetPlot();
    }
  }, [liquidityData]);

  useEffect(() => {
    checkNoPool(feeTier, tokenFrom, tokenTo);
  }, [feeTier, tokenFrom, tokenTo, isPoolExist, poolList]);

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
        Number(poolData.pool_key.fee_tier.tick_spacing),
        isXtoY,
        tokenFrom.decimals,
        tokenTo.decimals
      ) >= 4
    ) {
      setPlotMin(newMin);
      setPlotMax(newMax);
    }
  };

  const getTicksInsideRange = (left: number, right: number, isXtoY: boolean) => {
    const leftMax = isXtoY
      ? getMinTick(poolData.pool_key.fee_tier.tick_spacing)
      : getMaxTick(poolData.pool_key.fee_tier.tick_spacing);
    const rightMax = isXtoY
      ? getMaxTick(poolData.pool_key.fee_tier.tick_spacing)
      : getMinTick(poolData.pool_key.fee_tier.tick_spacing);

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

    setLeftRange(Number(left));
    setRightRange(Number(right));

    if (tokenFrom && (isXtoY ? rightRange > midPrice.index : rightRange < midPrice.index)) {
      const deposit = amountFrom;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint((deposit || '0').toString(), tokenFrom.decimals).toString(),
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
        convertBalanceToBigint((deposit || '0').toString(), tokenTo.decimals).toString(),
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

    if (positionOpeningMethod === 'range') {
      const { leftInRange, rightInRange } = getTicksInsideRange(left, right, isXtoY);
      leftRange = leftInRange;
      rightRange = rightInRange;
    } else {
      leftRange = left;
      rightRange = right;
    }

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
              getMinTick(poolData.pool_key.fee_tier.tick_spacing),
              Number(midPrice.index) - poolData.pool_key.fee_tier.tick_spacing * 6
            ),
            isXtoY,
            tokenXDecimals,
            tokenYDecimals
          )
      );

      const higherTick = Math.max(
        Number(getMinTick(Number(poolData.pool_key.fee_tier.tick_spacing))),
        Number(midPrice.index) - Number(poolData.pool_key.fee_tier.tick_spacing) * 3
      );

      const lowerTick = Math.min(
        Number(getMaxTick(Number(poolData.pool_key.fee_tier.tick_spacing))),
        Number(midPrice.index) + Number(poolData.pool_key.fee_tier.tick_spacing) * 3
      );

      changeRangeHandler(isXtoY ? higherTick : lowerTick, isXtoY ? lowerTick : higherTick);

      setPlotMin(midPrice.x - initSideDist);
      setPlotMax(midPrice.x + initSideDist);
    } else {
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

  const autoZoomHandler = (left: number, right: number, canZoomCloser: boolean = false) => {
    const leftX = calcPrice(left, isXtoY, tokenFrom.decimals, tokenTo.decimals);
    const rightX = calcPrice(right, isXtoY, tokenFrom.decimals, tokenTo.decimals);

    const higherLeftIndex = Math.max(
      getMinTick(poolData.pool_key.fee_tier.tick_spacing),
      left - poolData.pool_key.fee_tier.tick_spacing * 15
    );

    const lowerLeftIndex = Math.min(
      getMaxTick(poolData.pool_key.fee_tier.tick_spacing),
      left + poolData.pool_key.fee_tier.tick_spacing * 15
    );

    const lowerRightIndex = Math.min(
      getMaxTick(poolData.pool_key.fee_tier.tick_spacing),
      right + poolData.pool_key.fee_tier.tick_spacing * 15
    );

    const higherRightIndex = Math.max(
      getMinTick(poolData.pool_key.fee_tier.tick_spacing),
      right - poolData.pool_key.fee_tier.tick_spacing * 15
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
    if (fee && tokenFrom && tokenTo && poolList) {
      const poolKey = newPoolKey(extractAddress(tokenFrom), extractAddress(tokenTo), fee);
      try {
        const pool = poolList.find((p) => poolKeyToString(p.pool_key) === poolKeyToString(poolKey));
        if (pool) {
          setPoolInfo(pool);
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
        setIsPoolExist(false);
      }
      return;
    } else {
      setIsPoolExist(false);
    }
  };

  const calcAmount = (amount: TokenAmount, left: number, right: number, tokenAddress: string) => {
    if (!poolData.pool_key) return BigInt(0);
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
          poolData.pool_key.fee_tier.tick_spacing,
          isPoolExist ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index),
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
        poolData.pool_key.fee_tier.tick_spacing,
        isPoolExist ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index),
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
        poolData.pool_key.fee_tier.tick_spacing,
        isPoolExist ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index),
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

    const result = calcAmount(amount, left, right, extractDenom(calcToken));

    return trimLeadingZeros(printBigint(result, printToken.decimals));
  };

  useEffect(() => {
    if (isPoolExist && showModal) {
      handleGetTicks();
    }
  }, [isPoolExist, showModal]);

  useEffect(() => {
    if (poolInfo) {
      setMidPrice({
        index: poolInfo.pool.current_tick_index,
        x: calcPrice(Number(poolInfo.pool.current_tick_index), true, tokenFrom.decimals, tokenTo.decimals)
      });
    }
  }, [poolInfo, isXtoY, tokenFrom, tokenTo]);

  const [isFromBlocked, setIsFromBlocked] = useState(false);
  const [isToBlocked, setIsToBlocked] = useState(false);

  useEffect(() => {
    const fromBlocked =
      determinePositionTokenBlock(
        isPoolExist ? BigInt(poolData.pool?.sqrt_price || 0) : calculateSqrtPrice(midPrice.index),
        Math.min(Number(leftRange), Number(rightRange)),
        Math.max(Number(leftRange), Number(rightRange)),
        isXtoY
      ) === PositionTokenBlock.A;

    const toBlocked =
      determinePositionTokenBlock(
        isPoolExist ? BigInt(poolData.pool?.sqrt_price || 0) : calculateSqrtPrice(midPrice.index),
        Math.min(Number(leftRange), Number(rightRange)),
        Math.max(Number(leftRange), Number(rightRange)),
        isXtoY
      ) === PositionTokenBlock.B;

    setIsFromBlocked(fromBlocked);
    setIsToBlocked(toBlocked);
  }, [isPoolExist, poolData, midPrice, leftRange, rightRange, isXtoY]);

  const getButtonMessage = () => {
    if (!walletAddress) {
      return 'Connect wallet';
    }

    if (!toggleZapIn) {
      const isInsufficientTo =
        amountTo && Number(amountTo) > toDisplay(amounts[tokenTo.denom], tokenTo.decimals || CW20_DECIMALS);
      const isInsufficientFrom =
        amountFrom && Number(amountFrom) > toDisplay(amounts[tokenFrom.denom], tokenFrom.decimals || CW20_DECIMALS);

      if (!tokenFrom || !tokenTo) {
        return 'Select tokens';
      }

      if (tokenFrom.denom === tokenTo.denom) {
        return 'Select different tokens';
      }

      if (isInsufficientFrom) {
        return `Insufficient ${tokenFrom.name.toUpperCase()}`;
      }

      if (isInsufficientTo) {
        return `Insufficient ${tokenTo.name.toUpperCase()}`;
      }

      if ((!isFromBlocked && (!amountFrom || +amountFrom === 0)) || (!isToBlocked && (!amountTo || +amountTo === 0))) {
        return 'Liquidity must be greater than 0';
      }
      return 'Create new position';
    } else {
      const isInsufficientZap =
        zapAmount && Number(zapAmount) > toDisplay(amounts[tokenZap.denom], tokenZap.decimals || CW20_DECIMALS);

      if (!tokenZap) {
        return 'Select token';
      }

      if (!zapAmount || +zapAmount === 0) {
        return 'Zap amount must be greater than 0';
      }

      if (simulating) {
        return 'Simulating';
      }

      if (isInsufficientZap) {
        return `Insufficient ${tokenZap.name.toUpperCase()}`;
      }

      return 'Zap in';
    }
  };

  const { zapIn } = useZap();

  const handleZapIn = async () => {
    try {
      if (tokenZap && zapAmount) {
        setLoading(true);
        await zapIn(
          {
            tokenZap,
            zapAmount: new BigDecimal(zapAmount, tokenZap.decimals).mul(10n ** BigInt(tokenZap.decimals)).toString(),
            zapInResponse
          },
          walletAddress,
          (tx: string) => {
            displayToast(TToastType.TX_SUCCESSFUL, {
              customLink: getTransactionUrl('Oraichain', tx)
            });
            // handleSuccessAdd();
            loadOraichainToken(
              walletAddress,
              [tokenZap.contractAddress, tokenFrom.contractAddress, tokenTo.contractAddress].filter(Boolean)
            );
            onCloseModal();
            navigate(`/pools/v3/${encodeURIComponent(poolKeyToString(poolData.pool_key))}`);
          },
          (e) => {
            console.log({ errorZap: e });
            displayToast(TToastType.TX_FAILED, {
              message: 'Add liquidity failed!'
            });
          }
        );
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
      if (process.env.REACT_APP_SENTRY_ENVIRONMENT === 'production') {
        const logEvent = {
          address: walletAddress,
          tokenZap: tokenZap.name,
          tokenFrom: tokenFrom.name,
          tokenTo: tokenTo.name,
          poolData: poolKeyToString(poolData.pool_key),
          zapAmount,
          zapUsd,
          type: 'ZapIn'
        };
        mixpanel.track('Zap PoolV3 oraiDEX', logEvent);
      }
    }
  };

  const { handleInitPosition } = useAddLiquidity();
  const addLiquidity = async (data: InitPositionData) => {
    setLoading(true);

    try {
      await handleInitPosition(
        data,
        walletAddress,
        (tx: string) => {
          displayToast(TToastType.TX_SUCCESSFUL, {
            customLink: getTransactionUrl('Oraichain', tx)
          });
          // handleSuccessAdd();
          loadOraichainToken(walletAddress, [tokenFrom.contractAddress, tokenTo.contractAddress].filter(Boolean));
          onCloseModal();
          navigate(`/pools/v3/${encodeURIComponent(poolKeyToString(data.poolKeyData))}`);
        },
        (e) => {
          displayToast(TToastType.TX_FAILED, {
            message: 'Add liquidity failed!'
          });
        }
      );
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTicks = () => {
    try {
      const fetchTickData = async () => {
        setLoading(true);

        const ticksData = await handleGetCurrentPlotTicks({
          poolKey: poolData.pool_key,
          isXtoY: isXtoY,
          xDecimal: tokenFrom.decimals,
          yDecimal: tokenTo.decimals
        });

        setLiquidityData(ticksData);
      };

      if (isPoolExist && poolData.pool_key) {
        fetchTickData();
      }
    } catch (error) {
      console.log('error: >> liquidity', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateZapIn = async () => {
    setSimulating(true);
    setLoading(true);
    let zapFee = 0;
    let client: CosmWasmClient;
    try {
      client = await CosmWasmClient.connect(network.rpc);
      const zap = new ZapperQueryClient(client, ZAPPER_CONTRACT);
      zapFee = Number((await zap.protocolFee()).percent);
    } catch (error) {
      console.error('Error handleSimulateZapIn fee:', error);
    }

    try {
      const amountAfterFee = Number(zapAmount) * (1 - zapFee);

      const routerApi = 'https://osor.oraidex.io/smart-router/alpha-router';
      const zapper = new ZapConsumer({
        client,
        deviation: 0,
        dexV3Address: network.pool_v3,
        multiCallAddress: MULTICALL_CONTRACT,
        routerApi,
        smartRouteConfig: {
          swapOptions: {
            protocols: ['OraidexV3'],
            maxSplits: 1
          }
        }
      });

      const amountIn = Math.round(amountAfterFee * 10 ** tokenZap.decimals).toString();
      const amountFee = Math.floor(zapFee * Number(zapAmount) * 10 ** tokenZap.decimals);

      setZapFee(amountFee);
      const lowerTick = Math.min(leftRange, rightRange);
      const upperTick = Math.max(leftRange, rightRange);

      const result = await zapper.processZapInPositionLiquidity({
        poolKey: poolData.pool_key,
        tokenIn: tokenZap,
        amountIn: amountIn,
        lowerTick,
        upperTick,
        tokenX: tokenFrom,
        tokenY: tokenTo
      });
      setSwapFee(result.swapFee * 100);
      const inputUsd = extendPrices?.[tokenZap.coinGeckoId] * Number(amountAfterFee);
      const outputUsd =
        extendPrices?.[tokenFrom.coinGeckoId] * (Number(result.amountX) / 10 ** tokenFrom.decimals) +
        extendPrices?.[tokenTo.coinGeckoId] * (Number(result.amountY) / 10 ** tokenTo.decimals);

      const priceImpact = (Math.abs(inputUsd - outputUsd) / inputUsd) * 100;
      const matchRate = 100 - priceImpact;

      const swapFeeInUsd = amountAfterFee * result.swapFee * extendPrices?.[tokenZap.coinGeckoId];
      const zapFeeInUsd = (Number(zapAmount) - amountAfterFee) * extendPrices?.[tokenZap.coinGeckoId];
      const totalFeeInUsd = swapFeeInUsd + zapFeeInUsd;

      setTotalFee(totalFeeInUsd);
      setZapImpactPrice(priceImpact);
      setMatchRate(matchRate);
      setZapInResponse(result);
      setSimulating(false);
    } catch (error) {
      console.log('error', error);

      if (error instanceof RouteNotFoundError) {
        setZapError('No route found, try other tokens or other amount');
      } else if (error instanceof RouteNoLiquidity) {
        setZapError('No liquidity found for the swap route. Cannot proceed with the swap.');
      } else if (error instanceof SpamTooManyRequestsError) {
        setZapError('Too many requests, please try again later, after 1 minute');
      } else {
        console.error('Unexpected error during zap simulation:', error);
        setZapError('An unexpected error occurred, please try again later.');
      }
    } finally {
      setSimulating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [zapInResponse]);

  useEffect(() => {
    console.log(leftRange, rightRange);
    // console.log("debounceZapAmount", debounceZapAmount);
    if (Number(zapAmount) > 0 && toggleZapIn) {
      handleSimulateZapIn();
    }
  }, [debounceZapAmount, leftRange, rightRange]);

  useEffect(() => {
    if (Number(zapAmount) > 0 && !zapInResponse && !simulating) {
      setSimulating(true);
    }
    if (Number(zapAmount) === 0 || !zapAmount) {
      setZapInResponse(null);
    }
  }, [zapAmount, debounceZapAmount]);

  const [formattedPrice, setFormattedPrice] = useState<string>('');

  // const getFormattedPrice = useCallback(
  //   (additionalFormatOpts?: Partial<Intl.NumberFormatOptions & { disabledTrimZeros: boolean }>) => {
  //     console.log("change")
  //     return (
  //       formatPretty(new Dec(chartConfig.hoverPrice), {
  //         maxDecimals: 4,
  //         notation: 'compact',
  //         ...additionalFormatOpts
  //       }) || ''
  //     );
  //   },
  //   [chartConfig.hoverPrice]
  // );

  useEffect(() => {
    if (leftRange && rightRange) {
      const pricePointMin = calcPrice(leftRange, isXtoY, tokenFrom.decimals, tokenTo.decimals);
      const pricePointMax = calcPrice(rightRange, isXtoY, tokenFrom.decimals, tokenTo.decimals);
      console.log('pricePointMin', pricePointMin);
      console.log('pricePointMax', pricePointMax);
      setMinPrice(pricePointMin);
      setMaxPrice(pricePointMax);
    }
  }, [leftRange, rightRange]);

  const correspondTick = (price: number) => {
    const sqrtP = Math.sqrt(price);
    const sqrtPBigInt = BigInt(sqrtP * 1e24);
    const tick = getTickAtSqrtPrice(sqrtPBigInt, poolData.pool_key.fee_tier.tick_spacing);
    return tick;
  };

  useEffect(() => {
    if (minPrice && maxPrice) {
      const left = correspondTick(minPrice);
      const right = correspondTick(maxPrice);
      changeRangeHandler(left, right);
      autoZoomHandler(left, right);
    }
  }, [minPrice, maxPrice]);

  return (
    <div className={styles.createPoolForm}>
      <div className={styles.tab}>
        {(isToBlocked || isFromBlocked) && (
          <div className={classNames(styles.warning)}>
            <div>
              <WarningIcon />
            </div>
            <span>
              Your position will not earn fees or be used in trades until the market price moves into your range.
            </span>
          </div>
        )}
        <div className={styles.item}>
          <div className={styles.priceSectionExisted}>
            <div className={styles.wrapper}>
              <div className={styles.itemTitleWrapper}>
                <p className={styles.itemTitle}>Price Range</p>
                {/* <p className={styles.liquidityActive}>
                  Active Liquidity */}
                {/* <TooltipIcon
              className={styles.tooltipWrapper}
              placement="top"
              visible={openTooltip}
              icon={<TooltipIc />}
              setVisible={setOpenTooltip}
              content={<div className={classNames(styles.tooltip, styles[theme])}>Active Liquidity</div>}
            /> */}
                {/* </p> */}
              </div>
              {/* <div className={styles.itemSwitcherWrapper}>
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
                  {/* <div
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
                  </div> */}
              {/* </div> */}
              {/* </div>  */}
            </div>

            <div className={styles.itemChartAndPriceWrapper}>
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

              <div className={styles.currentPrice}>
                <p>Current Price:</p>
                <span>
                  1 {tokenFrom.name} = {minimize(midPrice.x.toString())} {tokenTo.name}
                </span>
                <span>
                  1 {tokenTo.name} = {minimize((1 / midPrice.x).toString())} {tokenFrom.name}
                </span>
              </div>

              <div className={styles.minMaxPriceWrapper}>
                <div className={styles.item}>
                  <div className={styles.minMaxPrice}>
                    <div className={styles.minMaxPriceTitle}>
                      <p>Min Price</p>
                    </div>
                    <div className={styles.minMaxPriceValue}>
                      <p>
                        <p>{minimize(leftInputRounded)}</p>
                        {/* <p>{numberWithCommas(Number(leftInputRounded), undefined, { maximumFractionDigits: 6 })}</p> */}
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
                        {/* <p>{numberWithCommas(Number(rightInputRounded), undefined, { maximumFractionDigits: 6 })}</p> */}
                        <p>{minimize(rightInputRounded)}</p>
                        <p className={styles.pair}>
                          {tokenTo.name.toUpperCase()} / {tokenFrom.name.toUpperCase()}
                        </p>
                      </p>
                    </div>
                  </div>
                  <div className={classNames(styles.percent, styles.maxCurrentPrice)}>
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
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tab}>
        <div className={styles.options}>
          <button
            className={classNames(styles.btnOption, { [styles.activeBtn]: toggleZapIn })}
            onClick={() => setToggleZapIn(true)}
          >
            Zap In
            <span>BETA</span>
          </button>
          <button
            className={classNames(styles.btnOption, { [styles.activeBtn]: !toggleZapIn })}
            onClick={() => setToggleZapIn(false)}
          >
            Manual Deposit
          </button>
        </div>

        {toggleZapIn ? (
          <>
            <div className={styles.introZap}>
              <IconInfo />
              <span>
                Zap In: Instantly swap your chosen token for two pool tokens and provide liquidity to the pool, all in
                one seamless transaction.
              </span>
            </div>
            <div className={classNames(styles.itemInput, { [styles.disabled]: false })}>
              <div className={styles.balance}>
                <p className={styles.bal}>
                  <span>Balance:</span>{' '}
                  {numberWithCommas(toDisplay(amounts[tokenZap?.denom] || '0', tokenZap.decimals))} {tokenZap?.name}
                </p>
                <div className={styles.btnGroup}>
                  <button
                    className=""
                    disabled={!tokenZap}
                    onClick={() => {
                      const val = toDisplay(amounts[tokenZap?.denom] || '0', tokenZap.decimals);
                      const haftValue = new BigDecimal(val).div(2).toNumber();
                      setZapAmount(haftValue);
                      setFocusId('zapper');
                    }}
                  >
                    50%
                  </button>
                  <button
                    className=""
                    disabled={!tokenZap}
                    onClick={() => {
                      const val = toDisplay(amounts[tokenZap?.denom] || '0', tokenZap.decimals);
                      setZapAmount(val);
                      setFocusId('zapper');
                    }}
                  >
                    100%
                  </button>
                </div>
              </div>
              <div className={styles.tokenInfo}>
                {/* <div className={styles.name}> */}
                <SelectToken
                  token={tokenZap}
                  handleChangeToken={(token) => {
                    setTokenZap(token);
                    setZapAmount(0);
                  }}
                  otherTokenDenom={tokenZap?.denom}
                  customClassButton={styles.name}
                />
                {/* </div> */}
                <div className={styles.input}>
                  <NumberFormat
                    onFocus={() => setFocusId('zapper')}
                    onBlur={() => setFocusId(null)}
                    placeholder="0"
                    thousandSeparator
                    className={styles.amount}
                    decimalScale={tokenZap?.decimals || 6}
                    disabled={false}
                    type="text"
                    value={zapAmount}
                    onChange={() => {}}
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      // allow !floatValue to let user can clear their input
                      return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                    }}
                    onValueChange={({ floatValue }) => {
                      setZapAmount(floatValue);
                    }}
                  />
                  <div className={styles.usd}>
                    ≈ $
                    {zapAmount
                      ? numberWithCommas(Number(zapUsd) || 0, undefined, { maximumFractionDigits: tokenZap.decimals })
                      : 0}
                  </div>
                </div>
              </div>
            </div>
            {simulating && (
              <div>
                <span style={{ fontStyle: 'italic', fontSize: 'small', color: 'white' }}>
                  <ZappingText text={'Finding best option to zap'} dot={5} />
                </span>
              </div>
            )}

            {zapError && (
              <div className={styles.errorZap}>
                <ErrorIcon />
                <span>{zapError}</span>
              </div>
            )}
            {!zapError && zapInResponse && !simulating && (
              <>
                <div className={styles.dividerOut}>
                  <div className={styles.bar}></div>
                  <div>
                    <OutputIcon />
                  </div>
                  <div className={styles.bar}></div>
                </div>
                <div className={styles.tokenOutput}>
                  <div className={styles.item}>
                    <div className={styles.info}>
                      <div className={styles.infoIcon}>{TokenFromIcon}</div>
                      <span>{tokenFrom.name}</span>
                    </div>
                    <div className={styles.value}>
                      {simulating && <div className={styles.mask} />}
                      <span>
                        {zapInResponse
                          ? numberWithCommas(Number(zapInResponse.amountX) / 10 ** tokenFrom.decimals, undefined, {
                              maximumFractionDigits: 3
                            })
                          : 0}
                      </span>
                      <span className={styles.usd}>
                        ≈ $
                        {zapInResponse
                          ? numberWithCommas(Number(xUsd) || 0, undefined, {
                              maximumFractionDigits: 3
                            })
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.info}>
                      <div className={styles.infoIcon}>{TokenToIcon}</div>
                      <span>{tokenTo.name}</span>
                    </div>
                    <div className={styles.value}>
                      {simulating && <div className={styles.mask} />}
                      <span>
                        {zapInResponse
                          ? numberWithCommas(Number(zapInResponse.amountY) / 10 ** tokenTo.decimals, undefined, {
                              maximumFractionDigits: 3
                            })
                          : 0}
                      </span>
                      <span className={styles.usd}>
                        ≈ $
                        {zapInResponse
                          ? numberWithCommas(Number(yUsd) || 0, undefined, { maximumFractionDigits: 3 })
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.feeInfoWrapper}>
                  <div className={styles.item}>
                    <div className={styles.info}>
                      <span>Price Impact</span>
                    </div>
                    <div
                      className={cx(
                        'valueImpact',
                        `${zapImpactPrice >= 10 ? 'valueImpact-high' : zapImpactPrice >= 5 ? 'valueImpact-medium' : ''}`
                      )}
                    >
                      <span>{numberWithCommas(zapImpactPrice, undefined, { maximumFractionDigits: 2 }) ?? 0}%</span>
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.info}>
                      <span>Swap Fee</span>
                    </div>
                    <div className={styles.value}>
                      <span>{numberWithCommas(swapFee, undefined, { maximumFractionDigits: 2 })} %</span>
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.info}>
                      <TooltipHover
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        content={<div>The amount of token you'll swap to provide liquidity.</div>}
                        position="right"
                        children={<span>Zap Fee</span>}
                      />
                    </div>
                    <div className={styles.value}>
                      <span>
                        {numberWithCommas(zapFee / 10 ** tokenZap.decimals, undefined, {
                          maximumFractionDigits: tokenZap.decimals
                        })}{' '}
                        {tokenZap.name}
                      </span>
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.conclusion}>
                      <span>Total Fee</span>
                    </div>
                    <div className={styles.value}>
                      <span>${numberWithCommas(totalFee, undefined, { maximumFractionDigits: 4 }) ?? 0}</span>
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.conclusion}>
                      <span>Match Rate</span>
                    </div>
                    <div className={styles.value}>
                      <span>{numberWithCommas(matchRate, undefined, { maximumFractionDigits: 2 }) ?? 0} %</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div ref={endRef}></div>
          </>
        ) : (
          <>
            <div className={classNames(styles.itemInput, { [styles.disabled]: isFromBlocked })}>
              <div className={styles.balance}>
                <p className={styles.bal}>
                  <span>Balance:</span>{' '}
                  {numberWithCommas(toDisplay(amounts[tokenFrom?.denom] || '0', tokenFrom.decimals))} {tokenFrom?.name}
                </p>
                <div className={styles.btnGroup}>
                  <button
                    className=""
                    disabled={!tokenFrom}
                    onClick={() => {
                      const val = toDisplay(amounts[tokenFrom?.denom] || '0', tokenFrom.decimals);
                      const haftValue = new BigDecimal(val).div(2).toNumber();
                      setAmountFrom(haftValue);
                      setFocusId('from');
                    }}
                  >
                    50%
                  </button>
                  <button
                    className=""
                    disabled={!tokenFrom}
                    onClick={() => {
                      const val = toDisplay(amounts[tokenFrom?.denom] || '0', tokenFrom.decimals);
                      setAmountFrom(val);
                      setFocusId('from');
                    }}
                  >
                    100%
                  </button>
                </div>
              </div>
              <div className={styles.tokenInfo}>
                <div className={styles.name}>
                  {TokenFromIcon ? (
                    <>
                      {TokenFromIcon}
                      &nbsp;{tokenFrom.name}
                    </>
                  ) : (
                    'Select Token'
                  )}
                </div>
                <div className={styles.input}>
                  <NumberFormat
                    onFocus={() => setFocusId('from')}
                    onBlur={() => setFocusId(null)}
                    placeholder="0"
                    thousandSeparator
                    className={styles.amount}
                    decimalScale={tokenFrom?.decimals || 6}
                    disabled={isFromBlocked}
                    type="text"
                    value={amountFrom}
                    onChange={() => {}}
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      // allow !floatValue to let user can clear their input
                      return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                    }}
                    onValueChange={({ floatValue }) => {
                      setAmountFrom(floatValue);
                    }}
                  />
                  <div className={styles.usd}>
                    ≈ $
                    {amountFrom ? numberWithCommas(Number(fromUsd) || 0, undefined, { maximumFractionDigits: 6 }) : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames(styles.itemInput, { [styles.disabled]: isToBlocked })}>
              <div className={styles.balance}>
                <p className={styles.bal}>
                  <span>Balance:</span> {numberWithCommas(toDisplay(amounts[tokenTo?.denom] || '0', tokenTo.decimals))}{' '}
                  {tokenTo?.name}
                </p>
                <div className={styles.btnGroup}>
                  <button
                    className=""
                    disabled={!tokenTo}
                    onClick={() => {
                      const val = toDisplay(amounts[tokenTo?.denom] || '0', tokenTo.decimals);
                      const haftValue = new BigDecimal(val).div(2).toNumber();
                      setAmountTo(haftValue);
                      setFocusId('to');
                    }}
                  >
                    50%
                  </button>
                  <button
                    className=""
                    disabled={!tokenTo}
                    onClick={() => {
                      const val = toDisplay(amounts[tokenTo?.denom] || '0', tokenTo.decimals);
                      setAmountTo(val);
                      setFocusId('to');
                    }}
                  >
                    100%
                  </button>
                </div>
              </div>
              <div className={styles.tokenInfo}>
                <div className={styles.name}>
                  {TokenToIcon ? (
                    <>
                      {TokenToIcon}
                      &nbsp;{tokenTo.name}
                    </>
                  ) : (
                    'Select Token'
                  )}
                </div>
                <div className={styles.input}>
                  <NumberFormat
                    onFocus={() => setFocusId('to')}
                    onBlur={() => setFocusId(null)}
                    placeholder="0"
                    thousandSeparator
                    className={styles.amount}
                    decimalScale={tokenTo?.decimals || 6}
                    disabled={isToBlocked}
                    type="text"
                    value={amountTo}
                    onChange={() => {}}
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      // allow !floatValue to let user can clear their input
                      return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                    }}
                    onValueChange={({ floatValue }) => {
                      setAmountTo(floatValue);
                    }}
                  />
                  <div className={styles.usd}>
                    ≈ ${amountTo ? numberWithCommas(Number(toUsd) || 0, undefined, { maximumFractionDigits: 6 }) : 0}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.btn}>
          {(() => {
            const btnText = getButtonMessage();
            return (
              <Button
                type="primary"
                disabled={
                  loading ||
                  !walletAddress ||
                  !(btnText === 'Zap in' || btnText === 'Create new position') ||
                  !!zapError
                  // true
                }
                onClick={async () => {
                  const lowerTick = Math.min(leftRange, rightRange);
                  const upperTick = Math.max(leftRange, rightRange);
                  const poolKeyData = newPoolKey(extractDenom(tokenFrom), extractDenom(tokenTo), feeTier);

                  if (toggleZapIn) {
                    await handleZapIn();
                    return;
                  }

                  await addLiquidity({
                    poolKeyData,
                    lowerTick: lowerTick,
                    upperTick: upperTick,
                    liquidityDelta: liquidityRef.current,
                    spotSqrtPrice: isPoolExist
                      ? BigInt(poolData.pool?.sqrt_price || 0)
                      : calculateSqrtPrice(midPrice.index),
                    slippageTolerance: BigInt(slippage),
                    tokenXAmount:
                      poolKeyData.token_x === extractAddress(tokenFrom)
                        ? BigInt(Math.round(Number(amountFrom) * 10 ** (tokenFrom.decimals || 6)))
                        : BigInt(Math.round(Number(amountTo) * 10 ** (tokenTo.decimals || 6))),
                    tokenYAmount:
                      poolKeyData.token_y === extractAddress(tokenFrom)
                        ? BigInt(Math.round(Number(amountFrom) * 10 ** (tokenFrom.decimals || 6)))
                        : BigInt(Math.round(Number(amountTo) * 10 ** (tokenTo.decimals || 6))),
                    initPool: !isPoolExist
                  });
                }}
              >
                {loading && <Loader width={22} height={22} />}&nbsp;&nbsp;{btnText}
              </Button>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

const AddLiquidityConfig = {
  fullRange: false,
  rangeWithCurrencyDecimals: [new Dec(0.484820000000000001), new Dec(0.641000000000000001)],
  currentPriceWithDecimals: 0.5284821950442445
};

const PriceChartData = {
  // range on y-axis
  yRange: [0.4215826086956522, 0.7371500000000001],
  // history data
  historicalChartData: [
    {
      time: 1727769600000,
      close: 0.614968711
    },
    {
      time: 1727773200000,
      close: 0.610095399
    },
    {
      time: 1727776800000,
      close: 0.611702955
    },
    {
      time: 1727780400000,
      close: 0.613504411
    },
    {
      time: 1727784000000,
      close: 0.612750455
    },
    {
      time: 1727787600000,
      close: 0.610511149
    },
    {
      time: 1727791200000,
      close: 0.599490928
    },
    {
      time: 1727794800000,
      close: 0.577520034
    },
    {
      time: 1727798400000,
      close: 0.572584208
    },
    {
      time: 1727802000000,
      close: 0.561122093
    },
    {
      time: 1727805600000,
      close: 0.553899985
    },
    {
      time: 1727809200000,
      close: 0.557028733
    },
    {
      time: 1727812800000,
      close: 0.554456796
    },
    {
      time: 1727816400000,
      close: 0.553707833
    },
    {
      time: 1727820000000,
      close: 0.554142082
    },
    {
      time: 1727823600000,
      close: 0.546444299
    },
    {
      time: 1727827200000,
      close: 0.547832966
    },
    {
      time: 1727830800000,
      close: 0.554160453
    },
    {
      time: 1727834400000,
      close: 0.558299994
    },
    {
      time: 1727838000000,
      close: 0.558499873
    },
    {
      time: 1727841600000,
      close: 0.559539057
    },
    {
      time: 1727845200000,
      close: 0.557107811
    },
    {
      time: 1727848800000,
      close: 0.556811104
    },
    {
      time: 1727852400000,
      close: 0.566232173
    },
    {
      time: 1727856000000,
      close: 0.565631659
    },
    {
      time: 1727859600000,
      close: 0.567352144
    },
    {
      time: 1727863200000,
      close: 0.554762952
    },
    {
      time: 1727866800000,
      close: 0.554763335
    },
    {
      time: 1727870400000,
      close: 0.554820934
    },
    {
      time: 1727874000000,
      close: 0.549273955
    },
    {
      time: 1727877600000,
      close: 0.550082766
    },
    {
      time: 1727881200000,
      close: 0.548197936
    },
    {
      time: 1727884800000,
      close: 0.553862419
    },
    {
      time: 1727888400000,
      close: 0.552358939
    },
    {
      time: 1727892000000,
      close: 0.550483549
    },
    {
      time: 1727895600000,
      close: 0.536168126
    },
    {
      time: 1727899200000,
      close: 0.534897709
    },
    {
      time: 1727902800000,
      close: 0.542405283
    },
    {
      time: 1727906400000,
      close: 0.538795559
    },
    {
      time: 1727910000000,
      close: 0.538356766
    },
    {
      time: 1727913600000,
      close: 0.538554943
    },
    {
      time: 1727917200000,
      close: 0.537057439
    },
    {
      time: 1727920800000,
      close: 0.540283072
    },
    {
      time: 1727924400000,
      close: 0.543476082
    },
    {
      time: 1727928000000,
      close: 0.546079759
    },
    {
      time: 1727931600000,
      close: 0.545495619
    },
    {
      time: 1727935200000,
      close: 0.540542871
    },
    {
      time: 1727938800000,
      close: 0.543477519
    },
    {
      time: 1727942400000,
      close: 0.536991097
    },
    {
      time: 1727946000000,
      close: 0.52428201
    },
    {
      time: 1727949600000,
      close: 0.53175839
    },
    {
      time: 1727953200000,
      close: 0.537364286
    },
    {
      time: 1727956800000,
      close: 0.529600807
    },
    {
      time: 1727960400000,
      close: 0.526269958
    },
    {
      time: 1727964000000,
      close: 0.522772611
    },
    {
      time: 1727967600000,
      close: 0.518853833
    },
    {
      time: 1727971200000,
      close: 0.517539747
    },
    {
      time: 1727974800000,
      close: 0.510840433
    },
    {
      time: 1727978400000,
      close: 0.514085167
    },
    {
      time: 1727982000000,
      close: 0.513559459
    },
    {
      time: 1727985600000,
      close: 0.518098451
    },
    {
      time: 1727989200000,
      close: 0.516753579
    },
    {
      time: 1727992800000,
      close: 0.518288153
    },
    {
      time: 1727996400000,
      close: 0.516739924
    },
    {
      time: 1728000000000,
      close: 0.516584144
    },
    {
      time: 1728003600000,
      close: 0.514429024
    },
    {
      time: 1728007200000,
      close: 0.524838381
    },
    {
      time: 1728010800000,
      close: 0.524696361
    },
    {
      time: 1728014400000,
      close: 0.522402737
    },
    {
      time: 1728018000000,
      close: 0.524696568
    },
    {
      time: 1728021600000,
      close: 0.52847649
    },
    {
      time: 1728025200000,
      close: 0.527790575
    },
    {
      time: 1728028800000,
      close: 0.529440555
    },
    {
      time: 1728032400000,
      close: 0.531739756
    },
    {
      time: 1728036000000,
      close: 0.531284497
    },
    {
      time: 1728039600000,
      close: 0.527580033
    },
    {
      time: 1728043200000,
      close: 0.530724525
    },
    {
      time: 1728046800000,
      close: 0.531408747
    },
    {
      time: 1728050400000,
      close: 0.529527038
    },
    {
      time: 1728054000000,
      close: 0.526574066
    },
    {
      time: 1728057600000,
      close: 0.536044085
    },
    {
      time: 1728061200000,
      close: 0.545762373
    },
    {
      time: 1728064800000,
      close: 0.546162998
    },
    {
      time: 1728068400000,
      close: 0.547789977
    },
    {
      time: 1728072000000,
      close: 0.54715659
    },
    {
      time: 1728075600000,
      close: 0.547398449
    },
    {
      time: 1728079200000,
      close: 0.546884288
    },
    {
      time: 1728082800000,
      close: 0.546890132
    },
    {
      time: 1728086400000,
      close: 0.54867838
    },
    {
      time: 1728090000000,
      close: 0.554137904
    },
    {
      time: 1728093600000,
      close: 0.55437151
    },
    {
      time: 1728097200000,
      close: 0.548063302
    },
    {
      time: 1728100800000,
      close: 0.548791599
    },
    {
      time: 1728104400000,
      close: 0.551309954
    },
    {
      time: 1728108000000,
      close: 0.554695744
    },
    {
      time: 1728111600000,
      close: 0.557297402
    },
    {
      time: 1728115200000,
      close: 0.553131896
    },
    {
      time: 1728118800000,
      close: 0.557460139
    },
    {
      time: 1728122400000,
      close: 0.56208737
    },
    {
      time: 1728126000000,
      close: 0.557510124
    },
    {
      time: 1728129600000,
      close: 0.558321799
    },
    {
      time: 1728133200000,
      close: 0.560266386
    },
    {
      time: 1728136800000,
      close: 0.553571622
    },
    {
      time: 1728140400000,
      close: 0.553518112
    },
    {
      time: 1728144000000,
      close: 0.553960901
    },
    {
      time: 1728147600000,
      close: 0.549720917
    },
    {
      time: 1728151200000,
      close: 0.551671452
    },
    {
      time: 1728154800000,
      close: 0.548572496
    },
    {
      time: 1728158400000,
      close: 0.545532851
    },
    {
      time: 1728162000000,
      close: 0.541493595
    },
    {
      time: 1728165600000,
      close: 0.545140272
    },
    {
      time: 1728169200000,
      close: 0.551089909
    },
    {
      time: 1728172800000,
      close: 0.550906309
    },
    {
      time: 1728176400000,
      close: 0.54946156
    },
    {
      time: 1728180000000,
      close: 0.551161586
    },
    {
      time: 1728183600000,
      close: 0.547770489
    },
    {
      time: 1728187200000,
      close: 0.545281721
    },
    {
      time: 1728190800000,
      close: 0.54093613
    },
    {
      time: 1728194400000,
      close: 0.541996148
    },
    {
      time: 1728198000000,
      close: 0.542470644
    },
    {
      time: 1728201600000,
      close: 0.543228807
    },
    {
      time: 1728205200000,
      close: 0.544115761
    },
    {
      time: 1728208800000,
      close: 0.545102106
    },
    {
      time: 1728212400000,
      close: 0.543382806
    },
    {
      time: 1728216000000,
      close: 0.544709051
    },
    {
      time: 1728219600000,
      close: 0.540436666
    },
    {
      time: 1728223200000,
      close: 0.54352557
    },
    {
      time: 1728226800000,
      close: 0.550759553
    },
    {
      time: 1728230400000,
      close: 0.547252676
    },
    {
      time: 1728234000000,
      close: 0.544715665
    },
    {
      time: 1728237600000,
      close: 0.543991448
    },
    {
      time: 1728241200000,
      close: 0.545722212
    },
    {
      time: 1728244800000,
      close: 0.543358761
    },
    {
      time: 1728248400000,
      close: 0.543312014
    },
    {
      time: 1728252000000,
      close: 0.539859453
    },
    {
      time: 1728255600000,
      close: 0.543126499
    },
    {
      time: 1728259200000,
      close: 0.550047628
    },
    {
      time: 1728262800000,
      close: 0.559166701
    },
    {
      time: 1728266400000,
      close: 0.565128969
    },
    {
      time: 1728270000000,
      close: 0.560940461
    },
    {
      time: 1728273600000,
      close: 0.562867829
    },
    {
      time: 1728277200000,
      close: 0.560381161
    },
    {
      time: 1728280800000,
      close: 0.559541151
    },
    {
      time: 1728284400000,
      close: 0.563255745
    },
    {
      time: 1728288000000,
      close: 0.558492065
    },
    {
      time: 1728291600000,
      close: 0.563282428
    },
    {
      time: 1728295200000,
      close: 0.550904982
    },
    {
      time: 1728298800000,
      close: 0.543989685
    },
    {
      time: 1728302400000,
      close: 0.550510796
    },
    {
      time: 1728306000000,
      close: 0.546943806
    },
    {
      time: 1728309600000,
      close: 0.551934503
    },
    {
      time: 1728313200000,
      close: 0.557322766
    },
    {
      time: 1728316800000,
      close: 0.552714144
    },
    {
      time: 1728320400000,
      close: 0.558494194
    },
    {
      time: 1728324000000,
      close: 0.558336175
    },
    {
      time: 1728327600000,
      close: 0.545811321
    },
    {
      time: 1728331200000,
      close: 0.548724409
    },
    {
      time: 1728334800000,
      close: 0.545012516
    },
    {
      time: 1728338400000,
      close: 0.548501834
    },
    {
      time: 1728342000000,
      close: 0.53982507
    },
    {
      time: 1728345600000,
      close: 0.533514925
    },
    {
      time: 1728349200000,
      close: 0.536428296
    },
    {
      time: 1728352800000,
      close: 0.536882461
    },
    {
      time: 1728356400000,
      close: 0.53538019
    },
    {
      time: 1728360000000,
      close: 0.536234726
    },
    {
      time: 1728363600000,
      close: 0.534807194
    },
    {
      time: 1728367200000,
      close: 0.530086346
    },
    {
      time: 1728370800000,
      close: 0.530178979
    },
    {
      time: 1728374400000,
      close: 0.527769582
    },
    {
      time: 1728378000000,
      close: 0.526281454
    }
  ],
  // latest chart data
  lastChartData: {
    close: 0.5262895941172561,
    time: 1728375698066
  },
  historicalRange: '7D'
};

const ConcentrateChartData = {
  min: 0.48482000000000003, // lower range
  max: 0.641, // upper range
  yRange: [0.4215826086956522, 0.7371500000000001], // y-axis range
  xRange: [0, 1213061533758.7393], // 0 -> max liquidity of a tick
  // tick data info
  data: [
    {
      price: 0.4215826086956522,
      depth: 361588874679.61707
    },
    {
      price: 0.43736097826086956,
      depth: 295157736727.5964
    },
    {
      price: 0.45313934782608695,
      depth: 309347145233.94055
    },
    {
      price: 0.46891771739130433,
      depth: 368820514583.27124
    },
    {
      price: 0.4846960869565217,
      depth: 417105281991.9579
    },
    {
      price: 0.5004744565217392,
      depth: 494405645980.23596
    },
    {
      price: 0.5162528260869566,
      depth: 889552977073.7444
    },
    {
      price: 0.5320311956521739,
      depth: 992309793971.4576
    },
    {
      price: 0.5478095652173913,
      depth: 959832109017.2087
    },
    {
      price: 0.5635879347826087,
      depth: 891904678661.5216
    },
    {
      price: 0.5793663043478261,
      depth: 836913206483.5969
    },
    {
      price: 0.5951446739130435,
      depth: 763700036222.9612
    },
    {
      price: 0.6109230434782609,
      depth: 903270101065.6025
    },
    {
      price: 0.6267014130434783,
      depth: 874286673662.867
    },
    {
      price: 0.6424797826086956,
      depth: 887203497670.5289
    },
    {
      price: 0.658258152173913,
      depth: 1010884611465.6161
    },
    {
      price: 0.6740365217391304,
      depth: 825819915528.4487
    },
    {
      price: 0.6898148913043478,
      depth: 718772475791.6271
    },
    {
      price: 0.7055932608695652,
      depth: 424689731570.51654
    },
    {
      price: 0.7213716304347826,
      depth: 397160923389.60565
    },
    {
      price: 0.73715,
      depth: 367246951558.62726
    }
  ],
  // current price
  annotationDatum: {
    price: 0.5277044586985559,
    depth: 1213061533758.7393
  },
  // position of the chart
  offset: {
    top: 0,
    right: 36,
    bottom: 52,
    left: 0
  },
  // option full range
  fullRange: false
};

export default CreatePositionForm;
