import HideImg from 'assets/icons/hidden.svg';
import ShowImg from 'assets/icons/show.svg';
import christmasTree from 'assets/images/christmas/xmas3.svg';
import cn from 'classnames/bind';
import { useGetPriceChange } from 'pages/Pools/hooks';
import { useSelector } from 'react-redux';
import { selectChartTimeFrame, selectCurrentToken } from 'reducer/tradingSlice';
import styles from './HeaderTab.module.scss';

const cx = cn.bind(styles);

export const HeaderTab: React.FC<{
  hideChart: boolean;
  setHideChart: (isHideChart: boolean) => void;
  toTokenDenom: string;
}> = ({ setHideChart, hideChart }) => {
  const currentPair = useSelector(selectCurrentToken);
  const [baseDenom, quoteDenom] = currentPair.symbol.split('/');
  const tf = useSelector(selectChartTimeFrame);
  const { isLoading, priceChange } = useGetPriceChange({
    base_denom: currentPair.info.split('-')[0],
    quote_denom: currentPair.info.split('-')[1],
    tf
  });
  const isIncrement = priceChange && Number(priceChange.price_change) > 0;

  return (
    <div className={cx('headerTab')}>
      <div>
        {!hideChart && (
          <>
            {isLoading ? (
              '-'
            ) : (
              <div className={cx('bottom')}>
                <img src={christmasTree} alt="christmasTree" />
                <div className={cx('pair')}>
                  <div className={cx('pair_info')}>{baseDenom && quoteDenom && baseDenom + '/' + quoteDenom}</div>
                  <div className={cx('balance', isIncrement ? 'increment' : 'decrement')}>
                    <span>{priceChange.price.toFixed(6)}</span>
                    <span className={cx('percent', isIncrement ? 'increment' : 'decrement')}>
                      {(isIncrement ? '+' : '') + priceChange.price_change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div>
        <div>
          <img
            className={cx('eyes')}
            src={hideChart ? ShowImg : HideImg}
            alt="eyes"
            onClick={() => setHideChart(!hideChart)}
          />
        </div>
      </div>
    </div>
  );
};
