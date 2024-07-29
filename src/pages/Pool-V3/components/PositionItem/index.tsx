import { formatDisplayUsdt, numberWithCommas } from 'helper/format';
import styles from './index.module.scss';
import classNames from 'classnames';
import { TooltipIcon } from 'components/Tooltip';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { toDisplay } from '@oraichain/oraidex-common';
import {
  PrefixConfig,
  calculateFee,
  calculateTokenAmounts,
  formatNumbers,
  initialXtoY,
  showPrefix,
  tickerToAddress
} from 'pages/Pool-V3/helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { printBigint } from '../PriceRangePlot/utils';
import { network } from 'config/networks';

const shorterPrefixConfig: PrefixConfig = {
  B: 1000000000,
  M: 1000000,
  K: 1000
};

const PositionItem = ({ position }) => {
  const { min, max, fee } = position;
  const theme = useTheme();
  const ref = useRef();
  const navigate = useNavigate();
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openCollapse, setCollapse] = useState(false);
  const [address] = useConfigReducer('address');
  const [tick, setTick] = useState<any>({
    lowerTick: {},
    upperTick: {}
  });
  const IconBoots = theme === 'light' ? BootsIcon : BootsIconDark;

  const [xToY, setXToY] = useState<boolean>(
    initialXtoY(tickerToAddress(position?.pool_key.token_x), tickerToAddress(position?.pool_key.token_y))
  );

  useOnClickOutside(ref, () => {
    setCollapse(false);
  });

  const [tokenXLiquidity, tokenYLiquidity] = useMemo(() => {
    if (position?.poolData) {
      const convertedPool = {
        liquidity: BigInt(position.poolData.pool.liquidity),
        sqrt_price: BigInt(position.poolData.pool.sqrt_price),
        current_tick_index: position.poolData.pool.current_tick_index,
        fee_growth_global_x: BigInt(position.poolData.pool.fee_growth_global_x),
        fee_growth_global_y: BigInt(position.poolData.pool.fee_growth_global_y),
        fee_protocol_token_x: BigInt(position.poolData.pool.fee_protocol_token_x),
        fee_protocol_token_y: BigInt(position.poolData.pool.fee_protocol_token_y),
        start_timestamp: position.poolData.pool.start_timestamp,
        last_timestamp: position.poolData.pool.last_timestamp,
        fee_receiver: position.poolData.pool.fee_receiver
      };
      const res = calculateTokenAmounts(convertedPool, position);
      const x = res.x;
      const y = res.y;
      console.log({ x, y });

      return [+printBigint(x, position.tokenX.decimals), +printBigint(y, position.tokenY.decimals)];
    }

    return [0, 0];
  }, [position]);

  useEffect(() => {
    (async () => {
      const { pool_key, lower_tick_index, upper_tick_index } = position;
      const [lowerTickData, upperTickData] = await Promise.all([
        window.client.queryContractSmart(network.pool_v3, {
          tick: {
            index: lower_tick_index,
            key: pool_key
          }
        }),
        window.client.queryContractSmart(network.pool_v3, {
          tick: {
            index: upper_tick_index,
            key: pool_key
          }
        })
      ]);
      setTick({
        lowerTick: {
          fee_growth_outside_x: BigInt(lowerTickData.fee_growth_outside_x),
          fee_growth_outside_y: BigInt(lowerTickData.fee_growth_outside_y),
          index: lowerTickData.index,
          liquidity_change: BigInt(lowerTickData.liquidity_change),
          sign: lowerTickData.sign,
          liquidity_gross: BigInt(lowerTickData.liquidity_gross),
          seconds_outside: lowerTickData.seconds_outside,
          sqrt_price: BigInt(lowerTickData.sqrt_price)
        },
        upperTick: {
          fee_growth_outside_x: BigInt(upperTickData.fee_growth_outside_x),
          fee_growth_outside_y: BigInt(upperTickData.fee_growth_outside_y),
          index: lowerTickData.index,
          liquidity_change: BigInt(upperTickData.liquidity_change),
          sign: lowerTickData.sign,
          liquidity_gross: BigInt(upperTickData.liquidity_gross),
          seconds_outside: upperTickData.seconds_outside,
          sqrt_price: BigInt(upperTickData.sqrt_price)
        }
      });
    })();

    return () => {};
  }, []);

  const [tokenXClaim, tokenYClaim] = useMemo(() => {
    if (
      // waitingForTicksData === false &&
      // position?.poolData &&
      // typeof lowerTick !== 'undefined' &&
      // typeof upperTick !== 'undefined' &&
      tick.lowerTick.index &&
      tick.upperTick.index &&
      position.pool_data
    ) {
      const convertedPool = {
        liquidity: BigInt(position.poolData.pool.liquidity),
        sqrt_price: BigInt(position.poolData.pool.sqrt_price),
        current_tick_index: position.poolData.pool.current_tick_index,
        fee_growth_global_x: BigInt(position.poolData.pool.fee_growth_global_x),
        fee_growth_global_y: BigInt(position.poolData.pool.fee_growth_global_y),
        fee_protocol_token_x: BigInt(position.poolData.pool.fee_protocol_token_x),
        fee_protocol_token_y: BigInt(position.poolData.pool.fee_protocol_token_y),
        start_timestamp: position.poolData.pool.start_timestamp,
        last_timestamp: position.poolData.pool.last_timestamp,
        fee_receiver: position.poolData.pool.fee_receiver
      };
      const res = calculateFee(convertedPool, position, tick.lowerTick, tick.upperTick);
      const bnX = res.x;
      const bnY = res.y;

      return [+printBigint(bnX, position.tokenX.decimals), +printBigint(bnY, position.tokenY.decimals)];
    }

    return [0, 0];
    // }, [position, lowerTick, upperTick, waitingForTicksData]);
  }, [position, tick]);

  const tokenX = {
    name: position.tokenX.symbol,
    icon: position.tokenX.logoURI,
    decimal: position.tokenX.decimals,
    balance: +printBigint(BigInt(position.tokenX.balance || 0) ?? 0n, position.tokenX.decimals),
    liqValue: tokenXLiquidity,
    claimValue: tokenXClaim
    // usdValue:
    //   typeof tokenXPriceData?.price === 'undefined'
    //     ? undefined
    //     : tokenXPriceData.price * +printBigint(BigInt(position.tokenX.balance) ?? 0n, position.tokenX.decimals)
  };

  return (
    <div ref={ref} className={styles.positionItem}>
      <div className={styles.trigger} onClick={() => setCollapse(!openCollapse)}>
        <div className={styles.name}>
          <div className={classNames(styles.icons, styles[theme])}>
            <position.tokenXIcon />
            <position.tokenYIcon />
          </div>
          <span>
            {position.tokenXName} / {position.tokenYName}
          </span>
          <div className={styles.fee}>
            <span className={styles.item}>Fee: {fee}%</span>
            <span className={classNames(styles.item, styles.status, { [styles.inRange]: true })}>
              {true ? 'In Range' : 'Out Range'}
            </span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.item}>
            <p>Price Range</p>
            <span className={styles.value}>
              {formatNumbers(undefined)((xToY ? min : 1 / max).toString())}
              {showPrefix(xToY ? min : 1 / max, shorterPrefixConfig)}
              {' - '}
              {formatNumbers(undefined)((xToY ? max : 1 / min).toString())}
              {showPrefix(xToY ? max : 1 / min, shorterPrefixConfig)} {xToY ? position.tokenYName : position.tokenXName}{' '}
              per {xToY ? position.tokenXName : position.tokenYName}
            </span>
          </div>
          <div className={styles.item}>
            <p>My Liquidity</p>
            <span className={styles.value}>{formatDisplayUsdt(0)}</span>
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
              <Button
                type="third-sm"
                onClick={async () => {
                  // TODO: AMM v3 remove position
                  await window.client.execute(
                    address,
                    network.pool_v3,
                    {
                      remove_position: {
                        index: position.id
                      }
                    },
                    'auto',
                    ''
                  );
                }}
              >
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
                {numberWithCommas(tokenXClaim)} ORAIX
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <img src={UsdtIcon} alt="tokenIcon" />
                {numberWithCommas(tokenXClaim)} USDT
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
              <Button
                type="third-sm"
                onClick={async () => {
                  await window.client.execute(
                    address,
                    network.pool_v3,
                    {
                      claim_fee: {
                        index: position.id
                      }
                    },
                    'auto',
                    ''
                  );
                }}
              >
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
