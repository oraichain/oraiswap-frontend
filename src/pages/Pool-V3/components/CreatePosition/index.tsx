import classNames from 'classnames';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import useTheme from 'hooks/useTheme';

const CreatePosition = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <div className={classNames('small_container', styles.createPosition)}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.back} onClick={() => navigate('/pools-v3')}>
            <BackIcon />
          </div>
          <h1>Add new liquidity position</h1>
          <div className={styles.setting}>
            <SettingIcon />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.item}>TOKEN section</div>
          <div className={styles.item}>PRICE section</div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosition;
