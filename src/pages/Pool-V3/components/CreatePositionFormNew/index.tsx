import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-fill-ic.svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPool, poolDetailV3Slice, setPoolId } from 'reducer/poolDetailV3';
import usePoolDetailV3Reducer from 'hooks/usePoolDetailV3Reducer';
import useAddLiquidityNew from 'pages/Pool-V3/hooks/useAddLiquidityNew';
import HistoricalChartDataWrapper from '../HistoricalChartDataWrapper';
import LiquidityChartWrapper from '../LiquidityChartWrapper';
import PriceDetail from '../PriceDetail';
import classNames from 'classnames';
import { oraichainTokens, toAmount, TokenItemType, USDT_CONTRACT } from '@oraichain/oraidex-common';
import { extractAddress } from 'pages/Pool-V3/helpers/format';
import {
  calculateSqrtPrice,
  getLiquidityByX,
  getLiquidityByY,
  getMaxTick,
  getMinTick,
  ZapInLiquidityResponse
} from '@oraichain/oraiswap-v3';
import { useDebounce } from 'hooks/useDebounce';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'store/configure';
import useTheme from 'hooks/useTheme';
import useConfigReducer from 'hooks/useConfigReducer';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import { getIcon } from 'helper';
import { TokenAmount } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { calcPrice, determinePositionTokenBlock, extractDenom, PositionTokenBlock, printBigint, toMaxNumericPlaces, trimLeadingZeros } from '../PriceRangePlot/utils';
import { calculateTokenAmountsWithSlippage } from 'pages/Pool-V3/helpers/helper';
import { convertBalanceToBigint } from 'pages/Pool-V3/helpers/number';

interface CreatePositionFormProps {
  poolId: string;
  slippage: number;
  showModal: boolean;
  onCloseModal: () => void;
}

const TOKEN_ZAP = oraichainTokens.find((e) => extractAddress(e) === USDT_CONTRACT);

