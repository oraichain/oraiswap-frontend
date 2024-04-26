import React from 'react';
import styles from './Button.module.scss';
import cn from 'classnames/bind';
import useTheme from 'hooks/useTheme';

const cx = cn.bind(styles);
type ButtonType =
  | 'primary'
  | 'secondary'
  | 'primary-sm'
  | 'secondary-sm'
  | 'disable-sm'
  | 'third'
  | 'third-sm'
  | 'error'
  | 'error-sm';
interface Props {
  type: ButtonType;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactElement | React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactElement | React.ReactNode;
  style?: React.CSSProperties;
}

export const Button: React.FC<Props> = ({ children, onClick, type, icon, style, ...rest }) => {
  const theme = useTheme();
  return (
    <button onClick={(event) => onClick(event)} className={cx('button', type, theme)} style={style} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};
