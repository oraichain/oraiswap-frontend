import { formatDisplayUsdt, numberWithCommas } from 'helper/format';
import styles from './index.module.scss';
import classNames from 'classnames';
import { TooltipIcon } from 'components/Tooltip';
import { useRef, useState } from 'react';
import { ReactComponent as RewardIcon } from 'assets/icons/rewardIc.svg';
import { ReactComponent as LiquidityIcon } from 'assets/icons/liquidity.svg';
import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import OraixIcon from 'assets/icons/oraix.svg';
import UsdtIcon from 'assets/icons/tether.svg';
import useTheme from 'hooks/useTheme';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { useNavigate } from 'react-router-dom';
import useOnClickOutside from 'hooks/useOnClickOutside';

const PositionItem = ({ item }) => {
  const theme = useTheme();
  const ref = useRef();
  const navigate = useNavigate();
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openCollapse, setCollapse] = useState(false);
  const IconBoots = theme === 'light' ? BootsIcon : BootsIconDark;

  useOnClickOutside(ref, () => {
    setCollapse(false);
  });

  return (
    <div ref={ref} className={styles.positionItem}>
      <div className={styles.trigger} onClick={() => setCollapse(!openCollapse)}>
        <div className={styles.name}>
          <div className={classNames(styles.icons, styles[theme])}>
            <img src={OraixIcon} alt="base-tk" />
            <img src={UsdtIcon} alt="quote-tk" />
          </div>
          <span>ORAIX / USDT</span>
          <div className={styles.fee}>
            <span className={styles.item}>Fee: 0.003%</span>
            <span className={classNames(styles.item, styles.status, { [styles.inRange]: true })}>
              {true ? 'In Range' : 'Out Range'}
            </span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.item}>
            <p>Price Range</p>
            <span className={styles.value}>8.75 - 9.67</span>
          </div>
          <div className={styles.item}>
            <p>My Liquidity</p>
            <span className={styles.value}>{formatDisplayUsdt(8612.21)}</span>
          </div>
          <div className={styles.item}>
            <p>APR</p>
            <span className={classNames(styles.value, styles.apr)}>
              76.20%&nbsp;
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
                      <span className={styles.value}>{numberWithCommas(11.91)}%</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <span>
                        ORAI Boost&nbsp;
                        <IconBoots />
                      </span>
                      <span className={styles.value}>{numberWithCommas(11.91)}%</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <span>Total APR</span>
                      <span className={styles.totalApr}>{numberWithCommas(11.91)}%</span>
                    </div>
                  </div>
                }
              />
            </span>
          </div>
        </div>
      </div>
      <div className={classNames(styles.content, { [styles.openCollapse]: openCollapse })}>
        <div className={styles.item}>
          <div className={styles.title}>
            <div>
              <LiquidityIcon />
            </div>
            Liquidity
          </div>
          <div className={styles.row}>
            <h4>Current Assets</h4>
            <div className={styles.itemRow}>
              <span className={classNames(styles.usd, { [styles.green]: true, [styles.red]: false })}>
                {formatDisplayUsdt(8612.12)}
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <img src={OraixIcon} alt="tokenIcon" />
                {numberWithCommas(8612.12)} ORAIX
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <img src={UsdtIcon} alt="tokenIcon" />
                {numberWithCommas(82.12)} USDT
              </span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.row}>
              <h4>
                Principal Assets
                <TooltipIcon
                  className={styles.tooltipWrapper}
                  placement="top"
                  visible={openTooltip}
                  icon={<IconInfo />}
                  setVisible={setOpenTooltip}
                  content={
                    <div className={classNames(styles.tooltip, styles[theme])}>
                      Provided liquidity amount from the time of your first LP depositing or last LP removing
                    </div>
                  }
                />
              </h4>
              <div className={styles.itemRow}>
                <span className={styles.usd}>{formatDisplayUsdt(8612.12)}</span>
                <span className={classNames(styles.token, styles[theme])}>
                  <img src={OraixIcon} alt="tokenIcon" />
                  {numberWithCommas(8612.12)} ORAIX
                </span>
                <span className={classNames(styles.token, styles[theme])}>
                  <img src={UsdtIcon} alt="tokenIcon" />
                  {numberWithCommas(82.12)} USDT
                </span>
              </div>
            </div>
            <div className={styles.btnGroup}>
              <Button type="third-sm" onClick={() => {}}>
                {/* <Loader width={20} height={20} />
                 */}
                Close Position
              </Button>
              <Button type="primary-sm" onClick={() => navigate('/new-position/ORAIX/USDT/0.01')}>
                Add Liquidity
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.title}>
            <div>
              <RewardIcon />
            </div>
            Rewards
          </div>
          <div className={styles.row}>
            <h4>Total Reward Earned</h4>
            <div className={styles.itemRow}>
              <span className={styles.usd}>{formatDisplayUsdt(8612.12)}</span>
              <span className={classNames(styles.token, styles[theme])}>
                <img src={OraixIcon} alt="tokenIcon" />
                {numberWithCommas(8612.12)} ORAIX
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <img src={UsdtIcon} alt="tokenIcon" />
                {numberWithCommas(82.12)} USDT
              </span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.row}>
              <h4>Unclaimed Rewards</h4>
              <div className={styles.itemRow}>
                <span className={styles.usd}>{formatDisplayUsdt(8612.12)}</span>
                <span className={classNames(styles.token, styles[theme])}>
                  <img src={OraixIcon} alt="tokenIcon" />
                  {numberWithCommas(8612.12)} ORAIX
                </span>
                <span className={classNames(styles.token, styles[theme])}>
                  <img src={UsdtIcon} alt="tokenIcon" />
                  {numberWithCommas(82.12)} USDT
                </span>
              </div>
            </div>
            <div className={styles.btnGroup}>
              <Button type="third-sm" onClick={() => {}}>
                {/* <Loader width={20} height={20} />
                 */}
                Claim Rewards
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionItem;
