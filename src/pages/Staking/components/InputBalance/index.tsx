import { isMobile } from '@walletconnect/browser-utils';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './index.module.scss';

import { toAmount, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import { ORAIX_DECIMAL } from 'pages/CoHarvest/constants';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { ORAIX_TOKEN_INFO, STAKE_TAB } from 'pages/Staking/constants';

export type InputBalanceType = {
  showLoading?: boolean;
  balance: string;
  type?: STAKE_TAB;
  label?: string;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
  loading: boolean;
};

const InputBalance = ({
  showLoading = true,
  onSubmit,
  balance,
  type = STAKE_TAB.Stake,
  label = 'Balance',
  amount,
  setAmount,
  loading
}: InputBalanceType) => {
  const [theme] = useConfigReducer('theme');
  const [coeff, setCoeff] = useState(0);
  const { data: prices } = useCoinGeckoPrices();
  const amountUSD = getUsd(toAmount(amount), ORAIX_TOKEN_INFO, prices);

  const isInsufficient = amount && amount > toDisplay(balance);
  const disabled = loading || !amount || amount <= 0 || isInsufficient;

  const isMobileMode = isMobile();

  return (
    <div className={styles.inputBalance}>
      <div className={styles.title}>
        <span className={styles.text}>
          ORAIX Amount
          {/* You {type.toLowerCase()} */}
        </span>
        <span className={styles.balance}>
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
          <span className={styles.usd}>{formatDisplayUsdt(amountUSD)}</span>
        </div>

        <div className={`${styles.stakeBtn} ${styles.inDesktop}`}>
          <Button type="primary" onClick={() => onSubmit()} disabled={disabled}>
            {loading && <Loader width={22} height={22} />}&nbsp;
            {isInsufficient ? 'Insufficient' : type === STAKE_TAB.Stake ? 'Stake' : 'Unstake'}
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
      <div className={`${styles.stakeBtn} ${styles.inMobile}`}>
        <Button type="primary" onClick={() => onSubmit()} disabled={disabled}>
          {showLoading && loading && <Loader width={22} height={22} />}&nbsp;
          {isInsufficient ? 'Insufficient' : type === STAKE_TAB.Stake ? 'Stake' : 'Unstake'}
        </Button>
      </div>
    </div>
  );
};

export default InputBalance;
