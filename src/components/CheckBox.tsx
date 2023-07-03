import classNames from 'classnames';
import { FC } from 'react';
import styles from './CheckBox.module.scss';

const CheckBox: FC<{
  className?: string;
  radioBox?: boolean;
  label?: string;
  checked: boolean;
  onCheck: Function;
}> = ({ className, label, checked = false, onCheck, radioBox }) => {
  return (
    <label className={classNames(styles.container, className)}>
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onCheck(e.target.checked);
        }}
      />
      <span className={classNames(styles.checkmark, radioBox && styles.radioBox)}></span>
    </label >
  );
};
export default CheckBox;
