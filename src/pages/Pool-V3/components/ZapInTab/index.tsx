import styles from './index.module.scss';
import { BigDecimal, CoinGeckoPrices, toDisplay, TokenItemType } from '@oraichain/oraidex-common';
import { FC } from 'react';
import classNames from 'classnames';
import { numberWithCommas } from 'helper/format';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import { ReactComponent as ErrorIcon } from 'assets/icons/error-fill-icon.svg';
import { ReactComponent as OutputIcon } from 'assets/icons/zapOutput-ic.svg';
import TooltipHover from 'components/TooltipHover';
import NumberFormat from 'react-number-format';
import SelectToken from '../SelectToken';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import ZappingText from 'components/Zapping';
import { ZapInLiquidityResponse } from '@oraichain/oraiswap-v3';
import { getIcon } from 'helper';
import cn from 'classnames/bind';

interface ZapInTabProps {
  tokenZap: TokenItemType;
  zapAmount: number;
  simulating: boolean;
  zapError: string;
  zapInResponse: ZapInLiquidityResponse;
  amounts: AmountDetails;
  zapUsd: number;
  xUsd: number;
  yUsd: number;
  tokenFrom: TokenItemType;
  tokenTo: TokenItemType;
  tokenFromIcon: JSX.Element;
  tokenToIcon: JSX.Element;
  zapImpactPrice: number;
  swapFee: number;
  isVisible: boolean;
  zapFee: number;
  totalFee: number;
  matchRate: number;
  endRef: React.MutableRefObject<any>;
  setIsVisible: (value: boolean) => void;
  setZapAmount: (value: number) => void;
  setFocusId: (value: string | null) => void;
  setTokenZap: (token: TokenItemType) => void;
}

const cx = cn.bind(styles);

const ZapInTab: FC<ZapInTabProps> = ({
  tokenZap,
  zapAmount,
  simulating,
  zapError,
  zapInResponse,
  amounts,
  zapUsd,
  xUsd,
  yUsd,
  tokenFrom,
  tokenTo,
  tokenFromIcon,
  tokenToIcon,
  zapImpactPrice,
  swapFee,
  isVisible,
  zapFee,
  totalFee,
  matchRate,
  endRef,
  setIsVisible,
  setZapAmount,
  setFocusId,
  setTokenZap
}) => {
  return (
    <>
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
                <div className={styles.infoIcon}>{tokenFromIcon}</div>
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
                <div className={styles.infoIcon}>{tokenToIcon}</div>
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
                  ≈ ${zapInResponse ? numberWithCommas(Number(yUsd) || 0, undefined, { maximumFractionDigits: 3 }) : 0}
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
  );
};

export default ZapInTab;
