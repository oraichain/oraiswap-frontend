import cn from 'classnames/bind';
import BlocLoaderDex from 'components/BlocLoaderDex';
import React, { CSSProperties } from 'react';
import styles from './index.module.scss';
import { ReactComponent as ObridgeDarkImg } from 'assets/icons/obridge_full_dark.svg';
import { ReactComponent as ObridgeLightImg } from 'assets/icons/obridge_full_light.svg';
const cx = cn.bind(styles);

const PowerByOBridge: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div className={styles.powered}>
      <div>Powered by</div>
      {theme === 'light' ? <ObridgeDarkImg /> : <ObridgeLightImg />}
    </div>
  );
};

export default PowerByOBridge;
