import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { toDisplay } from 'libs/utils';

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

const parseBalance = (
  balance:
    | number
    | {
        amount: string | number;
        decimals?: number;
        denom: string;
      }
) => {
  if (typeof balance === 'number') return balance;
  return toDisplay(balance?.amount, balance?.decimals);
};

const TokenBalance: React.FC<Props> = ({ balance, className, ...props }) => {
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
