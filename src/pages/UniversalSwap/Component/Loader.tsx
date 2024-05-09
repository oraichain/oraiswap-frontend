import React from 'react';
import classNames from 'classnames';
import styles from 'components/Loader.module.scss';
// import { ReactComponent as BroadcastingIcon } from 'assets/icons/toast_broadcasting.svg';
import BroadcastingIcon from 'assets/icons/loading_circle.svg';

const Loader: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className, width, height }) => (
  <img src={BroadcastingIcon} alt="" className={classNames(styles.loader, className)} style={{ width, height }} />
  // <BroadcastingIcon className={classNames(styles.loader, className)} style={{ width, height }} />
);

export default Loader;
