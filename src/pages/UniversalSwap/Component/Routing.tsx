import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as LineIcon } from 'assets/icons/line.svg';
import OraiIcon from 'assets/icons/oraichain_light.svg';
import styles from './Routing.module.scss';
import cn from 'classnames/bind';

const cx = cn.bind(styles);
export const RoutingSection: React.FC<{}> = () => {
  return (
    <div className={cx('routings')}>
      <div className={cx('container')}>
        <div className={cx('progresses')}>
          <div className={cx('label')}>Order Routing</div>
          <div className={cx('progress')}>
            <div className={cx('point')}>
              <img src={OraiIcon} width={20} height={20} alt="arrow" />
              <p>0.00 ORAI</p>
            </div>
            <div>
              <div className={cx('line')}>
                <LineIcon />
                <span>Active</span>
              </div>
            </div>
            <div className={cx('point')}>
              <img src={OraiIcon} width={20} height={20} alt="arrow" />
              <p>0.00 ORAI</p>
            </div>
            <div>
              <div className={cx('line')}>
                <LineIcon />
                <span>Active</span>
              </div>
            </div>
            <div className={cx('point')}>
              <img src={OraiIcon} width={20} height={20} alt="arrow" />
              <p>0.00 ORAI</p>
            </div>
          </div>
        </div>
        <div className={cx('info')}>
          <div>
            <div className={cx('pool')}>
              <div className={cx('key')}>Oraichain Pool: </div>
              <div className={cx('value')}>139,458.97 ORAI </div>
            </div>
            <div className={cx('pool')}>
              <div className={cx('key')}>Oraichain Poollllll: </div>
              <div className={cx('value')}>875.24 USDT</div>
            </div>
          </div>
          <div className={cx('pool')}>
            <div className={cx('key')}>Tron Network Pool: </div>
            <div className={cx('value')}>1,232.32 USDT</div>
          </div>
        </div>
      </div>
    </div>
  );
};
