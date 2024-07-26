import NumberFormat from 'react-number-format';
import styles from './index.module.scss';
import { TokenItemType, toDisplay, BigDecimal } from '@oraichain/oraidex-common';
import { PriceInfo } from '../CreatePosition';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { numberWithCommas } from 'helper/format';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-fill-ic.svg';
import classNames from 'classnames';

const NewPositionNoPool = ({
  fromToken,
  toToken,
  priceInfo,
  setPriceInfo
}: {
  fromToken: TokenItemType;
  toToken: TokenItemType;
  priceInfo: PriceInfo;
  setPriceInfo: React.Dispatch<React.SetStateAction<PriceInfo>>;
}) => {
  const { data: prices } = useCoinGeckoPrices();
  const currentPrice = new BigDecimal(prices[fromToken?.coinGeckoId] || 0)
    .div(prices[toToken?.coinGeckoId] || 1)
    .toNumber();

  return (
    <div className={styles.newPositionNoPool}>
      <h1>Starting price</h1>
      <div className={styles.warning}>
        <div>
          <WarningIcon />
        </div>
        <span>
          This pool does not exist yet. To create it, select the fee tier, initial price, and enter the amount of
          tokens.
        </span>
      </div>
      <div className={styles.price}>
        <span>{fromToken.name} starting price</span>

        <div className={styles.input}>
          <NumberFormat
            placeholder="0"
            thousandSeparator
            className={styles.amount}
            decimalScale={6}
            disabled={false}
            type="text"
            value={priceInfo.startPrice}
            onChange={() => {}}
            isAllowed={(values) => {
              const { floatValue } = values;
              // allow !floatValue to let user can clear their input
              return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
            }}
            onValueChange={({ floatValue }) => {
              setPriceInfo && setPriceInfo({ ...priceInfo, startPrice: floatValue });
            }}
          />
          <div className={styles.symbol}>{toToken.name.toUpperCase()}</div>
        </div>
      </div>

      <h1>Set Price Range</h1>

      <div className={styles.currentPrice}>
        <span>Current Price</span>
        <div className={styles.value}>
          <h2>{numberWithCommas(currentPrice, undefined, { maximumFractionDigits: 6 })}</h2>
          <span>
            {fromToken.name.toUpperCase()} / {toToken.name.toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.range}>
        <div className={styles.item}>
          <div className={styles.form}>
            <span className={styles.label}>Min Price</span>

            <div className={styles.input}>
              <NumberFormat
                placeholder="0"
                thousandSeparator
                className={styles.amount}
                decimalScale={6}
                disabled={false}
                type="text"
                value={priceInfo.minPrice}
                onChange={() => {}}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  // allow !floatValue to let user can clear their input
                  return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                }}
                onValueChange={({ floatValue }) => {
                  setPriceInfo && setPriceInfo({ ...priceInfo, minPrice: floatValue });
                }}
              />
              <div className={styles.symbol}>{fromToken.name.toUpperCase()}</div>
            </div>
            <div className={styles.btnGroup}>
              <div className={styles.btn}>
                <PlusIcon />
              </div>
              <div className={styles.btn}>
                <MinusIcon />
              </div>
            </div>
          </div>
          <div className={styles.percent}>
            <p>Min Current Price:</p>
            <span className={classNames(styles.value, { [styles.positive]: false })}>{-56.0}%</span>
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
                value={priceInfo.maxPrice}
                onChange={() => {}}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  // allow !floatValue to let user can clear their input
                  return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                }}
                onValueChange={({ floatValue }) => {
                  setPriceInfo && setPriceInfo({ ...priceInfo, maxPrice: floatValue });
                }}
              />
              <div className={styles.symbol}>{toToken.name.toUpperCase()}</div>
            </div>
            <div className={styles.btnGroup}>
              <div className={styles.btn}>
                <PlusIcon />
              </div>
              <div className={styles.btn}>
                <MinusIcon />
              </div>
            </div>
          </div>
          <div className={styles.percent}>
            <p>Max Current Price:</p>
            <span className={classNames(styles.value, { [styles.positive]: true })}>{+56.0}%</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button>Reset range</button>
        <button>Set full range</button>
      </div>
    </div>
  );
};

export default NewPositionNoPool;
