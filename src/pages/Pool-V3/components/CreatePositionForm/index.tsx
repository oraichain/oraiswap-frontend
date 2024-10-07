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
import { FC, useEffect, useMemo, useRef, useState } from 'react';
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
import HistoricalPriceChart from '../HistoricalPriceChart';
import { ConcentratedLiquidityDepthChart } from '../ConcentratedLiquidityDepthChart';
import { Dec } from '@keplr-wallet/unit';

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
              Number(midPrice.index) - poolData.pool_key.fee_tier.tick_spacing * 15
            ),
            isXtoY,
            tokenXDecimals,
            tokenYDecimals
          )
      );

      const higherTick = Math.max(
        Number(getMinTick(Number(poolData.pool_key.fee_tier.tick_spacing))),
        Number(midPrice.index) - Number(poolData.pool_key.fee_tier.tick_spacing) * 10
      );

      const lowerTick = Math.min(
        Number(getMaxTick(Number(poolData.pool_key.fee_tier.tick_spacing))),
        Number(midPrice.index) + Number(poolData.pool_key.fee_tier.tick_spacing) * 10
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
                <div className={styles.chartPrice}>
                  <HistoricalPriceChart
                    data={PriceChartData.historicalChartData}
                    annotations={[]}
                    domain={PriceChartData.yRange as [number, number]}
                    onPointerHover={PriceChartData.setHoverPrice}
                    onPointerOut={() => {
                      if (PriceChartData.lastChartData) {
                        PriceChartData.setHoverPrice(Number(PriceChartData.currentPrice.toString()));
                      }
                    }}
                  />
                </div>
                <div className={styles.chartLiquid}>
                  <div className={styles.chart}>
                    <ConcentratedLiquidityDepthChart
                      yRange={LiquidityChartData.yRange as [number, number]}
                      xRange={LiquidityChartData.xRange as [number, number]}
                      data={LiquidityChartData.data}
                      annotationDatum={{
                        price: PriceChartData.currentPrice ? Number(PriceChartData.currentPrice.toString()) : PriceChartData.lastChartData?.close ?? 0,
                        depth: LiquidityChartData.xRange[1]
                      }}
                      // offset={{
                      //   top: 0,
                      //   right: PriceChartData.currentPrice ? ((new Dec(BigInt(PriceChartData.currentPrice.int))).gt(new Dec(100)) ? 120 : 56) : 36,
                      //   bottom: 24 + 28,
                      //   left: 0
                      // }}
                      horizontal
                    />
                  </div>
                </div>
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

const PriceChartData = {
  historicalChartData: [
    {
      time: 1727683200000,
      close: 0.645432804,
      high: 0.646862394,
      low: 0.641400047,
      open: 0.641401486
    },
    {
      time: 1727686800000,
      close: 0.641100071,
      high: 0.645433467,
      low: 0.638103755,
      open: 0.645432804
    },
    {
      time: 1727690400000,
      close: 0.632041363,
      high: 0.641100071,
      low: 0.632041363,
      open: 0.641100071
    },
    {
      time: 1727694000000,
      close: 0.628485999,
      high: 0.631949723,
      low: 0.626078023,
      open: 0.631587232
    },
    {
      time: 1727697600000,
      close: 0.631158218,
      high: 0.631196468,
      low: 0.628484964,
      open: 0.628485999
    },
    {
      time: 1727701200000,
      close: 0.63337885,
      high: 0.633454877,
      low: 0.629772925,
      open: 0.631158594
    },
    {
      time: 1727704800000,
      close: 0.632611534,
      high: 0.634964894,
      low: 0.63198684,
      open: 0.63337885
    },
    {
      time: 1727708400000,
      close: 0.627001857,
      high: 0.632611463,
      low: 0.625349377,
      open: 0.632611463
    },
    {
      time: 1727712000000,
      close: 0.620067857,
      high: 0.627624116,
      low: 0.619847941,
      open: 0.627001966
    },
    {
      time: 1727715600000,
      close: 0.617066343,
      high: 0.621642994,
      low: 0.61645525,
      open: 0.620372803
    },
    {
      time: 1727719200000,
      close: 0.619389844,
      high: 0.619925614,
      low: 0.616059344,
      open: 0.616935396
    },
    {
      time: 1727722800000,
      close: 0.620385404,
      high: 0.622050729,
      low: 0.615602989,
      open: 0.619389924
    },
    {
      time: 1727726400000,
      close: 0.620998589,
      high: 0.620999906,
      low: 0.619371213,
      open: 0.620385601
    },
    {
      time: 1727730000000,
      close: 0.622845321,
      high: 0.624443582,
      low: 0.62099835,
      open: 0.620998628
    },
    {
      time: 1727733600000,
      close: 0.620341294,
      high: 0.623339724,
      low: 0.620079599,
      open: 0.622845744
    },
    {
      time: 1727737200000,
      close: 0.605342527,
      high: 0.620341075,
      low: 0.604703338,
      open: 0.620341075
    },
    {
      time: 1727740800000,
      close: 0.598533458,
      high: 0.605167665,
      low: 0.596264815,
      open: 0.605166396
    },
    {
      time: 1727744400000,
      close: 0.600516523,
      high: 0.60061604,
      low: 0.593225658,
      open: 0.598533632
    },
    {
      time: 1727748000000,
      close: 0.603370027,
      high: 0.6033791,
      low: 0.600516523,
      open: 0.600516523
    },
    {
      time: 1727751600000,
      close: 0.601739897,
      high: 0.603370027,
      low: 0.599020077,
      open: 0.603370027
    },
    {
      time: 1727755200000,
      close: 0.606779312,
      high: 0.606941747,
      low: 0.601924926,
      open: 0.601924926
    },
    {
      time: 1727758800000,
      close: 0.609628116,
      high: 0.611024857,
      low: 0.605543921,
      open: 0.606779312
    },
    {
      time: 1727762400000,
      close: 0.606147619,
      high: 0.609631956,
      low: 0.605361974,
      open: 0.609629975
    },
    {
      time: 1727766000000,
      close: 0.612089506,
      high: 0.612341912,
      low: 0.606147397,
      open: 0.606147619
    },
    {
      time: 1727769600000,
      close: 0.614968711,
      high: 0.615817002,
      low: 0.611439341,
      open: 0.612089683
    },
    {
      time: 1727773200000,
      close: 0.610095399,
      high: 0.614968711,
      low: 0.609508381,
      open: 0.614968711
    },
    {
      time: 1727776800000,
      close: 0.611702955,
      high: 0.612778151,
      low: 0.609439597,
      open: 0.610095993
    },
    {
      time: 1727780400000,
      close: 0.613504411,
      high: 0.613504411,
      low: 0.610840637,
      open: 0.611702955
    },
    {
      time: 1727784000000,
      close: 0.612750455,
      high: 0.616205315,
      low: 0.612114273,
      open: 0.613504411
    },
    {
      time: 1727787600000,
      close: 0.610511149,
      high: 0.613632661,
      low: 0.609856924,
      open: 0.612644693
    },
    {
      time: 1727791200000,
      close: 0.599490928,
      high: 0.61051119,
      low: 0.592334676,
      open: 0.610511149
    },
    {
      time: 1727794800000,
      close: 0.577520034,
      high: 0.599497486,
      low: 0.576225628,
      open: 0.599490651
    },
    {
      time: 1727798400000,
      close: 0.572584208,
      high: 0.577521971,
      low: 0.557852418,
      open: 0.577521971
    },
    {
      time: 1727802000000,
      close: 0.561122093,
      high: 0.574498968,
      low: 0.557736566,
      open: 0.572581944
    },
    {
      time: 1727805600000,
      close: 0.553899985,
      high: 0.561122437,
      low: 0.537201533,
      open: 0.561122437
    },
    {
      time: 1727809200000,
      close: 0.557028733,
      high: 0.561197125,
      low: 0.553890765,
      open: 0.553899501
    },
    {
      time: 1727812800000,
      close: 0.554456796,
      high: 0.56008123,
      low: 0.554278236,
      open: 0.557028733
    },
    {
      time: 1727816400000,
      close: 0.553707833,
      high: 0.554978965,
      low: 0.54565831,
      open: 0.554480094
    },
    {
      time: 1727820000000,
      close: 0.554142082,
      high: 0.555803265,
      low: 0.54877553,
      open: 0.553707917
    },
    {
      time: 1727823600000,
      close: 0.546444299,
      high: 0.554915377,
      low: 0.544758875,
      open: 0.554142082
    },
    {
      time: 1727827200000,
      close: 0.547832966,
      high: 0.548052305,
      low: 0.54530266,
      open: 0.546444299
    },
    {
      time: 1727830800000,
      close: 0.554160453,
      high: 0.555301187,
      low: 0.544755226,
      open: 0.547832554
    },
    {
      time: 1727834400000,
      close: 0.558299994,
      high: 0.558799677,
      low: 0.553556303,
      open: 0.554161675
    },
    {
      time: 1727838000000,
      close: 0.558499873,
      high: 0.558954207,
      low: 0.556622518,
      open: 0.558299979
    },
    {
      time: 1727841600000,
      close: 0.559539057,
      high: 0.560064205,
      low: 0.557530875,
      open: 0.558499873
    },
    {
      time: 1727845200000,
      close: 0.557107811,
      high: 0.559539057,
      low: 0.556844063,
      open: 0.559539057
    },
    {
      time: 1727848800000,
      close: 0.556811104,
      high: 0.560442491,
      low: 0.55673967,
      open: 0.557107811
    },
    {
      time: 1727852400000,
      close: 0.566232173,
      high: 0.566467436,
      low: 0.55574168,
      open: 0.556811034
    },
    {
      time: 1727856000000,
      close: 0.565631659,
      high: 0.567941839,
      low: 0.562979753,
      open: 0.566232124
    },
    {
      time: 1727859600000,
      close: 0.567352144,
      high: 0.567937063,
      low: 0.564946107,
      open: 0.565631455
    },
    {
      time: 1727863200000,
      close: 0.554762952,
      high: 0.570289365,
      low: 0.554685493,
      open: 0.567352144
    },
    {
      time: 1727866800000,
      close: 0.554763335,
      high: 0.560138389,
      low: 0.55462909,
      open: 0.554762952
    },
    {
      time: 1727870400000,
      close: 0.554820934,
      high: 0.556896568,
      low: 0.551615241,
      open: 0.554762453
    },
    {
      time: 1727874000000,
      close: 0.549273955,
      high: 0.555534062,
      low: 0.549226263,
      open: 0.554820964
    },
    {
      time: 1727877600000,
      close: 0.550082766,
      high: 0.550622794,
      low: 0.540719386,
      open: 0.549273955
    },
    {
      time: 1727881200000,
      close: 0.548197936,
      high: 0.553058261,
      low: 0.547636487,
      open: 0.550082765
    },
    {
      time: 1727884800000,
      close: 0.553862419,
      high: 0.55407009,
      low: 0.547790195,
      open: 0.547790308
    },
    {
      time: 1727888400000,
      close: 0.552358939,
      high: 0.559903354,
      low: 0.552358939,
      open: 0.553862417
    },
    {
      time: 1727892000000,
      close: 0.550483549,
      high: 0.553605353,
      low: 0.548633318,
      open: 0.552358939
    },
    {
      time: 1727895600000,
      close: 0.536168126,
      high: 0.550483561,
      low: 0.535874373,
      open: 0.550483549
    },
    {
      time: 1727899200000,
      close: 0.534897709,
      high: 0.536658369,
      low: 0.526617871,
      open: 0.53598542
    },
    {
      time: 1727902800000,
      close: 0.542405283,
      high: 0.543180488,
      low: 0.531431527,
      open: 0.534897675
    },
    {
      time: 1727906400000,
      close: 0.538795559,
      high: 0.543254919,
      low: 0.537946769,
      open: 0.542406773
    },
    {
      time: 1727910000000,
      close: 0.538356766,
      high: 0.538795559,
      low: 0.53409047,
      open: 0.538795559
    },
    {
      time: 1727913600000,
      close: 0.538554943,
      high: 0.540338136,
      low: 0.538357865,
      open: 0.538357865
    },
    {
      time: 1727917200000,
      close: 0.537057439,
      high: 0.539650557,
      low: 0.522721317,
      open: 0.538554512
    },
    {
      time: 1727920800000,
      close: 0.540283072,
      high: 0.542255676,
      low: 0.53675893,
      open: 0.53675893
    },
    {
      time: 1727924400000,
      close: 0.543476082,
      high: 0.543848314,
      low: 0.539481014,
      open: 0.540282584
    },
    {
      time: 1727928000000,
      close: 0.546079759,
      high: 0.546208391,
      low: 0.54277009,
      open: 0.543476515
    },
    {
      time: 1727931600000,
      close: 0.545495619,
      high: 0.546371429,
      low: 0.542832076,
      open: 0.546079759
    },
    {
      time: 1727935200000,
      close: 0.540542871,
      high: 0.54574957,
      low: 0.540541646,
      open: 0.545494857
    },
    {
      time: 1727938800000,
      close: 0.543477519,
      high: 0.544199168,
      low: 0.5402821,
      open: 0.540542872
    },
    {
      time: 1727942400000,
      close: 0.536991097,
      high: 0.54500843,
      low: 0.536146016,
      open: 0.543477519
    },
    {
      time: 1727946000000,
      close: 0.52428201,
      high: 0.53746347,
      low: 0.518419723,
      open: 0.536991097
    },
    {
      time: 1727949600000,
      close: 0.53175839,
      high: 0.533056551,
      low: 0.519200344,
      open: 0.52428201
    },
    {
      time: 1727953200000,
      close: 0.537364286,
      high: 0.537478516,
      low: 0.53175839,
      open: 0.53175839
    },
    {
      time: 1727956800000,
      close: 0.529600807,
      high: 0.539408661,
      low: 0.529347459,
      open: 0.537359815
    },
    {
      time: 1727960400000,
      close: 0.526269958,
      high: 0.529601952,
      low: 0.524316922,
      open: 0.529600869
    },
    {
      time: 1727964000000,
      close: 0.522772611,
      high: 0.527574187,
      low: 0.519729965,
      open: 0.526269958
    },
    {
      time: 1727967600000,
      close: 0.518853833,
      high: 0.529839787,
      low: 0.518799858,
      open: 0.522772936
    },
    {
      time: 1727971200000,
      close: 0.517539747,
      high: 0.519242699,
      low: 0.511715661,
      open: 0.51885381
    },
    {
      time: 1727974800000,
      close: 0.510840433,
      high: 0.518316448,
      low: 0.509295515,
      open: 0.517539949
    },
    {
      time: 1727978400000,
      close: 0.514085167,
      high: 0.518966859,
      low: 0.507929027,
      open: 0.510633201
    },
    {
      time: 1727982000000,
      close: 0.513559459,
      high: 0.514897902,
      low: 0.511826039,
      open: 0.514085167
    },
    {
      time: 1727985600000,
      close: 0.518098451,
      high: 0.518126009,
      low: 0.512350388,
      open: 0.513559219
    },
    {
      time: 1727989200000,
      close: 0.516753579,
      high: 0.519705706,
      low: 0.51622074,
      open: 0.518098203
    },
    {
      time: 1727992800000,
      close: 0.518288153,
      high: 0.518456365,
      low: 0.514699359,
      open: 0.516753594
    },
    {
      time: 1727996400000,
      close: 0.516739924,
      high: 0.518519572,
      low: 0.516122778,
      open: 0.518288153
    },
    {
      time: 1728000000000,
      close: 0.516584144,
      high: 0.518818974,
      low: 0.515215682,
      open: 0.516739924
    },
    {
      time: 1728003600000,
      close: 0.514429024,
      high: 0.517828887,
      low: 0.5140667,
      open: 0.516584278
    },
    {
      time: 1728007200000,
      close: 0.524838381,
      high: 0.525929433,
      low: 0.514429024,
      open: 0.514429024
    },
    {
      time: 1728010800000,
      close: 0.524696361,
      high: 0.525674827,
      low: 0.523092999,
      open: 0.524838381
    },
    {
      time: 1728014400000,
      close: 0.522402737,
      high: 0.524699755,
      low: 0.52110367,
      open: 0.52469644
    },
    {
      time: 1728018000000,
      close: 0.524696568,
      high: 0.529491133,
      low: 0.522402737,
      open: 0.522402737
    },
    {
      time: 1728021600000,
      close: 0.52847649,
      high: 0.528959949,
      low: 0.524694494,
      open: 0.524696568
    },
    {
      time: 1728025200000,
      close: 0.527790575,
      high: 0.529617866,
      low: 0.527640122,
      open: 0.52847649
    },
    {
      time: 1728028800000,
      close: 0.529440555,
      high: 0.529820453,
      low: 0.525454745,
      open: 0.527790575
    },
    {
      time: 1728032400000,
      close: 0.531739756,
      high: 0.534424962,
      low: 0.528851157,
      open: 0.529440346
    },
    {
      time: 1728036000000,
      close: 0.531284497,
      high: 0.535208648,
      low: 0.531280341,
      open: 0.531739756
    },
    {
      time: 1728039600000,
      close: 0.527580033,
      high: 0.531284178,
      low: 0.527556403,
      open: 0.531284178
    },
    {
      time: 1728043200000,
      close: 0.530724525,
      high: 0.530973753,
      low: 0.526605906,
      open: 0.527564826
    },
    {
      time: 1728046800000,
      close: 0.531408747,
      high: 0.531408747,
      low: 0.525603842,
      open: 0.530723057
    },
    {
      time: 1728050400000,
      close: 0.529527038,
      high: 0.533249741,
      low: 0.528995432,
      open: 0.531492623
    },
    {
      time: 1728054000000,
      close: 0.526574066,
      high: 0.531505885,
      low: 0.522682032,
      open: 0.529633913
    },
    {
      time: 1728057600000,
      close: 0.536044085,
      high: 0.536044085,
      low: 0.526574066,
      open: 0.526574066
    },
    {
      time: 1728061200000,
      close: 0.545762373,
      high: 0.548480075,
      low: 0.535993023,
      open: 0.535993023
    },
    {
      time: 1728064800000,
      close: 0.546162998,
      high: 0.547403756,
      low: 0.543556405,
      open: 0.545883024
    },
    {
      time: 1728068400000,
      close: 0.547789977,
      high: 0.548345259,
      low: 0.544780502,
      open: 0.546161806
    },
    {
      time: 1728072000000,
      close: 0.54715659,
      high: 0.548199668,
      low: 0.546389535,
      open: 0.547789823
    },
    {
      time: 1728075600000,
      close: 0.547398449,
      high: 0.549290957,
      low: 0.545546929,
      open: 0.547157043
    },
    {
      time: 1728079200000,
      close: 0.546884288,
      high: 0.54836365,
      low: 0.546880486,
      open: 0.547398449
    },
    {
      time: 1728082800000,
      close: 0.546890132,
      high: 0.547053411,
      low: 0.546452102,
      open: 0.546884288
    },
    {
      time: 1728086400000,
      close: 0.54867838,
      high: 0.54877694,
      low: 0.545667019,
      open: 0.546890132
    },
    {
      time: 1728090000000,
      close: 0.554137904,
      high: 0.554441319,
      low: 0.548676903,
      open: 0.548676903
    },
    {
      time: 1728093600000,
      close: 0.55437151,
      high: 0.555261111,
      low: 0.552390975,
      open: 0.554137902
    },
    {
      time: 1728097200000,
      close: 0.548063302,
      high: 0.554408046,
      low: 0.547661257,
      open: 0.55437151
    },
    {
      time: 1728100800000,
      close: 0.548791599,
      high: 0.551333839,
      low: 0.546727511,
      open: 0.548087826
    },
    {
      time: 1728104400000,
      close: 0.551309954,
      high: 0.551309954,
      low: 0.548280509,
      open: 0.548791599
    },
    {
      time: 1728108000000,
      close: 0.554695744,
      high: 0.554823511,
      low: 0.551309954,
      open: 0.551309954
    },
    {
      time: 1728111600000,
      close: 0.557297402,
      high: 0.557882916,
      low: 0.552932107,
      open: 0.554695739
    },
    {
      time: 1728115200000,
      close: 0.553131896,
      high: 0.557299532,
      low: 0.553131783,
      open: 0.557297402
    },
    {
      time: 1728118800000,
      close: 0.557460139,
      high: 0.557749992,
      low: 0.552204686,
      open: 0.553132076
    },
    {
      time: 1728122400000,
      close: 0.56208737,
      high: 0.562868609,
      low: 0.557460139,
      open: 0.557460139
    },
    {
      time: 1728126000000,
      close: 0.557510124,
      high: 0.562087517,
      low: 0.557510051,
      open: 0.56208737
    },
    {
      time: 1728129600000,
      close: 0.558321799,
      high: 0.558601644,
      low: 0.557033762,
      open: 0.557510124
    },
    {
      time: 1728133200000,
      close: 0.560266386,
      high: 0.560266386,
      low: 0.557518788,
      open: 0.558321799
    },
    {
      time: 1728136800000,
      close: 0.553571622,
      high: 0.560524725,
      low: 0.55357133,
      open: 0.560266386
    },
    {
      time: 1728140400000,
      close: 0.553518112,
      high: 0.555184086,
      low: 0.551785598,
      open: 0.553571622
    },
    {
      time: 1728144000000,
      close: 0.553960901,
      high: 0.554118112,
      low: 0.553323099,
      open: 0.553518349
    },
    {
      time: 1728147600000,
      close: 0.549720917,
      high: 0.553960686,
      low: 0.549471088,
      open: 0.553960686
    },
    {
      time: 1728151200000,
      close: 0.551671452,
      high: 0.551671452,
      low: 0.548600112,
      open: 0.549304025
    },
    {
      time: 1728154800000,
      close: 0.548572496,
      high: 0.55213793,
      low: 0.548572496,
      open: 0.551241465
    },
    {
      time: 1728158400000,
      close: 0.545532851,
      high: 0.54857268,
      low: 0.545532851,
      open: 0.548572496
    },
    {
      time: 1728162000000,
      close: 0.541493595,
      high: 0.545532918,
      low: 0.541017054,
      open: 0.545532855
    },
    {
      time: 1728165600000,
      close: 0.545140272,
      high: 0.546262781,
      low: 0.541210502,
      open: 0.541493595
    },
    {
      time: 1728169200000,
      close: 0.551089909,
      high: 0.551940497,
      low: 0.544760883,
      open: 0.545140002
    },
    {
      time: 1728172800000,
      close: 0.550906309,
      high: 0.551394726,
      low: 0.550866771,
      open: 0.551089909
    },
    {
      time: 1728176400000,
      close: 0.54946156,
      high: 0.550906323,
      low: 0.549060301,
      open: 0.550906309
    },
    {
      time: 1728180000000,
      close: 0.551161586,
      high: 0.552490349,
      low: 0.549461504,
      open: 0.54946156
    },
    {
      time: 1728183600000,
      close: 0.547770489,
      high: 0.551162148,
      low: 0.547770487,
      open: 0.551161586
    },
    {
      time: 1728187200000,
      close: 0.545281721,
      high: 0.548290323,
      low: 0.544913474,
      open: 0.547770489
    },
    {
      time: 1728190800000,
      close: 0.54093613,
      high: 0.545281843,
      low: 0.540797399,
      open: 0.545281721
    },
    {
      time: 1728194400000,
      close: 0.541996148,
      high: 0.54199985,
      low: 0.54045425,
      open: 0.54093613
    },
    {
      time: 1728198000000,
      close: 0.542470644,
      high: 0.544258039,
      low: 0.541996198,
      open: 0.541996246
    },
    {
      time: 1728201600000,
      close: 0.543228807,
      high: 0.543229256,
      low: 0.54224129,
      open: 0.542470644
    },
    {
      time: 1728205200000,
      close: 0.544115761,
      high: 0.547012917,
      low: 0.543225247,
      open: 0.543228807
    },
    {
      time: 1728208800000,
      close: 0.545102106,
      high: 0.546151385,
      low: 0.54411475,
      open: 0.544115762
    },
    {
      time: 1728212400000,
      close: 0.543382806,
      high: 0.545102385,
      low: 0.543380739,
      open: 0.545102106
    },
    {
      time: 1728216000000,
      close: 0.544709051,
      high: 0.545851838,
      low: 0.541379316,
      open: 0.543382831
    },
    {
      time: 1728219600000,
      close: 0.540436666,
      high: 0.545331645,
      low: 0.53949532,
      open: 0.544709036
    },
    {
      time: 1728223200000,
      close: 0.54352557,
      high: 0.543988287,
      low: 0.540437232,
      open: 0.540437232
    },
    {
      time: 1728226800000,
      close: 0.550759553,
      high: 0.55103993,
      low: 0.54265885,
      open: 0.54352557
    },
    {
      time: 1728230400000,
      close: 0.547252676,
      high: 0.551438494,
      low: 0.546109215,
      open: 0.55075943
    },
    {
      time: 1728234000000,
      close: 0.544715665,
      high: 0.551622383,
      low: 0.544646046,
      open: 0.547252446
    },
    {
      time: 1728237600000,
      close: 0.543991448,
      high: 0.545536485,
      low: 0.543874664,
      open: 0.544715665
    },
    {
      time: 1728241200000,
      close: 0.545722212,
      high: 0.546016903,
      low: 0.54399044,
      open: 0.543991448
    },
    {
      time: 1728244800000,
      close: 0.543358761,
      high: 0.54842222,
      low: 0.543078007,
      open: 0.545722212
    },
    {
      time: 1728248400000,
      close: 0.543312014,
      high: 0.544814215,
      low: 0.541627781,
      open: 0.543358768
    },
    {
      time: 1728252000000,
      close: 0.539859453,
      high: 0.543316552,
      low: 0.539292991,
      open: 0.543312014
    },
    {
      time: 1728255600000,
      close: 0.543126499,
      high: 0.543126499,
      low: 0.539246624,
      open: 0.539859453
    },
    {
      time: 1728259200000,
      close: 0.550047628,
      high: 0.550345492,
      low: 0.543126499,
      open: 0.543126499
    },
    {
      time: 1728262800000,
      close: 0.559166701,
      high: 0.56022035,
      low: 0.549990737,
      open: 0.550047628
    },
    {
      time: 1728266400000,
      close: 0.565128969,
      high: 0.56567019,
      low: 0.558663648,
      open: 0.559166245
    },
    {
      time: 1728270000000,
      close: 0.560940461,
      high: 0.567283086,
      low: 0.560656827,
      open: 0.565128969
    },
    {
      time: 1728273600000,
      close: 0.562867829,
      high: 0.563126602,
      low: 0.557632407,
      open: 0.560940466
    },
    {
      time: 1728277200000,
      close: 0.560381161,
      high: 0.563011118,
      low: 0.559113883,
      open: 0.562866956
    },
    {
      time: 1728280800000,
      close: 0.559541151,
      high: 0.561901673,
      low: 0.55743562,
      open: 0.56038115
    },
    {
      time: 1728284400000,
      close: 0.563255745,
      high: 0.564475284,
      low: 0.559446911,
      open: 0.559446911
    },
    {
      time: 1728288000000,
      close: 0.558492065,
      high: 0.563036973,
      low: 0.558166991,
      open: 0.562330574
    },
    {
      time: 1728291600000,
      close: 0.561722487,
      high: 0.562670953,
      low: 0.558492065,
      open: 0.558492065
    }
  ],
  yRange: [0.4865146980952381, 0.6777044442000001],
  lastChartData: {
    close: 0.5621860841009938,
    high: 0.5621860841009938,
    low: 0.5621860841009938,
    open: 0.5621860841009938,
    time: 1728290602314
  },
  currentPrice: {
    int: '562186084100993840'
  },
  setHoverPrice: (price: any) => {}
};

const LiquidityChartData = {
  yRange: [0.4865146980952381, 0.6777044442000001],
  xRange: [0, 1205869133484.7856],
  data: [
    {
      price: 0.4865146980952381,
      depth: 420028531652.95374
    },
    {
      price: 0.4960741854004762,
      depth: 426299951971.42035
    },
    {
      price: 0.5056336727057144,
      depth: 510062982610.4979
    },
    {
      price: 0.5151931600109525,
      depth: 730758553965.1825
    },
    {
      price: 0.5247526473161906,
      depth: 792550286024.2544
    },
    {
      price: 0.5343121346214288,
      depth: 834305385043.0358
    },
    {
      price: 0.5438716219266669,
      depth: 852854912633.2798
    },
    {
      price: 0.5534311092319051,
      depth: 809204111438.5962
    },
    {
      price: 0.5629905965371432,
      depth: 733946944570.9766
    },
    {
      price: 0.5725500838423814,
      depth: 682947960784.0153
    },
    {
      price: 0.5821095711476195,
      depth: 686597851468.0262
    },
    {
      price: 0.5916690584528577,
      depth: 608624268432.5157
    },
    {
      price: 0.6012285457580958,
      depth: 743609404032.5088
    },
    {
      price: 0.610788033063334,
      depth: 753222773886.6119
    },
    {
      price: 0.6203475203685721,
      depth: 877908234159.4294
    },
    {
      price: 0.6299070076738102,
      depth: 878081624843.3722
    },
    {
      price: 0.6394664949790484,
      depth: 891297097746.3016
    },
    {
      price: 0.6490259822842865,
      depth: 889387738888.4976
    },
    {
      price: 0.6585854695895247,
      depth: 1004890944570.6547
    },
    {
      price: 0.6681449568947628,
      depth: 1004881821418.729
    }
  ],
  annotationDatum: {
    price: 0.5615442249292797,
    depth: 1205869133484.7856
  },
  offset: {
    top: 0,
    right: 56,
    bottom: 52,
    left: 0
  },
  horizontal: true
};

export default CreatePositionForm;
