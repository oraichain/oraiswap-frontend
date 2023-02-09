import React, { CSSProperties, memo } from 'react';
import cn from 'classnames/bind';
import styles from './index.module.scss';
import BlocLoaderDex from 'components/BlocLoaderDex';
const cx = cn.bind(styles);

const LoadingBox: React.FC<{
  loading: boolean;
  children: React.ReactElement | React.ReactNode;
  styles?: CSSProperties;
}> = ({ loading, children, styles }) => {
  return (
    <>
      {loading ? (
        <div style={styles} className={cx('loading-wrap')}>
          <BlocLoaderDex open={true} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default memo(LoadingBox);
