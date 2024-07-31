import { BigDecimal, toAmount, TokenItemType } from '@oraichain/oraidex-common';
import {
  FeeTier,
  PoolKey,
  PoolWithPoolKey,
  TokenAmount
} from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as TooltipIc } from 'assets/icons/icon_tooltip.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { ReactComponent as Continuous } from 'assets/images/continuous.svg';
import { ReactComponent as Discrete } from 'assets/images/discrete.svg';
import classNames from 'classnames';
import { TooltipIcon } from 'components/Tooltip';
import { oraichainTokens } from 'config/bridgeTokens';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useTheme from 'hooks/useTheme';
import SingletonOraiswapV3, { ALL_FEE_TIERS_DATA } from 'libs/contractSingleton';
import {
  calculateSqrtPrice,
  getLiquidityByX,
  getLiquidityByY,
  getMaxTick,
  getMinTick,
  Price
} from 'pages/Pool-V3/packages/wasm/oraiswap_v3_wasm';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NewPositionNoPool from '../NewPositionNoPool';
import PriceRangePlot, { PlotTickData, TickPlotPositionData } from '../PriceRangePlot/PriceRangePlot';
import {
  calcPrice,
  calcTicksAmountInRange,
  calculateConcentrationRange,
  determinePositionTokenBlock,
  extractDenom,
  getConcentrationArray,
  handleGetCurrentPlotTicks,
  PositionTokenBlock,
  printBigint,
  toMaxNumericPlaces,
  trimLeadingZeros
} from '../PriceRangePlot/utils';
import SlippageSetting from '../SettingSlippage';
import TokenForm from '../TokenForm';
import styles from './index.module.scss';
import { convertBalanceToBigint } from 'pages/Pool-V3/helpers/number';
import { calcYPerXPriceBySqrtPrice } from 'pages/Pool-V3/helpers/helper';
import { numberWithCommas } from 'helper/format';

