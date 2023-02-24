import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

const Input: React.FC<
  React.PropsWithChildren<
    React.InputHTMLAttributes<HTMLInputElement> & {
      className?: string;
      placeholder: string;
      onSearch?: (text: string) => void;
    }
  >
> = ({ className, onSearch, ...props }) => (
  <input
    className={classNames(styles.input, className)}
    onChange={(e) => {
      onSearch?.(e.target.value);
    }}
    {...props}
  />
);

export default Input;
