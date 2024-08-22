import { CoinIcon, TokenItemType } from '@oraichain/oraidex-common';
import ArrowImg from 'assets/icons/arrow_new.svg';
import cn from 'classnames/bind';
import TokenBalance from 'components/TokenBalance';
import NumberFormat from 'react-number-format';
import { TokenInfo } from 'types/token';
import styles from './InputSwap.module.scss';
import { chainInfosWithIcon, flattenTokensWithIcon } from 'config/chainInfos';
import { Themes } from 'context/theme-context';
import { numberWithCommas } from 'pages/Pools/helpers';
import { AMOUNT_BALANCE_ENTRIES_UNIVERSAL_SWAP } from 'helper/constants';

const cx = cn.bind(styles);

interface InputSwapProps {
  setIsSelectToken: (value: boolean) => void;
  setIsSelectChain: (value: boolean) => void;
  token: TokenItemType;
  amount: number;
  tokenFee: number;
  onChangeAmount?: (amount: number | undefined) => void;
  balance: string | bigint;
  disable?: boolean;
  originalToken?: TokenInfo;
  setCoe?: React.Dispatch<React.SetStateAction<number>>;
  coe?: number;
  usdPrice: string;
  type?: string;
  selectChain: string;
  onChangePercentAmount?: (coff: number) => void;
  theme: Themes;
  loadingSimulate?: boolean;
  impactWarning?: number;
  aiRouteEnable?: boolean;
}

export default function InputSwapV4({
  setIsSelectToken,
  setIsSelectChain,
  token,
  amount,
  onChangeAmount,
  tokenFee,
  balance,
  disable,
  originalToken,
  setCoe,
  usdPrice,
  type,
  selectChain,
  onChangePercentAmount,
  theme,
  coe,
  loadingSimulate,
  impactWarning,
  aiRouteEnable
}: InputSwapProps) {
  const chainInfo = chainInfosWithIcon.find((chain) => chain.chainId === selectChain);
  const tokenInfo = flattenTokensWithIcon.find((flattenToken) => flattenToken.coinGeckoId === token.coinGeckoId);
  const isLightMode = theme === 'light';

  return (
    <>
      <div className={cx('input-swap-balance', type === 'from' && 'is-enable-coeff')}>
        <div className={cx('select-chain')}>
          <div className={cx('left')} onClick={() => setIsSelectChain(true)}>
            <div className={cx('icon')}>
              {isLightMode ? <chainInfo.IconLight className={cx('logo')} /> : <chainInfo.Icon className={cx('logo')} />}
            </div>
            <div className={cx('section')}>
              <div className={cx('name')}>{chainInfo.chainName}</div>
            </div>
            <img src={ArrowImg} alt="arrow" />
          </div>
        </div>
        <div
          className={cx('show-balance')}
          // className={cx('show-balance', type === 'from' && 'is-enable-coeff')}
          // onClick={(event) => {
          //   if (type === 'from') {
          //     event.stopPropagation();
          //     onChangePercentAmount(1);
          //   }
          // }}
        >
          <div className={cx('bal')}>
            <span className={cx('prefix')}>Balance:&nbsp;</span>
            <TokenBalance
              balance={{
                amount: balance,
                decimals: originalToken?.decimals,
                denom: originalToken?.symbol || token?.name || ''
              }}
              decimalScale={6}
            />
          </div>
          {type === 'from' && (
            <div className={cx('coeff')}>
              {AMOUNT_BALANCE_ENTRIES_UNIVERSAL_SWAP.map(([coeff, text]) => (
                <button
                  key={coeff}
                  className={cx('percent', { activePercent: coe === coeff })}
                  onClick={(event) => {
                    event.stopPropagation();
                    onChangePercentAmount(coeff);
                    setCoe(coeff);
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={cx('input-swap-box')}>
        <div className={cx('box-select')} onClick={() => setIsSelectToken(true)}>
          <div className={cx('left')}>
            <div className={cx('icon')}>
              {isLightMode ? <tokenInfo.IconLight className={cx('logo')} /> : <tokenInfo.Icon className={cx('logo')} />}
            </div>

            <div className={cx('section')}>
              <div className={cx('name')}>{token?.name}</div>
            </div>
            <img src={ArrowImg} alt="arrow" />
          </div>
        </div>
        <div className={cx('box-input')}>
          <div className={styles.input}>
            {loadingSimulate && <div className={styles.mask} />}
            <NumberFormat
              placeholder="0"
              thousandSeparator
              className={cx('amount')}
              decimalScale={6}
              style={{
                opacity: loadingSimulate ? '0.4' : '1'
              }}
              disabled={loadingSimulate || disable}
              type="text"
              value={amount}
              onChange={() => {
                setCoe(0);
              }}
              isAllowed={(values) => {
                const { floatValue } = values;
                // allow !floatValue to let user can clear their input
                return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
              }}
              onValueChange={({ floatValue }) => {
                onChangeAmount?.(floatValue);
              }}
            />
          </div>
          <div className={cx('usd')}>
            <span>
              ≈ ${amount ? numberWithCommas(Number(usdPrice) || 0, undefined, { maximumFractionDigits: 6 }) : 0}
            </span>
            {!!impactWarning && Number(impactWarning) > 0 && !aiRouteEnable && (
              <span
                style={{
                  paddingLeft: 6,
                  color: impactWarning > 10 ? '#ff5947' : '#fff'
                }}
              >
                {' '}
                (-{numberWithCommas(impactWarning, undefined, { minimumFractionDigits: 1 })}%)
              </span>
            )}
          </div>
        </div>
      </div>
      {/* {!!tokenFee && (
        <div className={cx('input-swap-fee')}>
          <div>Fee: {tokenFee}%</div>
        </div>
      )} */}
    </>
  );
}
