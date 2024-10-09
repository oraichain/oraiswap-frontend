import { ReactComponent as ObridgeDarkImg } from 'assets/icons/obridge_full_dark.svg';
import { ReactComponent as ObridgeLightImg } from 'assets/icons/obridge_full_light.svg';
import cn from 'classnames/bind';
import { ConfigTheme, EVENT_CONFIG_THEME } from 'config/eventConfig';
import useTemporaryConfigReducer from 'hooks/useTemporaryConfigReducer';
import React from 'react';
import styles from './index.module.scss';
const cx = cn.bind(styles);

const PowerByOBridge: React.FC<{ theme: string }> = ({ theme }) => {
  const [event] = useTemporaryConfigReducer('event');
  const configTheme = EVENT_CONFIG_THEME[theme][event] as ConfigTheme;

  return (
    <>
      <div className={styles.eventItem}>
        {configTheme.swapBox.inner.bottomLeft && (
          <img className={styles.left} src={configTheme.swapBox.inner.bottomLeft} alt="" />
        )}
        {configTheme.swapBox.inner.bottomRight && (
          <img className={styles.right} src={configTheme.swapBox.inner.bottomRight} alt="" />
        )}
      </div>
      <div className={styles.powered}>
        <div>Powered by</div>
        {theme === 'light' ? <ObridgeDarkImg /> : <ObridgeLightImg />}
      </div>
    </>
  );
};

export default PowerByOBridge;
