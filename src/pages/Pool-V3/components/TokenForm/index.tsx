import styles from './index.module.scss';
import { ReactComponent as SwitchIcon } from 'assets/icons/ant_swap_light.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/ic_arrow_down.svg';
import { TokenItemType, toDisplay } from '@oraichain/oraidex-common';
import SelectToken from '../SelectToken';
import { Dispatch, SetStateAction } from 'react';
import { getIcon } from 'helper';
import useTheme from 'hooks/useTheme';
import NumberFormat from 'react-number-format';
import { numberWithCommas } from 'helper/format';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { RootState } from 'store/configure';
import { useSelector } from 'react-redux';
import { Button } from 'components/Button';
import classNames from 'classnames';
import { FeeTier } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { ALL_FEE_TIERS_DATA } from 'libs/contractSingleton';

const TokenForm = ({
  tokenFrom,
  handleChangeTokenFrom,
  tokenTo,
  handleChangeTokenTo,
  setFee,
  setFromAmount,
  setToAmount,
  toAmount,
  fromAmount,
  fee
}: {
  tokenFrom: TokenItemType;
  handleChangeTokenFrom: (token) => void;
  tokenTo: TokenItemType;
  handleChangeTokenTo: (token) => void;
  setFee: Dispatch<SetStateAction<FeeTier>>;
  setToAmount: Dispatch<SetStateAction<number>>;
  setFromAmount: Dispatch<SetStateAction<number>>;
  toAmount: number;
  fromAmount: number;
  fee: FeeTier;
}) => {
  const theme = useTheme();
  const isLightTheme = theme === 'light';
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const { data: prices } = useCoinGeckoPrices();

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
  const fromUsd = (prices?.[tokenFrom?.coinGeckoId] * fromAmount).toFixed(6);
  const toUsd = (prices?.[tokenFrom?.coinGeckoId] * toAmount).toFixed(6);

  const handleSwitch = () => {
    const originFromToken = tokenFrom;
    const originToToken = tokenTo;

    setFromAmount(0);
    setToAmount(0);
    handleChangeTokenFrom(originToToken);
    handleChangeTokenTo(originFromToken);
  };

  return (
    <div className={styles.tokenForm}>
      <div className={styles.select}>
        <h1>Tokens</h1>
        <div className={styles.selectContent}>
          <SelectToken token={tokenFrom} handleChangeToken={handleChangeTokenFrom} otherTokenDenom={tokenTo?.denom} />
          <div className={classNames(styles.switch, styles[theme])} onClick={() => handleSwitch()}>
            <SwitchIcon />
          </div>
          <SelectToken token={tokenTo} handleChangeToken={handleChangeTokenTo} otherTokenDenom={tokenFrom?.denom} />
        </div>
        <div className={styles.fee}>
          {ALL_FEE_TIERS_DATA.map((e, index) => {
            return (
              <div
                className={classNames(styles.feeItem, { [styles.chosen]: e === fee })}
                key={`${index}-${e}-fee`}
                onClick={() => setFee(e)}
              >
                {toDisplay(e.fee.toString(), 10)}%
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.deposit}>
        <h1>Deposit Amount</h1>
        <div className={styles.itemInput}>
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
                placeholder="0"
                thousandSeparator
                className={styles.amount}
                decimalScale={6}
                disabled={false}
                type="text"
                value={fromAmount}
                onChange={() => {}}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  // allow !floatValue to let user can clear their input
                  return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                }}
                onValueChange={({ floatValue }) => {
                  setFromAmount && setFromAmount(floatValue);
                }}
              />
              <div className={styles.usd}>
                ≈ ${fromAmount ? numberWithCommas(Number(fromUsd) || 0, undefined, { maximumFractionDigits: 6 }) : 0}
              </div>
            </div>
          </div>
          <div className={styles.balance}>
            <p className={styles.bal}>
              <span>Balance:</span> {numberWithCommas(toDisplay(amounts[tokenFrom?.denom] || '0'))} {tokenFrom?.name}
            </p>
            <button disabled={!tokenFrom} onClick={() => setFromAmount(toDisplay(amounts[tokenFrom?.denom] || '0'))}>
              Max
            </button>
          </div>
        </div>
        <div className={styles.itemInput}>
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
                placeholder="0"
                thousandSeparator
                className={styles.amount}
                decimalScale={6}
                disabled={false}
                type="text"
                value={toAmount}
                onChange={() => {}}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  // allow !floatValue to let user can clear their input
                  return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                }}
                onValueChange={({ floatValue }) => {
                  setToAmount && setToAmount(floatValue);
                }}
              />
              <div className={styles.usd}>
                ≈ ${toAmount ? numberWithCommas(Number(toUsd) || 0, undefined, { maximumFractionDigits: 6 }) : 0}
              </div>
            </div>
          </div>
          <div className={styles.balance}>
            <p className={styles.bal}>
              <span>Balance:</span> {numberWithCommas(toDisplay(amounts[tokenTo?.denom] || '0'))} {tokenTo?.name}
            </p>
            <button
              className=""
              disabled={!tokenTo}
              onClick={() => setToAmount(toDisplay(amounts[tokenTo?.denom] || '0'))}
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className={styles.btn}>
        <Button type="primary" onClick={() => console.log('add liq')} disabled={!tokenFrom || !tokenTo}>
          Add Liquidity
        </Button>
      </div>
    </div>
  );
};

export default TokenForm;
