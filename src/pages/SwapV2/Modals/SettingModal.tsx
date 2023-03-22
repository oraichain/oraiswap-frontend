import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import TransSetting from 'assets/images/trans_setting.svg';
import cn from 'classnames/bind';
import { FC, useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './SettingModal.module.scss';

const cx = cn.bind(styles);

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  slippage: number;
  setSlippage: any;
}

const options = [1, 3, 5]

const SettingModal: FC<ModalProps> = ({ slippage, setSlippage }) => {
  const [chosenOption, setChosenOption] = useState(0);

  return (
    <div className={cx('setting')}>
      <div className={cx('header')}>
        <div className={cx('title')}>

          <img className={cx('btn')} src={TransSetting} alt="btn" />
          <div>Transaction settings</div>
        </div>
        <CloseIcon className={cx('close-icon')} />
      </div>
      <div className={cx("subtitle")}>Slippage tolerance</div>
      <div className={cx('options')}>
        {options.map((option, idx) => (
          <div
            className={cx('item', {
              isChosen: chosenOption === idx
            })}
            key={idx}
            onClick={() => {
              setSlippage(option);
              setChosenOption(idx);
            }}
          >
            {option}%
          </div>
        ))}
        <div
          className={cx('item', 'border', {
            isChosen: chosenOption === 3
          })}
          onClick={() => setChosenOption(3)}
        >
          <NumberFormat
            className={cx('input')}
            thousandSeparator
            decimalScale={6}
            defaultValue={2.5}
            type="text"
            max={100}
          />
          %
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
