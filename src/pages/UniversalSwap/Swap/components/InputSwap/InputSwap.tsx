import { CoinIcon, TokenItemType } from '@oraichain/oraidex-common';
import ArrowImg from 'assets/icons/arrow_new.svg';
import cn from 'classnames/bind';
import TokenBalance from 'components/TokenBalance';
import NumberFormat from 'react-number-format';
import { TokenInfo } from 'types/token';
import styles from './InputSwap.module.scss';
import { chainInfosWithIcon } from 'config/chainInfos';
import { Themes } from 'context/theme-context';

const cx = cn.bind(styles);

export const AMOUNT_BALANCE_ENTRIES_UNIVERSAL_SWAP: [number, string, string][] = [
  [0.5, '50%', 'half'],
  [1, '100%', 'max']
];

interface InputSwapProps {
  Icon: CoinIcon;
  IconNetwork: CoinIcon;
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
}

export default function InputSwapV4({
  Icon,
  IconNetwork,
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
  coe
}: InputSwapProps) {
  const chainInfo = chainInfosWithIcon.find((chain) => chain.chainId === selectChain);
  const isLightMode = theme === 'light';

  return (
    <>
      <div className={cx('input-swap-balance', type === 'from' && 'is-enable-coeff')}>
        <div className={cx('select-chain')}>
          {/* <span>{type}</span> */}
          <div className={cx('left')} onClick={() => setIsSelectChain(true)}>
            <div className={cx('icon')}>
              {IconNetwork && isLightMode ? (
                <chainInfo.IconLight className={cx('logo')} />
              ) : (
                <chainInfo.Icon className={cx('logo')} />
              )}
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
            <div className={cx('icon')}>{Icon && <Icon className={cx('logo')} />}</div>
            <div className={cx('section')}>
              <div className={cx('name')}>{token?.name}</div>
            </div>
            <img src={ArrowImg} alt="arrow" />
          </div>
        </div>
        <div className={cx('box-input')}>
          <div className={cx('input')}>
            <NumberFormat
              placeholder="0"
              thousandSeparator
              className={cx('amount')}
              decimalScale={6}
              disabled={disable}
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
                onChangeAmount && onChangeAmount(floatValue);
              }}
            />
          </div>
          <div className={cx('usd')}>≈ ${amount ? Number(usdPrice) || 0 : 0}</div>
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
