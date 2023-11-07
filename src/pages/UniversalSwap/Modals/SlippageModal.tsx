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
}

export const SlippageModal: FC<ModalProps> = ({ userSlippage, setUserSlippage, setVisible }) => {
  const [indexChosenOption, setIndexChosenOption] = useState(OPTIONS_SLIPPAGE.indexOf(DEFAULT_SLIPPAGE));
  const [theme] = useConfigReducer('theme');

  return (
    <div className={cx('setting', `${theme}-modal`)}>
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
            setIndexChosenOption(OPTIONS_SLIPPAGE.length);
          }}
        >
          <NumberFormat
            className={cx('input')}
            thousandSeparator
            decimalScale={6}
            isAllowed={(values) => {
              const { floatValue } = values;
              return floatValue === undefined || (floatValue >= 0 && floatValue <= 100);
            }}
            onValueChange={({ floatValue }: NumberFormatValues) => {
              let value = floatValue;
              if (value === undefined) value = 0;
              setUserSlippage(value);
            }}
            value={userSlippage}
          />
          %
        </div>
      </div>
    </div>
  );
};