const CreatePositionFormNew: FC<CreatePositionFormProps> = ({ poolId, slippage, showModal, onCloseModal }) => {
  const [toggleZap, setToggleZap] = useState(false);
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
  } = useAddLiquidityNew(poolId);
  // console.log({minPrice, maxPrice})

  const [tokenZap, setTokenZap] = useState<TokenItemType>(TOKEN_ZAP);
  const [zapAmount, setZapAmount] = useState<number | string>('');
  const [zapInResponse, setZapInResponse] = useState<ZapInLiquidityResponse>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [zapImpactPrice, setZapImpactPrice] = useState<number>(0.5);
  const [isVisible, setIsVisible] = useState(false);
  const [focusId, setFocusId] = useState<'from' | 'to' | 'zapper' | null>(null);
  const [leftInputRounded, setLeftInputRounded] = useState('');
  const [rightInputRounded, setRightInputRounded] = useState('');
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [zapError, setZapError] = useState<string | null>(null);
  const [amountTo, setAmountTo] = useState<number | string>();
  const [amountFrom, setAmountFrom] = useState<number | string>();
  const [swapFee, setSwapFee] = useState<number>(1.5);
  const [zapFee, setZapFee] = useState<number>(1);
  const [totalFee, setTotalFee] = useState<number>(1.75);
  const [matchRate, setMatchRate] = useState<number>(99.5);

  const endRef = useRef(null);
  const debounceZapAmount = useDebounce(zapAmount, 1000);
  const { data: prices } = useCoinGeckoPrices();
  const { poolList, poolPrice: extendPrices } = useGetPoolList(prices);
  const navigate = useNavigate();
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const theme = useTheme();
  const [walletAddress] = useConfigReducer('address');
  const loadOraichainToken = useLoadOraichainTokens();
  const isLightTheme = theme === 'light';

  const fromUsd = extendPrices?.[tokenX?.coinGeckoId]
    ? (extendPrices[tokenX.coinGeckoId] * Number(amountFrom || 0)).toFixed(6)
    : '0';
  const toUsd = extendPrices?.[tokenY?.coinGeckoId]
    ? (extendPrices[tokenY.coinGeckoId] * Number(amountTo || 0)).toFixed(6)
    : '0';
  const zapUsd = extendPrices?.[tokenZap?.coinGeckoId]
    ? (extendPrices[tokenZap.coinGeckoId] * Number(zapAmount || 0)).toFixed(6)
    : '0';

  const xUsd =
    zapInResponse &&
    (extendPrices?.[tokenX?.coinGeckoId] * (Number(zapInResponse.amountX || 0) / 10 ** tokenX.decimals)).toFixed(6);
  const yUsd =
    zapInResponse &&
    (extendPrices?.[tokenY?.coinGeckoId] * (Number(zapInResponse.amountY || 0) / 10 ** tokenY.decimals)).toFixed(6);

  const renderTokenObj = (coinGeckoId, size: number = 30) => {
    return {
      isLightTheme,
      type: 'token' as any,
      coinGeckoId,
      width: size,
      height: size
    };
  };

  const TokenFromIcon = tokenX && getIcon(renderTokenObj(tokenX.coinGeckoId));
  const TokenToIcon = tokenY && getIcon(renderTokenObj(tokenY.coinGeckoId));

  const getOtherTokenAmount = (amount: TokenAmount, left: number, right: number, byFirst: boolean) => {
    const [printToken, calcToken] = byFirst ? [tokenY, tokenX] : [tokenX, tokenY];

    if (!printToken || !calcToken) {
      return '0.0';
    }

    const result = calcAmount(amount, left, right, extractDenom(calcToken));

    return trimLeadingZeros(printBigint(result, printToken.decimals));
  };

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const liquidityRef = useRef<any>(0n);

  const calcAmount = (amount: TokenAmount, left: number, right: number, tokenAddress: string) => {
    if (!pool) return BigInt(0);
    if (!tokenX || !tokenY || isNaN(left) || isNaN(right)) {
      return BigInt(0);
    }

    const byX = tokenAddress === (true ? extractDenom(tokenX) : extractDenom(tokenY));

    const lowerTick = Math.min(left, right);
    const upperTick = Math.max(left, right);

    try {
      if (byX) {
        const { amount: tokenYAmount, l: positionLiquidity } = getLiquidityByX(
          BigInt(amount),
          lowerTick,
          upperTick,
          BigInt(pool.sqrt_price),
          true
        );

        let [, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
          poolKey.fee_tier.tick_spacing,
          BigInt(pool.sqrt_price),
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
        BigInt(pool.sqrt_price),
        true
      );

      let [xAmountWithSlippage] = calculateTokenAmountsWithSlippage(
        poolKey.fee_tier.tick_spacing,
        BigInt(pool.sqrt_price),
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
        BigInt(pool.sqrt_price),
        true
      );

      let [xAmountWithSlippage, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
        poolKey.fee_tier.tick_spacing,
        BigInt(pool.sqrt_price),
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

  useEffect(() => {
    if (focusId === 'from') {
      setAmountTo(
        getOtherTokenAmount(
          toAmount(amountFrom, tokenX.decimals).toString(),
          Number(lowerTick),
          Number(higherTick),
          true
        )
      );
    }
  }, [amountFrom, focusId]);

  const getTicksInsideRange = (left: number, right: number, isXToY: boolean) => {
    const leftMax = true ? getMinTick(poolKey.fee_tier.tick_spacing) : getMaxTick(poolKey.fee_tier.tick_spacing);
    const rightMax = true ? getMaxTick(poolKey.fee_tier.tick_spacing) : getMinTick(poolKey.fee_tier.tick_spacing);

    let leftInRange: number;
    let rightInRange: number;

    if (true) {
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
    const { leftInRange, rightInRange } = getTicksInsideRange(left, right, true);
    leftRange = leftInRange;
    rightRange = rightInRange;
    // } else {
    //   leftRange = left;
    //   rightRange = right;
    // }
    // leftRange = left;
    // rightRange = right;

    setLowerTick(Number(left));
    setHigherTick(Number(right));

    if (tokenX && (true ? rightRange > pool.current_tick_index : rightRange < pool.current_tick_index)) {
      const deposit = amountFrom;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint((deposit || '0').toString(), tokenX.decimals).toString(),
        Number(leftRange),
        Number(rightRange),
        true
      );

      if (tokenY && +deposit !== 0) {
        setAmountFrom(deposit);
        setAmountTo(amount);
        return;
      }
    }

    if (tokenY && (true ? leftRange < pool.current_tick_index : leftRange > pool.current_tick_index)) {
      const deposit = amountTo;
      const amount = getOtherTokenAmount(
        convertBalanceToBigint((deposit || '0').toString(), tokenY.decimals).toString(),
        Number(leftRange),
        Number(rightRange),
        false
      );

      if (tokenX && +deposit !== 0) {
        setAmountTo(deposit);
        setAmountFrom(amount);
      }
    }
  };

  const changeRangeHandler = (left: number, right: number) => {
    let leftRange: number;
    let rightRange: number;

    const { leftInRange, rightInRange } = getTicksInsideRange(left, right, true);
    leftRange = leftInRange;
    rightRange = rightInRange;

    setLowerTick(Number(leftRange));
    setHigherTick(Number(rightRange));

    const tokenXDecimals = true ? tokenX.decimals : tokenY.decimals;
    const tokenYDecimals = true ? tokenY.decimals : tokenX.decimals;

    setLeftInputValues(calcPrice(Number(leftRange), true, tokenXDecimals, tokenYDecimals).toString());
    setRightInputValues(calcPrice(Number(rightRange), true, tokenXDecimals, tokenYDecimals).toString());

    onChangeRange(left, right);
  };

  const [isFromBlocked, setIsFromBlocked] = useState(false);
  const [isToBlocked, setIsToBlocked] = useState(false);

  useEffect(() => {
    const fromBlocked =
      determinePositionTokenBlock(
        BigInt(pool?.sqrt_price || 0),
        Math.min(Number(lowerTick), Number(higherTick)),
        Math.max(Number(lowerTick), Number(higherTick)),
        true
      ) === PositionTokenBlock.A;

    const toBlocked =
      determinePositionTokenBlock(
        BigInt(pool?.sqrt_price || 0),
        Math.min(Number(lowerTick), Number(higherTick)),
        Math.max(Number(lowerTick), Number(higherTick)),
        true
      ) === PositionTokenBlock.B;

    setIsFromBlocked(fromBlocked);
    setIsToBlocked(toBlocked);
  }, [pool, lowerTick, higherTick]);

  return (
    <div className={styles.createPositionForm}>
      <div className={styles.tab}>
        <div className={styles.header}>
          <p>Price range</p>
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
