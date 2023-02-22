import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { parseAmountFromWithDecimal, parseBalanceNumber } from 'libs/utils';

type Props = {
  balance:
    | number
    | {
        amount: string | number;
        decimals?: number;
        denom: string;
      };

  className?: string;
} & NumberFormatProps;

const TokenBalance: React.FC<Props> = ({ balance, className, ...props }) => {
  const parseBalance = (
    balance:
      | number
      | {
          amount: string | number;
          decimals?: number;
          denom: string;
        }
  ) => {
    if (typeof balance === 'number') return parseBalanceNumber(balance);
    let bigBalance = balance?.amount || 0;
    if (typeof balance?.amount === 'number')
      bigBalance = parseBalanceNumber(balance?.amount || 0);
    return parseAmountFromWithDecimal(bigBalance, balance?.decimals);
  };

  const amount = parseBalance(balance);

  return (
    <NumberFormat
      className={className}
      value={amount}
      displayType={'text'}
      thousandSeparator={true}
      decimalScale={0}
      {...(typeof balance === 'number'
        ? { prefix: '$' }
        : { suffix: ` ${balance?.denom?.toUpperCase()}` })}
      {...props}
    />
  );
};

export default TokenBalance;
