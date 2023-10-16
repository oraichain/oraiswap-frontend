import styles from './InputSwap.module.scss';
import cn from 'classnames/bind';
import NumberFormat from 'react-number-format';
import TokenBalance from 'components/TokenBalance';
import ArrowImg from 'assets/icons/arrow_new.svg';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { TokenInfo } from 'types/token';
import { CoinGeckoId, CoinIcon, TokenItemType } from '@oraichain/oraidex-common';

const cx = cn.bind(styles);

interface InputSwapProps {
  Icon: CoinIcon;
  setIsSelectFrom: (value: boolean) => void;
  token: TokenItemType;
  amount: number;
  prices?: CoinGeckoPrices<CoinGeckoId>;
  tokenFee: number;
  onChangeAmount?: (amount: number | undefined) => void;
  balance: string | bigint;
  disable?: boolean;
  tokenInfoData?: TokenInfo;
  originalToken?: TokenInfo;
}

export default function InputSwapV3({
  Icon,
  setIsSelectFrom,
  token,
  amount,
  onChangeAmount,
  tokenFee,
  balance,
  disable,
  tokenInfoData,
  prices,
  originalToken
}: InputSwapProps) {
  return (
    <>
      <div className={cx('input-swap-box')}>
        <div className={cx('box-select')} onClick={() => setIsSelectFrom(true)}>
          <div className={cx('left')}>
            {Icon && <Icon className={cx('logo')} />}
            <div className={cx('section')}>
              <div className={cx('name')}>{token?.name}</div>
              <div className={cx('chain')}>{token?.org}</div>
            </div>
          </div>
          <div className={cx('right')}>
            <img src={ArrowImg} alt="arrow" />
          </div>
        </div>
        <NumberFormat
          placeholder="0"
          thousandSeparator
          className={cx('amount')}
          decimalScale={6}
          disabled={disable}
          type="text"
          value={amount}
          onValueChange={({ floatValue }) => {
            onChangeAmount && onChangeAmount(floatValue);
          }}
        />
      </div>
      <div className={cx('input-swap-balance')}>
        <div>
          <TokenBalance
            balance={{
              amount: balance,
              decimals: tokenInfoData?.decimals,
              denom: originalToken?.symbol || token?.name || ''
            }}
            prefix="Balance: "
            decimalScale={6}
          />
        </div>
        <div>≈ ${amount && (prices?.[tokenInfoData?.coinGeckoId] * amount || 0).toFixed(6)}</div>
      </div>
      <div className={cx('input-swap-fee')}>
        <div>Fee: 0.1%</div>
      </div>

      {/* <div className={cx('input-swap-box')}>
        <div className={cx('box-select')} onClick={() => setIsSelectFrom(true)}>
          <div className={cx('left')}>
            {Icon && <Icon className={cx('logo')} />}
            <div className={cx('section')}>
              <div className={cx('name')}>{token?.name}</div>
              <div className={cx('chain')}>{token?.org}</div>
            </div>
          </div>
          <div className={cx('right')}>
            <img src={ArrowImg} alt="arrow" />
          </div>
        </div>
        <NumberFormat
          placeholder="0"
          className={cx('amount')}
          thousandSeparator
          decimalScale={6}
          type="text"
          value={amount}
          onValueChange={({ floatValue }) => {
            onChangeAmount && onChangeAmount(floatValue);
          }}
        />
      </div>
      {tokenFee !== 0 && (
        <div className={cx('token-fee')}>
          <span>Token Fee</span>
          <span>{tokenFee}%</span>
        </div>
      )} */}
    </>
  );
}
