import React from 'react'
import styles from './Button.module.scss'
import cn from 'classnames/bind';
import { FC } from 'react';

const cx = cn.bind(styles);
type ButtonType = 'primary' | 'secondary'
interface Props {
    type: ButtonType;
    onClick: () => void;
    children: React.ReactElement | React.ReactNode;
}

export const Button: React.FC<Props> = ({
    children,
    onClick,
    type
}) => {
    return (
        <button
            onClick={onClick}
            // className={classNames(styles.button, type)}
            className={cx('button', type)}
        >
            {children}
        </button>
    );
}