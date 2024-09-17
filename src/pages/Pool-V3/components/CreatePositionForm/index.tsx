import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import {
  BigDecimal,
  CW20_DECIMALS,
  MULTICALL_CONTRACT,
  toAmount,
  toDisplay,
  TokenItemType,
  USDT_CONTRACT
} from '@oraichain/oraidex-common';
import { ZapperQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { FeeTier, PoolWithPoolKey, TokenAmount } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import {
  calculateSqrtPrice,
  extractAddress,
  getLiquidityByX,
  getLiquidityByY,
  getMaxTick,
  getMinTick,
  isTokenX,
  newPoolKey,
  poolKeyToString,
  ZapConsumer,
  ZapInLiquidityResponse,
  ZapInResult
} from '@oraichain/oraiswap-v3';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-fill-ic.svg';
import { ReactComponent as ErrorIcon } from 'assets/icons/error-fill-icon.svg';
import { ReactComponent as OutputIcon } from 'assets/icons/zapOutput-ic.svg';
import { ReactComponent as Continuous } from 'assets/images/continuous.svg';
import { ReactComponent as Discrete } from 'assets/images/discrete.svg';
import classNames from 'classnames';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TooltipHover from 'components/TooltipHover';
import { oraichainTokens } from 'config/bridgeTokens';
import { network } from 'config/networks';
import { getIcon, getTransactionUrl } from 'helper';
import { numberWithCommas } from 'helper/format';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useDebounce } from 'hooks/useDebounce';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import useTheme from 'hooks/useTheme';
import {
  calculateTokenAmountsWithSlippage,
  calcYPerXPriceBySqrtPrice,
  InitPositionData
} from 'pages/Pool-V3/helpers/helper';
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
  nearestTickIndex,
  PositionTokenBlock,
  printBigint,
  toMaxNumericPlaces,
  trimLeadingZeros
} from '../PriceRangePlot/utils';
import SelectToken from '../SelectToken';
import styles from './index.module.scss';
import ZappingText from 'components/Zapping';

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

  const debounceZapAmount = useDebounce(zapAmount, 800);

  const { data: prices } = useCoinGeckoPrices();
  const { poolList } = useGetPoolList(prices);

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

  const fromUsd = (prices?.[tokenFrom?.coinGeckoId] * Number(amountFrom || 0)).toFixed(6);
  const toUsd = (prices?.[tokenTo?.coinGeckoId] * Number(amountTo || 0)).toFixed(6);
  const zapUsd = (prices?.[tokenZap?.coinGeckoId] * Number(zapAmount || 0)).toFixed(6);
  const xUsd =
    zapInResponse &&
    (prices?.[tokenFrom?.coinGeckoId] * (Number(zapInResponse.amountX || 0) / 10 ** tokenFrom.decimals)).toFixed(6);
  const yUsd =
    zapInResponse &&
    (prices?.[tokenTo?.coinGeckoId] * (Number(zapInResponse.amountY || 0) / 10 ** tokenTo.decimals)).toFixed(6);

  const [swapFee, setSwapFee] = useState<number>(1.5);
  const [zapFee, setZapFee] = useState<number>(1);
  const [totalFee, setTotalFee] = useState<number>(1.75);
  const [matchRate, setMatchRate] = useState<number>(99.5);

  const isLightTheme = theme === 'light';

  const TokenFromIcon =
    tokenFrom &&
    getIcon({
      isLightTheme,
      type: 'token',
      coinGeckoId: tokenFrom.coinGeckoId,
      width: 30,
      height: 30
    });

  const TokenToIcon =
    tokenTo &&
    getIcon({
      isLightTheme,
      type: 'token',
      coinGeckoId: tokenTo.coinGeckoId,
      width: 30,
      height: 30
    });

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
    if (zapInResponse) {
      console.log('zapInResponse', zapInResponse);
      if ([ZapInResult.NoRouteFound, ZapInResult.SomethingWentWrong].includes(zapInResponse.result)) {
        setZapError(zapInResponse.result);
      }
    }
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
        x:
          calcYPerXPriceBySqrtPrice(BigInt(poolInfo.pool.sqrt_price), tokenFrom.decimals, tokenTo.decimals) **
          (isXtoY ? 1 : -1)
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

  const { zapIn, ZAP_CONTRACT } = useZap();

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
            loadOraichainToken(walletAddress, [tokenFrom.contractAddress, tokenTo.contractAddress].filter(Boolean));
            onCloseModal();
            navigate(`/pools-v3/${encodeURIComponent(poolKeyToString(poolData.pool_key))}`);
          },
          (e) => {
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
          navigate(`/pools-v3/${encodeURIComponent(poolKeyToString(data.poolKeyData))}`);
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
<<<<<<< HEAD
=======

>>>>>>> 5c32b150636d690e75c484a345df73382b988673
    let zapFee = 0;
    let client: CosmWasmClient;
    try {
      client = await CosmWasmClient.connect(network.rpc);
      const zap = new ZapperQueryClient(client, ZAP_CONTRACT);
      zapFee = Number((await zap.protocolFee()).percent);
      console.log('zapFee', zapFee);
    } catch (error) {
      console.log('error', error);
    }

    try {
      const amountAfterFee = Number(zapAmount) * (1 - zapFee);

      const routerApi = 'https://osor.oraidex.io/smart-router/alpha-router';
      const zapper = new ZapConsumer({
        client,
        devitation: 0,
        dexV3Address: network.pool_v3,
        multicallAddress: MULTICALL_CONTRACT,
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
      const inputUsd = prices?.[tokenZap.coinGeckoId] * Number(amountAfterFee);
      const outputUsd =
        prices?.[tokenFrom.coinGeckoId] * (Number(result.amountX) / 10 ** tokenFrom.decimals) +
        prices?.[tokenTo.coinGeckoId] * (Number(result.amountY) / 10 ** tokenTo.decimals);

      const priceImpact = (Math.abs(inputUsd - outputUsd) / inputUsd) * 100;
      const matchRate = 100 - priceImpact;

      const swapFeeInUsd = amountAfterFee * result.swapFee * prices?.[tokenZap.coinGeckoId];
      const zapFeeInUsd = (Number(zapAmount) - amountAfterFee) * prices?.[tokenZap.coinGeckoId];
      const totalFeeInUsd = swapFeeInUsd + zapFeeInUsd;

      setTotalFee(totalFeeInUsd);
      setZapImpactPrice(priceImpact);
      setMatchRate(matchRate);
      setZapInResponse(result);
      setSimulating(false);
    } catch (error) {
      console.log('error', error);
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
                tickSpacing={poolData.pool_key.fee_tier.tick_spacing}
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

            <div className={styles.currentPrice}>
              <p>Current Price:</p>
              <p>
                1 {tokenFrom.name} ={' '}
                {numberWithCommas(midPrice.x, undefined, { maximumFractionDigits: tokenTo.decimals })} {tokenTo.name}
              </p>
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
        <div>
          <div className={styles.introZap}>
            <IconInfo />
            <span>
              Zap In: Instantly swap your chosen token for two pool tokens and provide liquidity to the pool, all in one
              seamless transaction.
            </span>
          </div>
          <div className={classNames(styles.itemInput, { [styles.disabled]: false })}>
            <div className={styles.balance}>
              <p className={styles.bal}>
                <span>Balance:</span> {numberWithCommas(toDisplay(amounts[tokenZap?.denom] || '0', tokenZap.decimals))}{' '}
                {tokenZap?.name}
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
              <span>No route found to zap, try other tokens or check back later.</span>
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
                      {zapInResponse ? numberWithCommas(Number(yUsd) || 0, undefined, { maximumFractionDigits: 3 }) : 0}
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
                      `${zapImpactPrice >= 10 ? 'impact-medium' : zapImpactPrice >= 5 ? 'impact-high' : ''}`
                    )}
                  >
                    <span>{numberWithCommas(zapImpactPrice, undefined, { maximumFractionDigits: 2 })}%</span>
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
                    <span>${numberWithCommas(totalFee, undefined, { maximumFractionDigits: 4 })}</span>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.conclusion}>
                    <span>Match Rate</span>
                  </div>
                  <div className={styles.value}>
                    <span>{numberWithCommas(matchRate, undefined, { maximumFractionDigits: 2 })} %</span>
                  </div>
                </div>
              </div>
            </>
          )}
          <div ref={endRef}></div>
        </div>
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
                  ≈ ${amountFrom ? numberWithCommas(Number(fromUsd) || 0, undefined, { maximumFractionDigits: 6 }) : 0}
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
                loading || !walletAddress || !(btnText === 'Zap in' || btnText === 'Create new position')
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
  );
};

export default CreatePositionForm;
