import { BigDecimal, toAmount, toDisplay, TokenItemType, CW20_DECIMALS } from '@oraichain/oraidex-common';
import {
  FeeTier,
  PoolKey,
  PoolWithPoolKey,
  TokenAmount
} from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
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
  Price,
  ZapInLiquidityResponse
} from '@oraichain/oraiswap-v3';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-fill-ic.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { getIcon, getTransactionUrl, handleCheckAddress } from 'helper';
import { numberWithCommas } from 'helper/format';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import useTheme from 'hooks/useTheme';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import {
  calculateTokenAmountsWithSlippage,
  calcYPerXPriceBySqrtPrice,
  InitPositionData
} from 'pages/Pool-V3/helpers/helper';
import { convertBalanceToBigint } from 'pages/Pool-V3/helpers/number';
import useAddLiquidity from 'pages/Pool-V3/hooks/useAddLiquidity';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import NewPositionNoPool from '../NewPositionNoPool';
import {
  calcPrice,
  calcTicksAmountInRange,
  calculateConcentrationRange,
  determinePositionTokenBlock,
  extractDenom,
  getConcentrationArray,
  getTickAtSqrtPriceFromBalance,
  handleGetCurrentPlotTicks,
  nearestTickIndex,
  PositionTokenBlock,
  printBigint,
  toMaxNumericPlaces,
  trimLeadingZeros
} from '../PriceRangePlot/utils';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Continuous } from 'assets/images/continuous.svg';
import { ReactComponent as Discrete } from 'assets/images/discrete.svg';
import PriceRangePlot, { PlotTickData, TickPlotPositionData } from '../PriceRangePlot/PriceRangePlot';
import { oraichainTokens } from 'config/bridgeTokens';
import { USDT_CONTRACT, MULTICALL_CONTRACT } from '@oraichain/oraidex-common';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';
import { ZapConsumer } from '@oraichain/oraiswap-v3';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { network } from 'config/networks';
import { OraiswapTokenClient, ZapperClient } from '@oraichain/oraidex-contracts-sdk';
import { Coin } from '@cosmjs/proto-signing';
import { ReactComponent as OutputIcon } from 'assets/icons/zapOutput-ic.svg';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';
import { useDebounce } from 'hooks/useDebounce';
import useZap from 'pages/Pool-V3/hooks/useZap';
import SelectToken from '../SelectToken';

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
  onCloseModal: () => void;
}

const TOKEN_ZAP = oraichainTokens.find((e) => extractAddress(e) === USDT_CONTRACT);

