import ShowImg from 'assets/icons/show.svg';
import HideImg from 'assets/icons/hidden.svg';
// import CheckImg from 'assets/icons/check.svg';
// import ArrowImg from 'assets/icons/arrow_new.svg';
import styles from './HeaderTab.module.scss';
import cn from 'classnames/bind';
import { useState } from 'react';
import { useGetPriceChange } from 'pages/Pools/hookV3';
import { useSelector } from 'react-redux';
import { selectChartTimeFrame, selectCurrentToken } from 'reducer/tradingSlice';
import { flattenTokens } from '@oraichain/oraidex-common';
import { tokensIcon } from 'config/chainInfos';
import useConfigReducer from 'hooks/useConfigReducer';

const cx = cn.bind(styles);
// const arr: Array<string> = ['ORAI/USDT', 'USDT/ORAI', 'ORAI/USD', 'USD/ORAI'];

// export const PoolSelect: React.FC<{
//   pool: string;
//   setPool: (item: string) => void;
//   setIsOpen: (isOpen: boolean) => void;
// }> = ({ setIsOpen, setPool, pool }) => {
//   return (
//     <div className={cx('items')}>
//       <ul>
//         {arr.map((item: string) => {
//           return (
//             <li
//               key={item}
//               onClick={async (e) => {
//                 e.stopPropagation();
//                 setPool(item);
//                 setIsOpen(false);
//               }}
//             >
//               <span>{item}</span>
//               {pool === item && <img src={CheckImg} alt="check" />}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

export const HeaderTab: React.FC<{
  hideChart: boolean;
  setHideChart: (isHideChart: boolean) => void;
  toTokenDenom: string;
}> = ({ setHideChart, hideChart, toTokenDenom }) => {
  const [theme] = useConfigReducer('theme');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const currentPair = useSelector(selectCurrentToken);
  const tf = useSelector(selectChartTimeFrame);
  // const [pool, setPool] = useState<string>('OHAI/USDT');
  const tokenPrice = flattenTokens.find((token) => token.denom === toTokenDenom);
  const { isLoading, priceChange } = useGetPriceChange({
    base_denom: currentPair.info.split('-')[0],
    quote_denom: currentPair.info.split('-')[1],
    tf
  });
  const tokenPriceIcon = tokenPrice && tokensIcon.find(tokenIcon => tokenIcon.coinGeckoId === tokenPrice.coinGeckoId)
  const isIncrement = priceChange && Number(priceChange.price_change) > 0;

  return (
    <div className={cx('headerTab')}>
      <div>
        {!hideChart && (
          <>
            {/* <div className={cx('top')} onClick={() => setIsOpen(!isOpen)}> */}
            {/* <span>{pool}</span>
              <img src={ArrowImg} alt="arrow" /> */}
            {/* </div> */}
            {/* {isOpen && <PoolSelect setIsOpen={setIsOpen} pool={pool} setPool={setPool} />} */}
            {isLoading ? (
              '-'
            ) : (
              <div className={cx('bottom')}>
                <div className={cx('balance')}>{priceChange.price.toFixed(6)} </div>
                <div className={cx('denom')}>{tokenPrice && tokenPrice.name}</div>
                {tokenPriceIcon && (theme === 'light' ? <tokenPriceIcon.IconLight className={cx('icon')} /> : <tokenPriceIcon.Icon className={cx('icon')} />)}
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
