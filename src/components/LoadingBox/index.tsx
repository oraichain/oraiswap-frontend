import React, { CSSProperties, memo } from 'react';
import cn from 'classnames/bind';
import styles from './index.module.scss';
import BlocLoaderDex from 'components/BlocLoaderDex';
const cx = cn.bind(styles);

const LoadingBox: React.FC<{
  loading: boolean;
  children: React.ReactElement | React.ReactNode;
  styles?: CSSProperties;
  theme?: string;
}> = ({ loading, children, styles, theme }) => {
  return (
    <>
      {loading ? (
        <div style={styles} className={cx('loading-wrap')}>
          <BlocLoaderDex open={true} theme={theme} />
          {children}
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default memo(LoadingBox);