let args = {
  data: [
    {
      x: 2.3325447947424105e-10,
      y: 838.025081466683,
      index: -221800
    },
    {
      x: 4.095666666838582,
      y: 838.025081466683,
      index: 14100
    },
    {
      x: 4.13682673287254,
      y: 922.394132958037,
      index: 14200
    },
    {
      x: 5.929328716731552,
      y: 922.394132958037,
      index: 17800
    },
    {
      x: 5.988916466746253,
      y: 924.768717954767,
      index: 17900
    }
    // {
    //   x: 6.10989449517122,
    //   y: 924.768717954767,
    //   index: 18100
    // },
    // {
    //   x: 6.171296870242322,
    //   y: 1228.305125020546,
    //   index: 18200
    // },
    // {
    //   x: 6.359231302043402,
    //   y: 1228.305125020546,
    //   index: 18500
    // },
    // {
    //   x: 6.423139427776829,
    //   y: 1376.412271951954,
    //   index: 18600
    // },
    // {
    //   x: 6.552888898896388,
    //   y: 1376.412271951954,
    //   index: 18800
    // },
    // {
    //   x: 6.618743218034855,
    //   y: 1410.741026226673,
    //   index: 18900
    // },
    // {
    //   x: 6.685259350841405,
    //   y: 1410.741026226673,
    //   index: 19000
    // },
    // {
    //   x: 6.752443948298717,
    //   y: 1478.817972850278,
    //   index: 19100
    // },
    // {
    //   x: 6.820303728262422,
    //   y: 1478.817972850278,
    //   index: 19200
    // },
    // {
    //   x: 6.888845476080644,
    //   y: 1481.7502422703,
    //   index: 19300
    // },
    // {
    //   x: 6.958076045297614,
    //   y: 1702.310045768757,
    //   index: 19400
    // },
    // {
    //   x: 7.028002358348769,
    //   y: 1872.108774095546,
    //   index: 19500
    // },
    // {
    //   x: 7.0986314072148335,
    //   y: 2055.451081292155,
    //   index: 19600
    // },
    // {
    //   x: 7.1699702541778905,
    //   y: 2052.518811872133,
    //   index: 19700
    // },
    // {
    //   x: 7.314805946896031,
    //   y: 2052.518811872133,
    //   index: 19900
    // },
    // {
    //   x: 7.388317274916235,
    //   y: 2390.259553179729,
    //   index: 20000
    // },
    // {
    //   x: 7.462567366921463,
    //   y: 2390.259553179729,
    //   index: 20100
    // },
    // {
    //   x: 7.537563647291317,
    //   y: 2086.72314611395,
    //   index: 20200
    // },
    // {
    //   x: 7.767104985346781,
    //   y: 2086.72314611395,
    //   index: 20500
    // },
    // {
    //   x: 7.84516176585385,
    //   y: 1938.615999182542,
    //   index: 20600
    // },
    // {
    //   x: 8.165312561538634,
    //   y: 1938.615999182542,
    //   index: 21000
    // },
    // {
    //   x: 8.247371193639982,
    //   y: 1912.043286002816,
    //   index: 21100
    // },
    // {
    //   x: 8.58393563024182,
    //   y: 1912.043286002816,
    //   index: 21500
    // },
    // {
    //   x: 8.670201282734537,
    //   y: 1554.049862267195,
    //   index: 21600
    // },
    // {
    //   x: 8.757333875870172,
    //   y: 1565.535658474116,
    //   index: 21700
    // },
    // {
    //   x: 8.845342122132077,
    //   y: 1565.535658474116,
    //   index: 21800
    // },
    // {
    //   x: 8.934234821530346,
    //   y: 1497.458711850511,
    //   index: 21900
    // },
    // {
    //   x: 9.024020862509365,
    //   y: 1497.458711850511,
    //   index: 22000
    // },
    // {
    //   x: 9.114709222876904,
    //   y: 1159.717970542915,
    //   index: 22100
    // },
    // {
    //   x: 9.582006404274413,
    //   y: 1159.717970542915,
    //   index: 22600
    // },
    // {
    //   x: 9.67830233079223,
    //   y: 1148.232174335994,
    //   index: 22700
    // },
    // {
    //   x: 9.97303555905674,
    //   y: 1148.232174335994,
    //   index: 23000
    // },
    // {
    //   x: 10.07326119645574,
    //   y: 1140.476133241001,
    //   index: 23100
    // },
    // {
    //   x: 10.58970186938534,
    //   y: 1140.476133241001,
    //   index: 23600
    // },
    // {
    //   x: 10.696124794801273,
    //   y: 1010.198394790202,
    //   index: 23700
    // },
    // {
    //   x: 11.820986957813748,
    //   y: 1010.198394790202,
    //   index: 24700
    // },
    // {
    //   x: 11.939783882305553,
    //   y: 840.399666463413,
    //   index: 24800
    // },
    // {
    //   x: 99.46143826221535,
    //   y: 840.399666463413,
    //   index: 46000
    // },
    // {
    //   x: 100.4609921079365,
    //   y: 838.025081466683,
    //   index: 46100
    // },
    // {
    //   x: 4244507227.6354027,
    //   y: 838.025081466683,
    //   index: 221700
    // },
    // {
    //   x: 4287163091.0193543,
    //   y: 0,
    //   index: 221800
    // }
  ],
  leftRange: {
    index: 18700,
    x: 6.487689808579399
  },
  rightRange: {
    index: 20700,
    x: 7.924002990634724
  },
  midPrice: {
    index: 19700,
    x: 7.170765721904195
  },
  // className: 'css-rdpzh4-plot',
  disabled: false,
  plotMin: 6.171296870242322,
  plotMax: 8.17023457356607,
  loading: false,
  isXtoY: true,
  xDecimal: 6,
  yDecimal: 6,
  tickSpacing: 100,
  isDiscrete: true,
  coverOnLoading: false,
  hasError: false,
  positionOpeningMethod: 'concentration'
};

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
  const [openTooltip, setOpenTooltip] = useState(false);
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

  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');

  const [leftInputRounded, setLeftInputRounded] = useState('');
  const [rightInputRounded, setRightInputRounded] = useState('');

  const [plotMin, setPlotMin] = useState(0);
  const [plotMax, setPlotMax] = useState(1);

  const [isPlotDiscrete, setIsPlotDiscrete] = useState(false);

  const [isPoolExist, setIsPoolExist] = useState(false);

  const [poolInfo, setPoolInfo] = useState<PoolWithPoolKey>();

  const [currentPrice, setCurrentPrice] = useState(1);

  const [midPrice, setMidPrice] = useState<TickPlotPositionData>({
    index: 0,
    x: 1
  });

  const isXtoY = useMemo(() => {
    if (tokenFrom && tokenTo) {
      return extractDenom(tokenFrom) < extractDenom(tokenTo);
    }
    return true;
  }, [tokenFrom, tokenTo]);

  const [amountTo, setAmountTo] = useState<string>('');
  const [amountFrom, setAmountFrom] = useState<string>('');

  const tokenFromInput = {
    value: amountFrom,
    setValue: (value) => {
      console.log('value', value);
      if (!tokenFrom) {
        return;
      }

      console.log(
        '390',
        getOtherTokenAmount(toAmount(value, tokenFrom.decimals).toString(), Number(leftRange), Number(rightRange), true)
      );

      setAmountFrom(value);
      setAmountTo(
        getOtherTokenAmount(toAmount(value, tokenFrom.decimals).toString(), Number(leftRange), Number(rightRange), true)
      );
    },
    blocked:
      tokenFrom &&
      tokenTo &&
      determinePositionTokenBlock(
        BigInt(poolInfo ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index)),
        Math.min(Number(leftRange), Number(rightRange)),
        Math.max(Number(leftRange), Number(rightRange)),
        isXtoY
      ) === PositionTokenBlock.A,

    blockerInfo: 'Range only for single-asset deposit.',
    decimalsLimit: tokenFrom ? Number(tokenFrom.decimals) : 0
  };

  const tokenToInput = {
    value: amountTo,
    setValue: (value) => {
      if (!tokenTo) {
        return;
      }

      setAmountTo(value);
      setAmountFrom(
        getOtherTokenAmount(toAmount(value, tokenTo.decimals).toString(), Number(leftRange), Number(rightRange), false)
      );
    },
    blocked:
      tokenFrom &&
      tokenTo &&
      determinePositionTokenBlock(
        BigInt(poolInfo ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index)),
        Math.min(Number(leftRange), Number(rightRange)),
        Math.max(Number(leftRange), Number(rightRange)),
        isXtoY
      ) === PositionTokenBlock.B,

    blockerInfo: 'Range only for single-asset deposit.',
    decimalsLimit: tokenTo ? Number(tokenTo.decimals) : 0
  };

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
    checkNoPool(feeTier, tokenFrom, tokenTo);
  }, [feeTier, tokenFrom, tokenTo, isPoolExist]);

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

  const onLeftInputChange = (val: string) => {
    setLeftInput(val);
    setLeftInputRounded(val);
  };

  const onRightInputChange = (val: string) => {
    setRightInput(val);
    setRightInputRounded(val);
  };

  const onChangeRange = (left: number, right: number) => {
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
    leftRange = left;
    rightRange = right;
    // console.log({ left, right });

    setLeftRange(Number(left));
    setRightRange(Number(right));

    if (tokenFrom && (isXtoY ? rightRange > midPrice.index : rightRange < midPrice.index)) {
      const deposit = amountFrom;
      // console.log({ deposit, leftRange, rightRange });
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
      // console.log({ deposit, leftRange, rightRange });
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

    setLeftInputValues(calcPrice(Number(leftRange), isXtoY, tokenFrom.decimals, tokenTo.decimals).toString());
    setRightInputValues(calcPrice(Number(rightRange), isXtoY, tokenFrom.decimals, tokenTo.decimals).toString());

    onChangeRange(left, right);
  };

  const resetPlot = () => {
    if (positionOpeningMethod === 'range') {
      const initSideDist = Math.abs(
        midPrice.x -
          calcPrice(
            Math.max(
              getMinTick(notInitPoolKey.fee_tier.tick_spacing),
              Number(midPrice.index) - notInitPoolKey.fee_tier.tick_spacing * 15
            ),
            isXtoY,
            tokenFrom.decimals,
            tokenTo.decimals
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

  const reversePlot = () => {
    changeRangeHandler(rightRange, leftRange);
    if (plotMin > 0) {
      const pom = 1 / plotMin;
      setPlotMin(1 / plotMax);
      setPlotMax(pom);
    } else {
      const initSideDist = Math.abs(
        midPrice.x -
          calcPrice(
            Math.max(
              getMinTick(notInitPoolKey.fee_tier.tick_spacing),
              midPrice.index - notInitPoolKey.fee_tier.tick_spacing * 15
            ),
            isXtoY,
            tokenFrom.decimals,
            tokenTo.decimals
          )
      );

      setPlotMin(midPrice.x - initSideDist);
      setPlotMax(midPrice.x + initSideDist);
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
    if (fee && tokenFrom && tokenTo) {
      const denom_x = extractDenom(tokenFrom);
      const denom_y = extractDenom(tokenTo);
      const token_x = denom_x < denom_y ? denom_x : denom_y;
      const token_y = denom_x < denom_y ? denom_y : denom_x;
      const pool = await SingletonOraiswapV3.getPool({
        fee_tier: fee,
        token_x: token_x,
        token_y: token_y
      });
      setIsPoolExist(pool !== null);
      if (pool) {
        setPoolInfo(pool);
        setNotInitPoolKey(pool.pool_key);
      } else {
        setNotInitPoolKey({
          fee_tier: fee,
          token_x: token_x,
          token_y: token_y
        });
      }
      return;
    }
    setIsPoolExist(false);
  };

  const calcAmount = (amount: TokenAmount, left: number, right: number, tokenAddress: string) => {
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

        if (isMountedRef.current) {
          liquidityRef.current = positionLiquidity;
        }

        return tokenYAmount;
      }

      const { amount: tokenXAmount, l: positionLiquidity } = getLiquidityByY(
        BigInt(amount),
        lowerTick,
        upperTick,
        isPoolExist ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index),
        true
      );

      if (isMountedRef.current) {
        liquidityRef.current = positionLiquidity;
      }

      return tokenXAmount;
    } catch (error) {
      const result = (byX ? getLiquidityByY : getLiquidityByX)(
        BigInt(amount),
        lowerTick,
        upperTick,
        isPoolExist ? BigInt(poolInfo.pool.sqrt_price) : calculateSqrtPrice(midPrice.index),
        true
      );
      if (isMountedRef.current) {
        liquidityRef.current = result.l;
      }
    }

    return BigInt(0);
  };

  const getOtherTokenAmount = (amount: TokenAmount, left: number, right: number, byFirst: boolean) => {
    const [printToken, calcToken] = byFirst ? [tokenTo, tokenFrom] : [tokenFrom, tokenTo];

    if (!printToken || !calcToken) {
      return '0.0';
    }

    const result = calcAmount(amount, left, right, extractDenom(calcToken));

    return trimLeadingZeros(printBigint(result, printToken.decimals));
  };

  const onChangeMidPrice = (mid: Price) => {
    const convertedMid = Number(mid);
    console.log('mid', {
      index: convertedMid,
      x: calcPrice(convertedMid, isXtoY, tokenFrom.decimals, tokenTo.decimals)
    });

    setMidPrice({
      index: convertedMid,
      x: calcPrice(convertedMid, isXtoY, tokenFrom.decimals, tokenTo.decimals)
    });
    setPriceInfo({
      ...priceInfo,
      startPrice: calcPrice(convertedMid, isXtoY, tokenFrom.decimals, tokenTo.decimals)
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
  }, [liquidityData, midPrice]);

  useEffect(() => {
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

        console.log({ ticksData });
      };
      if (isPoolExist && notInitPoolKey) {
        fetchTickData();
      }
    } catch (error) {
      console.log('error: >> liquidity', error);
    } finally {
      setLoading(false);
    }
  }, [isPoolExist, notInitPoolKey, isXtoY]);

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

  const renderPriceSection = isPoolExist ? (
    <div className={styles.priceSectionExisted}>
      <div className={styles.wrapper}>
        <div className={styles.itemTitleWrapper}>
          <p className={styles.itemTitle}>Price Range</p>
          <p className={styles.liquidityActive}>
            Active Liquidity
            <TooltipIcon
              className={styles.tooltipWrapper}
              placement="top"
              visible={openTooltip}
              icon={<TooltipIc />}
              setVisible={setOpenTooltip}
              content={<div className={classNames(styles.tooltip, styles[theme])}>Active Liquidity</div>}
            />
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
            </div>{' '}
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
              x: calcPrice(leftRange, isXtoY, tokenFrom.decimals, tokenTo.decimals)
            }}
            rightRange={{
              index: rightRange,
              x: calcPrice(rightRange, isXtoY, tokenFrom.decimals, tokenTo.decimals)
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
            xDecimal={tokenFrom.decimals}
            yDecimal={tokenTo.decimals}
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
              <p>{numberWithCommas(midPrice.x, undefined, { maximumFractionDigits: 6 })}</p>
              <p className={styles.pair}>
                {tokenFrom.denom.toUpperCase()} / {tokenTo.denom.toUpperCase()}
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
                    {tokenFrom.denom.toUpperCase()} / {tokenTo.denom.toUpperCase()}
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
                    {tokenFrom.denom.toUpperCase()} / {tokenTo.denom.toUpperCase()}
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

  return (
    <div className={classNames('small_container', styles.createPosition)}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div
            className={styles.back}
            onClick={() => {
              // navigate(-1);
              navigate('/pools-v3');
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
              tokenFromInput={tokenFromInput}
              tokenToInput={tokenToInput}
              setFocusInput={setFocusId}
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
