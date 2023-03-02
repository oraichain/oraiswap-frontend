import classNames from 'classnames';
import { FC } from 'react';
import styles from './CheckBox.module.scss';

const CheckBox: FC<{
  className?: string;
  label: string;
  checked: boolean;
  onCheck: Function;
}> = ({ className, label, checked = false, onCheck }) => (
  <label className={classNames(styles.container, className)}>
    {label}
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        onCheck(e.target.checked);
      }}
    />
    <span className={styles.checkmark}></span>
  </label>
);

export default CheckBox;
