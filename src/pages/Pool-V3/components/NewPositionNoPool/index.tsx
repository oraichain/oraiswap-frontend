import NumberFormat from 'react-number-format';
import styles from './index.module.scss';
import { TokenItemType, BigDecimal } from '@oraichain/oraidex-common';
import { PriceInfo } from '../CreatePosition';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { numberWithCommas } from 'helper/format';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-fill-ic.svg';
import classNames from 'classnames';
import { getMaxTick, getMinTick, Price } from '@oraichain/oraiswap-v3';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calcPrice,
  getTickAtSqrtPriceFromBalance,
  nearestTickIndex,
  toMaxNumericPlaces
} from '../PriceRangePlot/utils';

const NewPositionNoPool = ({
  fromToken,
  toToken,
  priceInfo,
  setPriceInfo,
  onChangeMidPrice,
  tickSpacing,
  isXtoY,
  onChangeRange,
  midPrice,
  showOnCreatePool
}: {
  fromToken: TokenItemType;
  toToken: TokenItemType;
  priceInfo: PriceInfo;
  setPriceInfo: React.Dispatch<React.SetStateAction<PriceInfo>>;
  onChangeMidPrice: (price: Price) => void;
  tickSpacing: number;
  isXtoY: boolean;
  onChangeRange: (left: number, right: number) => void;
  midPrice: number;
  showOnCreatePool?: boolean;
}) => {
  const { data: prices } = useCoinGeckoPrices();
  const currentPrice = new BigDecimal(prices[fromToken?.coinGeckoId] || 0)
    .div(prices[toToken?.coinGeckoId] || 1)
    .toNumber();

  const [leftRange, setLeftRange] = useState(tickSpacing * 10 * (isXtoY ? -1 : 1));
  const [rightRange, setRightRange] = useState(tickSpacing * 10 * (isXtoY ? 1 : -1));

  const [leftInput, setLeftInput] = useState(
    calcPrice(leftRange, isXtoY, fromToken.decimals, toToken.decimals).toString()
  );
  const [rightInput, setRightInput] = useState(
    calcPrice(rightRange, isXtoY, fromToken.decimals, toToken.decimals).toString()
  );

  const [leftInputRounded, setLeftInputRounded] = useState((+leftInput).toFixed(12));
  const [rightInputRounded, setRightInputRounded] = useState((+rightInput).toFixed(12));

  const [midPriceInput, setMidPriceInput] = useState(
    priceInfo.startPrice.toString()
  );

  useEffect(() => {
    const tickIndex = getTickAtSqrtPriceFromBalance(
      +midPriceInput,
      tickSpacing,
      isXtoY,
      isXtoY ? fromToken.decimals : toToken.decimals,
      isXtoY ? toToken.decimals : fromToken.decimals
    );
    // console.log(
    //   'change mid price',
    //   calcPrice(
    //     Number(tickIndex),
    //     isXtoY,
    //     isXtoY ? fromToken.decimals : toToken.decimals,
    //     isXtoY ? toToken.decimals : fromToken.decimals
    //   ).toString()
    // );

    onChangeMidPrice(BigInt(tickIndex));
  }, [midPriceInput]);

  const setLeftInputValues = (val: string) => {
    // setLeftInput(toMaxNumericPlaces(+val, 5));
    setLeftInput(val);
    setLeftInputRounded(toMaxNumericPlaces(+val, 5));
  };

  const setRightInputValues = (val: string) => {
    // setRightInput(toMaxNumericPlaces(+val, 5));
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

  const changeRangeHandler = (left: number, right: number) => {
    setLeftRange(left);
    setRightRange(right);

    const leftInput = calcPrice(left, isXtoY, fromToken.decimals, toToken.decimals).toString();
    const rightInput = calcPrice(right, isXtoY, fromToken.decimals, toToken.decimals).toString();

    setLeftInputValues(leftInput);
    setRightInputValues(rightInput);

    onChangeRange(left, right);
  };

  const resetRange = () => {
    changeRangeHandler(
      midPrice + tickSpacing * 30 * (isXtoY ? -1 : 1),
      midPrice + tickSpacing * 30 * (isXtoY ? 1 : -1)
    );
  };

  useEffect(() => {
    // changeRangeHandler(leftRange, rightRange);
    resetRange();
    // console.log("call", midPrice);
  }, [midPrice]);

  const trimCommas = (val: string) => {
    return val.replace(/,/g, '');
  };

  const validateMidPriceInput = (midPriceInput: string) => {
    const value = trimCommas(midPriceInput);
    const minTick = getMinTick(tickSpacing);
    const maxTick = getMaxTick(tickSpacing);
    const minPrice = isXtoY
      ? calcPrice(minTick, isXtoY, fromToken.decimals, toToken.decimals)
      : calcPrice(maxTick, isXtoY, fromToken.decimals, toToken.decimals);
    const maxPrice = isXtoY
      ? calcPrice(maxTick, isXtoY, fromToken.decimals, toToken.decimals)
      : calcPrice(minTick, isXtoY, fromToken.decimals, toToken.decimals);
    const numericMidPriceInput = parseFloat(value);
    const validatedMidPrice = Math.min(Math.max(numericMidPriceInput, minPrice), maxPrice);
    return toMaxNumericPlaces(validatedMidPrice, 5);
  };

  const price = useMemo(() => {
    return calcPrice(midPrice, isXtoY, fromToken.decimals, toToken.decimals);
  }, [midPrice, isXtoY, fromToken.decimals, toToken.decimals]);

  return (
    <div className={styles.newPositionNoPool}>
      {!showOnCreatePool && <h1>Starting price</h1>}
      <div className={classNames(styles.warning, { [styles.warningOnCreatePool]: showOnCreatePool })}>
        <div>
          <WarningIcon />
        </div>
        <span>
          This pool does not exist yet. To create it, select the fee tier, initial price, and enter the amount of
          tokens.
        </span>
      </div>

      {showOnCreatePool && (
        <div className={styles.currentPriceOnCreatePool}>
          <p className={styles.titlePrice}>Current price</p>
          <p>
            1 {fromToken.name} = {numberWithCommas(currentPrice, undefined, { maximumFractionDigits: 6 })}{' '}
            {toToken.name}
          </p>
        </div>
      )}

      <div className={classNames(styles.price, { [styles.showOnCreatePool]: showOnCreatePool })}>
        <span>{fromToken.name} starting price</span>

        <div className={styles.input}>
          <NumberFormat
            placeholder="0.0"
            thousandSeparator
            className={styles.amount}
            decimalScale={toToken?.decimals || 6}
            disabled={false}
            type="text"
            value={midPriceInput}
            onChange={() => {}}
            isAllowed={(values) => {
              const { floatValue } = values;
              // allow !floatValue to let user can clear their input
              return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
            }}
            // onValueChange={({ floatValue }) => {
            //   setMidPriceInput(validateMidPriceInput((floatValue || 0).toString() || '0'));
            //   setPriceInfo && setPriceInfo({ ...priceInfo, startPrice: floatValue });
            // }}
            onBlur={(e) => {
              // console.log('e.target.value', e.target.value);
              setMidPriceInput(validateMidPriceInput(e.target.value || '0'));
            }}
          />
          <div className={styles.symbol}>{toToken.name.toUpperCase()}</div>
        </div>
      </div>

      {!showOnCreatePool && <h1>Set Price Range</h1>}

      {!showOnCreatePool && (
        <div className={styles.currentPrice}>
          <span>Current Price</span>
          <div className={styles.value}>
            <h2>{numberWithCommas(currentPrice, undefined, { maximumFractionDigits: 6 })}</h2>
            <span>
              {toToken.name.toUpperCase()} / {fromToken.name.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      <div className={styles.range}>
        <div className={styles.item}>
          <div className={styles.form}>
            <span className={styles.label}>Min Price</span>

            <div className={styles.input}>
              <NumberFormat
                placeholder="0"
                thousandSeparator
                className={styles.amount}
                decimalScale={fromToken.decimals}
                disabled={false}
                type="text"
                value={leftInputRounded}
                // value={leftInput}
                onChange={() => {}}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                }}
                onValueChange={({ floatValue }) => {
                  onLeftInputChange((floatValue || 0).toString());
                }}
                onBlur={() => {
                  const newLeft = isXtoY
                    ? Math.min(
                        Number(rightRange - tickSpacing),
                        Number(nearestTickIndex(+leftInput, tickSpacing, isXtoY, fromToken.decimals, toToken.decimals))
                      )
                    : Math.max(
                        Number(rightRange + tickSpacing),
                        Number(nearestTickIndex(+leftInput, tickSpacing, isXtoY, fromToken.decimals, toToken.decimals))
                      );
                  changeRangeHandler(newLeft, rightRange);
                }}
              />
              <div className={styles.symbol}>
                {toToken.name.toUpperCase()} / {fromToken.name.toUpperCase()}
              </div>
            </div>
            <div className={styles.btnGroup}>
              <div
                className={styles.btn}
                onClick={() => {
                  const newLeft = isXtoY
                    ? Math.min(Number(rightRange - tickSpacing), Number(leftRange + tickSpacing))
                    : Math.max(Number(rightRange + tickSpacing), Number(leftRange - tickSpacing));
                  changeRangeHandler(newLeft, rightRange);
                }}
              >
                <PlusIcon />
              </div>
              <div
                className={styles.btn}
                onClick={() => {
                  const newLeft = isXtoY
                    ? Math.max(Number(getMinTick(tickSpacing)), Number(leftRange - tickSpacing))
                    : Math.min(Number(getMaxTick(tickSpacing)), Number(leftRange + tickSpacing));
                  changeRangeHandler(newLeft, rightRange);
                }}
              >
                <MinusIcon />
              </div>
            </div>
          </div>
          <div className={styles.percent}>
            <p>Min Current Price:</p>
            <span className={classNames(styles.value, { [styles.positive]: false })}>
              {(((+leftInput - price) / price) * 100).toLocaleString(undefined, { maximumFractionDigits: 3 })}%
            </span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.form}>
            <span className={styles.label}>Max Price</span>

            <div className={styles.input}>
              <NumberFormat
                placeholder="0"
                thousandSeparator
                className={styles.amount}
                decimalScale={6}
                disabled={false}
                type="text"
                value={rightInputRounded}
                onChange={() => {}}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                }}
                onValueChange={({ floatValue }) => {
                  onRightInputChange((floatValue || 0).toString());
                }}
                onBlur={() => {
                  const newRight = isXtoY
                    ? Math.max(
                        Number(leftRange + tickSpacing),
                        Number(nearestTickIndex(+rightInput, tickSpacing, isXtoY, fromToken.decimals, toToken.decimals))
                      )
                    : Math.min(
                        Number(leftRange - tickSpacing),
                        Number(nearestTickIndex(+rightInput, tickSpacing, isXtoY, fromToken.decimals, toToken.decimals))
                      );

                  changeRangeHandler(leftRange, newRight);
                }}
              />
              <div className={styles.symbol}>
                {toToken.name.toUpperCase()} / {fromToken.name.toUpperCase()}
              </div>
            </div>
            <div className={styles.btnGroup}>
              <div
                className={styles.btn}
                onClick={() => {
                  const newRight = isXtoY
                    ? Math.min(Number(getMaxTick(tickSpacing)), Number(rightRange + tickSpacing))
                    : Math.max(Number(getMinTick(tickSpacing)), Number(rightRange - tickSpacing));
                  changeRangeHandler(leftRange, newRight);
                }}
              >
                <PlusIcon />
              </div>
              <div
                className={styles.btn}
                onClick={() => {
                  const newRight = isXtoY
                    ? Math.max(Number(rightRange - tickSpacing), Number(leftRange + tickSpacing))
                    : Math.min(Number(rightRange + tickSpacing), Number(leftRange - tickSpacing));
                  changeRangeHandler(leftRange, newRight);
                }}
              >
                <MinusIcon />
              </div>
            </div>
          </div>
          <div className={styles.percent}>
            <p>Max Current Price:</p>
            <span className={classNames(styles.value, { [styles.positive]: true })}>
              {numberWithCommas(((+rightInput - price) / price) * 100, undefined, { maximumFractionDigits: 3 })}%
            </span>
          </div>
        </div>
      </div>

      <div className={classNames(styles.actions, { [styles.actionOnCreatePool]: showOnCreatePool })}>
        <button onClick={resetRange}>Reset range</button>
        <button
          onClick={() => {
            changeRangeHandler(
              isXtoY ? getMinTick(tickSpacing) : getMaxTick(tickSpacing),
              isXtoY ? getMaxTick(tickSpacing) : getMinTick(tickSpacing)
            );
          }}
        >
          Set full range
        </button>
      </div>
    </div>
  );
};

export default NewPositionNoPool;
