import { DEFAULT_SLIPPAGE, OPTIONS_SLIPPAGE } from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as TransSetting } from 'assets/images/trans_setting.svg';
import cn from 'classnames/bind';
import useConfigReducer from 'hooks/useConfigReducer';
import { FC, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import styles from './SlippageModal.module.scss';

const cx = cn.bind(styles);

interface ModalProps {
  setUserSlippage: React.Dispatch<React.SetStateAction<number>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userSlippage: number;
  isBotomSheet?: boolean;
}

export const SlippageModal: FC<ModalProps> = ({ setUserSlippage, setVisible, isBotomSheet }) => {
  const DEFAULT_INFDEX_SLIPPAGE_OPTION = OPTIONS_SLIPPAGE.indexOf(DEFAULT_SLIPPAGE);
  const [indexChosenOption, setIndexChosenOption] = useState(DEFAULT_INFDEX_SLIPPAGE_OPTION);
  const [theme] = useConfigReducer('theme');
  const [manualSlippage, setManualSlippage] = useState(DEFAULT_SLIPPAGE);

  return (
    <div className={cx('setting', `${theme}-modal`, { isBotomSheet })}>
      <div className={cx('header')}>
        <div className={cx('title')}>
          <TransSetting className={cx('btn')} />
          <div>Transaction settings</div>
        </div>
        <CloseIcon className={cx('close-icon')} onClick={() => setVisible(false)} />
      </div>
      <div className={cx('subtitle')}>Slippage tolerance</div>
      <div className={cx('options')}>
        {OPTIONS_SLIPPAGE.map((option, idx) => (
          <div
            className={cx('item', {
              isChosen: indexChosenOption === idx
            })}
            key={idx}
            onClick={() => {
              setUserSlippage(option);
              setIndexChosenOption(idx);
            }}
          >
            {option}%
          </div>
        ))}
        <div
          className={cx('item', 'border', {
            isChosen: indexChosenOption === OPTIONS_SLIPPAGE.length
          })}
          onClick={() => {
            // use prev input as slippage.
            if (manualSlippage) {
              setIndexChosenOption(OPTIONS_SLIPPAGE.length);
              setUserSlippage(manualSlippage);
            }
          }}
        >
          <NumberFormat
            className={cx('input')}
            thousandSeparator
            decimalScale={6}
            placeholder={`${DEFAULT_SLIPPAGE}`}
            isAllowed={(values) => {
              const { floatValue } = values;
              // allow !floatValue to let user can clear their input
              return !floatValue || (floatValue >= 0 && floatValue <= 100);
            }}
            onValueChange={({ floatValue }: NumberFormatValues) => {
              // if user clear input, change slippage to default config.
              if (floatValue === undefined) {
                setUserSlippage(DEFAULT_SLIPPAGE);
                setIndexChosenOption(DEFAULT_INFDEX_SLIPPAGE_OPTION);
              } else {
                setUserSlippage(floatValue);
                indexChosenOption !== OPTIONS_SLIPPAGE.length && setIndexChosenOption(OPTIONS_SLIPPAGE.length);
              }
              setManualSlippage(floatValue);
            }}
            value={manualSlippage}
          />
          %
        </div>
      </div>
    </div>
  );
};
