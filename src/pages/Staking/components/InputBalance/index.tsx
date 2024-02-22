import TokenBalance from 'components/TokenBalance';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './index.module.scss';

import { toAmount, toDisplay } from '@oraichain/oraidex-common';
import { ORAIX_DECIMAL } from 'pages/CoHarvest/constants';
import { numberWithCommas } from 'pages/Pools/helpers';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import { Button } from 'components/Button';
import { STAKE_TAB } from 'pages/Staking/constants';

export type InputBalanceType = {
  balance: string;
  type?: STAKE_TAB;
  label?: string;
};

const InputBalance = ({ balance, type = STAKE_TAB.Stake, label = 'Balance' }: InputBalanceType) => {
  const [theme] = useConfigReducer('theme');
  const [coeff, setCoeff] = useState(0);
  const [amount, setAmount] = useState<number>();

  return (
    <div className={styles.inputBalance}>
      <div className={styles.title}>
        <span className={styles.text}>You {type.toLowerCase()}</span>
        <span>
          {label}: <span className={styles.token}>{numberWithCommas(toDisplay(balance))} ORAIX</span>
        </span>
      </div>
      <div className={styles.inputWrapper}>
        <div className={styles.input}>
          <div className={styles.symbol}>{theme === 'light' ? <OraiXLightIcon /> : <OraiXIcon />}</div>
          <NumberFormat
            placeholder="0"
            thousandSeparator
            className={styles.amount}
            decimalScale={6}
            disabled={false}
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
              setAmount(floatValue);
            }}
          />
        </div>
        <div className={styles.stakeBtn}>
          <Button type="primary" onClick={() => console.log(amount)}>
            {type}
          </Button>
        </div>
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
                  setAmount(0);
                  return;
                }

                setAmount(toDisplay(balance, ORAIX_DECIMAL) * e);
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
