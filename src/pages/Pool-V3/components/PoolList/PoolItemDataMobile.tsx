import { toDisplay } from '@oraichain/oraidex-common';
import Loading from 'assets/gif/loading.gif';
import { ReactComponent as AddLPIcon } from 'assets/icons/addLP_ic.svg';
import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import classNames from 'classnames';
import { TooltipIcon } from 'components/Tooltip';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { POOL_TYPE } from 'pages/Pool-V3';

const PoolItemDataMobile = ({ item, theme, liquidity, volume, aprInfo, setIsOpenCreatePosition, setCurrentPool }) => {
  const navigate = useNavigate();
  const [openTooltip, setOpenTooltip] = useState(false);

  const isLight = theme === 'light';
  const IconBoots = isLight ? BootsIcon : BootsIconDark;
  const { FromTokenIcon, ToTokenIcon, feeTier, tokenXinfo, tokenYinfo, poolKey, type } = item;

  return (
    <div className={styles.mobilePoolItem}>
      <div className={classNames(styles.itemMobile, styles.flexStart)}>
        <div className={styles.name} onClick={() => navigate(`/pools-v3/${encodeURIComponent(poolKey)}`)}>
          <div className={styles.info}>
            <div className={classNames(styles.icons, styles[theme])}>
              <FromTokenIcon />
              <ToTokenIcon />
            </div>
            <span>
              {tokenXinfo?.name} / {tokenYinfo?.name}
            </span>
          </div>

          {type === POOL_TYPE.V3 && (
            <div>
              <span className={styles.fee}>Fee: {toDisplay(BigInt(feeTier), 10)}%</span>
            </div>
          )}
        </div>
        <div
          title="Add Position"
          className={classNames('newPosition')}
          onClick={() => {
            setIsOpenCreatePosition(true);
            setCurrentPool(item);
          }}
        >
          <AddLPIcon />
        </div>
      </div>
      <div className={styles.itemMobile}>
        <div className={styles.label}>Liquidity</div>
        <div className={styles.textRight}>
          <span className={classNames(styles.amount, { [styles.loading]: !liquidity })}>
            {liquidity || liquidity === 0 ? (
              formatDisplayUsdt(liquidity)
            ) : (
              <img src={Loading} alt="loading" width={30} height={30} />
            )}
          </span>
        </div>
      </div>

      <div className={styles.itemMobile}>
        <div className={styles.label}>Volume (24H)</div>
        <div className={styles.textRight}>
          <span className={styles.amount}>{formatDisplayUsdt(volume)}</span>
        </div>
      </div>
      <div className={styles.itemMobile}>
        <div className={styles.label}>APR</div>
        <div className={styles.apr}>
          <span className={styles.amount}>
            {aprInfo.apr.min === aprInfo.apr.max
              ? `${numberWithCommas(aprInfo.apr.min * 100, undefined, { maximumFractionDigits: 1 })}`
              : `${numberWithCommas(aprInfo.apr.min * 100, undefined, {
                  maximumFractionDigits: 1
                })} - ${numberWithCommas(aprInfo.apr.max * 100, undefined, { maximumFractionDigits: 1 })}`}
            %
          </span>
          <TooltipIcon
            className={styles.tooltipWrapper}
            placement="top"
            visible={openTooltip}
            icon={<IconInfo />}
            setVisible={setOpenTooltip}
            content={
              <div className={classNames(styles.tooltip, styles[theme])}>
                <div className={styles.itemInfo}>
                  <span>Swap fee</span>
                  <span className={styles.value}>
                    {numberWithCommas(aprInfo.swapFee * 100, undefined, { maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className={styles.itemInfo}>
                  <span>
                    Incentives Boost&nbsp;
                    <IconBoots />
                  </span>
                  <span className={styles.value}>
                    {aprInfo.incentivesApr.min === aprInfo.incentivesApr.max
                      ? `${numberWithCommas(aprInfo.incentivesApr.min * 100, undefined, { maximumFractionDigits: 1 })}`
                      : `${numberWithCommas(aprInfo.incentivesApr.min * 100, undefined, {
                          maximumFractionDigits: 1
                        })} - ${numberWithCommas(aprInfo.incentivesApr.max * 100, undefined, {
                          maximumFractionDigits: 1
                        })}`}
                    %
                  </span>
                </div>
                <div className={styles.itemInfo}>
                  <span>Total APR</span>
                  <span className={styles.totalApr}>
                    {aprInfo.apr.min === aprInfo.apr.max
                      ? `${numberWithCommas(aprInfo.apr.min * 100, undefined, { maximumFractionDigits: 1 })}`
                      : `${numberWithCommas(aprInfo.apr.min * 100, undefined, {
                          maximumFractionDigits: 1
                        })} - ${numberWithCommas(aprInfo.apr.max * 100, undefined, { maximumFractionDigits: 1 })}`}
                    %
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PoolItemDataMobile;
