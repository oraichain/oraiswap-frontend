import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';
import debounce from 'lodash/debounce';

export type InputProps = Input & {
  onSearch?: (text: string) => void;
  isBorder?: boolean;
  theme?: string;
};

const Input: React.FC<InputProps> = ({ className, onSearch, ...props }) => (
  <input
    className={classNames(styles.input, className)}
    onChange={debounce((e) => {
      onSearch?.(e.target.value);
    }, 500)}
    {...props}
  />
);

export default Input;
