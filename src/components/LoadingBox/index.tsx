import React, { CSSProperties } from 'react';
import cn from 'classnames/bind';
import styles from './index.module.scss';
import BlocLoaderOsmosis from 'components/BlocLoaderOsmosis';
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
          <BlocLoaderOsmosis open={true} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingBox;
