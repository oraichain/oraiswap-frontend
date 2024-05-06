import { CoinIcon, TokenItemType, toAmount, toDisplay } from '@oraichain/oraidex-common';
import classNames from 'classnames/bind';
import TokenBalance from 'components/TokenBalance';
import useConfigReducer from 'hooks/useConfigReducer';
import { TokenVault } from 'pages/Vaults/type';
import { FC, useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './InputWithOptionPercent.module.scss';

const cx = classNames.bind(styles);

export const InputWithOptionPercent: FC<{
  setAmountFromPercent: (value: bigint) => void;
  onValueChange?: (value: any) => void;
  onChange?: (e: any) => void;
  totalAmount: bigint;
  percentList?: number[];
  value: bigint | null;
  token: TokenItemType | TokenVault;
  hasPath?: boolean;
  isFocus?: boolean;
  prefixText?: string;
  TokenIcon?: CoinIcon;
  decimals?: number;
  amountInUsdt?: number;
}> = ({
  setAmountFromPercent,
  onValueChange,
  onChange,
  value,
  token,
  totalAmount,
  percentList = [25, 50, 75, 100],
  hasPath = false,
  isFocus = true,
  prefixText = 'Balance: ',
  TokenIcon,
  decimals = 6,
  amountInUsdt = 0
}) => {
  const [chosenOption, setChosenOption] = useState(-1);
  const [theme] = useConfigReducer('theme');
  const [inputValue, setInputValue] = useState<number | string>('');

  const onChangePercent = (percent: number) => {
    const HUNDRED_PERCENT_IN_DECIMALS = 100 * Math.pow(10, decimals);
    const amountFromPercent = (toAmount(percent, decimals) * totalAmount) / BigInt(HUNDRED_PERCENT_IN_DECIMALS);
    setAmountFromPercent(amountFromPercent);
  };

  return (
    <div className={cx('supply', theme, { 'has-path': hasPath })}>
      <div className={cx('balance')}>
        <div className={cx('amount', theme)}>
          {token && (
            <TokenBalance
              balance={{
                amount: totalAmount,
                denom: 'name' in token ? token?.name : token?.symbol,
                decimals: token?.decimals
              }}
              prefix={prefixText}
              decimalScale={6}
            />
          )}
        </div>
      </div>

      <div className={cx('input')}>
        {/* TODO: meaning deposit token, otherwise withdraw LP vault */}
        {token && 'name' in token ? (
          <div className={styles.strategy}>
            <div className={styles.strategyLogo}>{TokenIcon && <TokenIcon width={32} height={32} />}</div>
            <div className={`${styles.strategyName} ${styles[theme]}`}>
              <div className={styles.strategyNameTitle}>{token?.name}</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className={cx('input-amount')}>
          <NumberFormat
            className={cx('amount', theme)}
            thousandSeparator
            decimalScale={6}
            placeholder={'0'}
            value={value === null ? '' : toDisplay(value, decimals)}
            allowNegative={false}
            onChange={(e) => {
              onChange && onChange(e);
              setChosenOption(-1);
            }}
            onValueChange={(value) => {
              chosenOption === -1 && onValueChange && onValueChange(value);
            }}
            isAllowed={(values) => {
              const { floatValue } = values;
              // allow !floatValue to let user can clear their input
              return !floatValue || (floatValue >= 0 && floatValue <= 1e18);
            }}
          />

          <div className={cx('amount-usd', theme)}>
            <TokenBalance balance={amountInUsdt} decimalScale={2} prefix="~$" />
          </div>
        </div>
      </div>
      <div className={cx('options')}>
        {percentList.map((option, idx) => (
          <div
            className={cx('item', theme, {
              isChosen: isFocus && chosenOption === idx
            })}
            key={idx}
            onClick={() => {
              const amount = (BigInt(option) * totalAmount) / BigInt(100);
              setAmountFromPercent(amount);
              setChosenOption(idx);
              setInputValue('');
            }}
          >
            {option}%
          </div>
        ))}
        <div
          className={cx('item', theme, 'border', {
            isChosen: isFocus && chosenOption === 4
          })}
          onClick={() => setChosenOption(4)}
        >
          <input
            placeholder="0.00"
            type={'number'}
            value={inputValue}
            className={cx('input', theme)}
            onChange={(event) => {
              onChangePercent(+event.target.value);
              setInputValue(event.target.value);
            }}
          />
          <span>%</span>
        </div>
      </div>
    </div>
  );
};
