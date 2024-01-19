import HideImg from 'assets/icons/hidden.svg';
import ShowImg from 'assets/icons/show.svg';
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
                <div className={cx('balance')}>
                  {baseDenom &&
                    quoteDenom &&
                    '1 ' + baseDenom + ' ≈ ' + priceChange.price.toFixed(6) + ' ' + quoteDenom}
                </div>
                <div className={cx('percent', isIncrement ? 'increment' : 'decrement')}>
                  {(isIncrement ? '+' : '') + priceChange.price_change.toFixed(2)} %
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