const CreatePositionForm: FC<CreatePoolFormProps> = ({
  tokenFrom,
  tokenTo,
  feeTier,
  poolData,
  slippage,
  onCloseModal
}) => {
  const [tokenZap, setTokenZap] = useState<TokenItemType>(TOKEN_ZAP);
  const [zapAmount, setZapAmount] = useState<number | string>('');
  const [zapInResponse, setZapInResponse] = useState<ZapInLiquidityResponse>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

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
  const [toggleZapIn, setToggleZapIn] = useState(true);

  const loadOraichainToken = useLoadOraichainTokens();
  const [focusId, setFocusId] = useState<'from' | 'to' | 'zapper' | null>(null);

  const [notInitPoolKey, setNotInitPoolKey] = useState<PoolKey>({
    token_x: tokenFrom?.denom || '',
    token_y: tokenTo?.denom || '',
    fee_tier: {
      fee: feeTier.fee,
      tick_spacing: feeTier.tick_spacing
    }
  });
  const [oraiAddress] = useConfigReducer('address');

  const [leftRange, setLeftRange] = useState(getMinTick(notInitPoolKey.fee_tier.tick_spacing));
  const [rightRange, setRightRange] = useState(getMaxTick(notInitPoolKey.fee_tier.tick_spacing));

  const [leftInputRounded, setLeftInputRounded] = useState('');
  const [rightInputRounded, setRightInputRounded] = useState('');

  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');

  const [plotMin, setPlotMin] = useState(0);
  const [plotMax, setPlotMax] = useState(1);

  const [isPoolExist, setIsPoolExist] = useState(false);

  const [poolInfo, setPoolInfo] = useState<PoolWithPoolKey>();

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

  const isLightTheme = theme === 'light';
  const TokenZapIcon =
    tokenZap &&
    getIcon({
      isLightTheme,
      type: 'token',
      coinGeckoId: tokenZap.coinGeckoId,
      width: 30,
      height: 30
    });

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

  // useEffect(() => {
  //   if (tokenZap && zapAmount) {
  //     console.log(`want to zap ${zapAmount} ${tokenZap.name}`);
  //   }
  // }, [zapAmount, tokenZap]);

  const concentrationArray = useMemo(
    () =>
      getConcentrationArray(Number(notInitPoolKey.fee_tier.tick_spacing), 2, Number(midPrice)).sort((a, b) => a - b),
    [notInitPoolKey.fee_tier.tick_spacing]
  );

  const liquidityRef = useRef<any>(0n);

  const [_concentrationIndex, setConcentrationIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [liquidityData, setLiquidityData] = useState<PlotTickData[]>([]);

  useEffect(() => {
    if (isMountedRef.current && liquidityData) {
      resetPlot();
    }
  }, [liquidityData]);

  useEffect(() => {
    // NOTE: call RPC 1 (done)
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

  const getTicksInsideRange = (left: number, right: number, isXtoY: boolean) => {
    const leftMax = isXtoY
      ? getMinTick(notInitPoolKey.fee_tier.tick_spacing)
      : getMaxTick(notInitPoolKey.fee_tier.tick_spacing);
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
    if (fee && tokenFrom && tokenTo && poolList) {
      const poolKey = newPoolKey(extractAddress(tokenFrom), extractAddress(tokenTo), fee);
      try {
        const pool = poolList.find((p) => poolKeyToString(p.pool_key) === poolKeyToString(poolKey));
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
          setNotInitPoolKey(poolKey);
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
        setNotInitPoolKey(poolKey);
        setIsPoolExist(false);
      }
      return;
    } else {
      setIsPoolExist(false);
    }
  };

  const calcAmount = (amount: TokenAmount, left: number, right: number, tokenAddress: string) => {
    if (!notInitPoolKey) return BigInt(0);
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
          notInitPoolKey.fee_tier.tick_spacing,
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
        notInitPoolKey.fee_tier.tick_spacing,
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
        notInitPoolKey.fee_tier.tick_spacing,
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

  const handleSuccessAdd = async () => {
    alert('Add success!');
  };

  useEffect(() => {
    if (isPoolExist) {
      handleGetTicks();
    }
  }, [isPoolExist]);

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
    const isInsufficientTo =
      amountTo && Number(amountTo) > toDisplay(amounts[tokenTo.denom], tokenTo.decimals || CW20_DECIMALS);
    const isInsufficientFrom =
      amountFrom && Number(amountFrom) > toDisplay(amounts[tokenFrom.denom], tokenFrom.decimals || CW20_DECIMALS);

    if (!walletAddress) {
      return 'Connect wallet';
    }

    if (toggleZapIn && zapInResponse) {
      return 'Zap in';
    }

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
    return 'Create new pool';
  };

  const { zapIn } = useZap();

  const handleZapIn = async () => {
    try {
      if (tokenZap && zapAmount) {
        setLoading(true);
        await zapIn(
          { tokenZap, zapAmount: (BigInt(zapAmount) * BigInt(10 ** tokenZap.decimals)).toString(), zapInResponse },
          walletAddress,
          (tx: string) => {
            displayToast(TToastType.TX_SUCCESSFUL, {
              customLink: getTransactionUrl('Oraichain', tx)
            });
            // handleSuccessAdd();
            loadOraichainToken(walletAddress, [tokenFrom.contractAddress, tokenTo.contractAddress].filter(Boolean));
            onCloseModal();
            navigate(`/pools-v3/${encodeURIComponent(poolKeyToString(notInitPoolKey))}`);
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
          handleSuccessAdd();
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
          poolKey: notInitPoolKey,
          isXtoY: isXtoY,
          xDecimal: tokenFrom.decimals,
          yDecimal: tokenTo.decimals
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

  const handleSimulateZapIn = async () => {
    try {
      setSimulating(true);
      const zapper = new ZapConsumer({
        client: await CosmWasmClient.connect(network.rpc),
        devitation: 0.05,
        dexV3Address: network.pool_v3,
        multicallAddress: MULTICALL_CONTRACT,
        routerApi: 'https://osor.oraidex.io/smart-router/alpha-router',
        smartRouteConfig: {
          swapOptions: {
            protocols: ['OraidexV3'],
            maxSplits: 1
          }
        }
      });

      const amountIn = Math.round(Number(zapAmount) * 10 ** tokenZap.decimals).toString();
      const lowerTick = Math.min(leftRange, rightRange);
      const upperTick = Math.max(leftRange, rightRange);

      // console.log({ amountIn, lowerTick, upperTick });

      const result = await zapper.processZapInPositionLiquidity({
        poolKey: poolData.pool_key,
        tokenIn: tokenZap,
        amountIn: amountIn,
        lowerTick,
        upperTick
      });

      console.log({ result });

      // const swapData = {
      //   sender: { cosmos: oraiAddress },
      //   originalFromToken,
      //   originalToToken,
      //   fromAmount: fromAmountToken,
      //   simulateAmount,
      //   userSlippage,
      //   bridgeFee: 1,
      //   amounts: amountsBalance,
      //   recipientAddress: isCustomRecipient ? addressTransfer : undefined,
      //   simulatePrice: averageRatio?.amount && new BigDecimal(averageRatio.amount).div(SIMULATE_INIT_AMOUNT).toString(),
      //   relayerFee: relayerFeeUniversal,
      //   alphaSmartRoutes
      // };

      // // @ts-ignore
      // const univeralSwapHandler = new UniversalSwapHandler(swapData, {
      //   cosmosWallet: window.Keplr,
      //   evmWallet: new Metamask(window.tronWebDapp),
      //   swapOptions: {
      //     isAlphaSmartRouter: useAlphaSmartRouter,
      //     isIbcWasm: useIbcWasm
      //   }
      // });

      // const { transactionHash } = await univeralSwapHandler.processUniversalSwap();

      setZapInResponse(result);
      setSimulating(false);
    } catch (error) {
      // console.error(error);
      console.log('error', error);
      setSimulating(false);
    }
  };

  useEffect(() => {
    // console.log("debounceZapAmount", debounceZapAmount);
    if (Number(zapAmount) > 0 && toggleZapIn) {
      handleSimulateZapIn();
    }
  }, [debounceZapAmount]);

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
      </div>

      <div className={styles.options}>
        <button onClick={() => setToggleZapIn(true)}>
          Zap In
          <span>NEW</span>
        </button>
        <button onClick={() => setToggleZapIn(false)}>Manual Deposit</button>
      </div>

      {toggleZapIn ? (
        <div>
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
                    setZapAmount(floatValue);
                  }}
                />
                <div className={styles.usd}>
                  ≈ ${amountFrom ? numberWithCommas(Number(fromUsd) || 0, undefined, { maximumFractionDigits: 6 }) : 0}
                </div>
              </div>
            </div>
          </div>
          {simulating && (
            <div>
              <span style={{ fontStyle: 'italic', fontSize: 'small', color: 'white' }}>
                Finding best option to zap...
              </span>
            </div>
          )}
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
                <div>{TokenFromIcon}</div>
                <span>{tokenFrom.name}</span>
              </div>
              <div className={styles.value}>
                <span>
                  {zapInResponse
                    ? numberWithCommas(Number(zapInResponse.amountX) / 10 ** tokenFrom.decimals, undefined, {
                        maximumFractionDigits: tokenFrom.decimals
                      })
                    : 0}
                </span>
                <span className={styles.usd}>≈ $0</span>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.info}>
                <div>{TokenToIcon}</div>
                <span>{tokenTo.name}</span>
              </div>
              <div className={styles.value}>
                <span>
                  {zapInResponse
                    ? numberWithCommas(Number(zapInResponse.amountY) / 10 ** tokenTo.decimals, undefined, {
                        maximumFractionDigits: tokenTo.decimals
                      })
                    : 0}
                </span>
                <span className={styles.usd}>≈ $0</span>
              </div>
            </div>
          </div>
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

      {/* {zapInResponse && (
        <div>
          <p>
            {zapInResponse.amountToX} {tokenZap.name} will convert to {zapInResponse.amountX} {tokenFrom.name}
          </p>
          <p>
            {zapInResponse.amountToY} {tokenZap.name} will convert to {zapInResponse.amountY} {tokenTo.name}
          </p>
        </div>
      )} */}

      <div className={styles.btn}>
        {(() => {
          const btnText = getButtonMessage();
          return (
            <Button
              type="primary"
              disabled={false}
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
