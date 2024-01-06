import TokenBalance from 'components/TokenBalance';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './index.module.scss';

import { toAmount, toDisplay } from '@oraichain/oraidex-common';
import { ORAIX_DECIMAL } from 'pages/CoHarvest/constants';

export type InputBalanceType = {
  amount: string | number;
  onChangeAmount: any;
  balance: string;
  disable?: boolean;
};

const InputBalance = ({ amount, onChangeAmount, disable = false, balance }: InputBalanceType) => {
  const [coeff, setCoeff] = useState(0);

  return (
    <div className={styles.inputBalance}>
      <div className={styles.title}>
        Balance:{' '}
        <TokenBalance
          balance={{
            amount: balance,
            denom: 'ORAIX',
            decimals: 6
          }}
          className={styles.token}
        />
      </div>
      <div className={styles.input}>
        <NumberFormat
          placeholder="0"
          thousandSeparator
          className={styles.amount}
          decimalScale={6}
          disabled={disable}
          type="text"
          value={amount}
          onChange={() => {
            setCoeff(0);
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
        <span className={styles.symbol}>ORAIX</span>
      </div>
      <div className={styles.coeff}>
        {[0.25, 0.5, 0.75, 1].map((e) => {
          return (
            <button
              key={e}
              className={`${styles.button} ${coeff === e ? styles.active : ''}`}
              onClick={(event) => {
                event.stopPropagation();
                if (coeff === e) {
                  setCoeff(0);
                  onChangeAmount(0);
                  return;
                }

                onChangeAmount(toDisplay(balance, ORAIX_DECIMAL) * e);
                setCoeff(e);
              }}
            >
              {e * 100}%
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InputBalance;
