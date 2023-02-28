import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';
import debounce from 'lodash/debounce';

export type InputProps = React.PropsWithChildren<
  React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    placeholder: string;
    onSearch?: (text: string) => void;
  }
>;

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
