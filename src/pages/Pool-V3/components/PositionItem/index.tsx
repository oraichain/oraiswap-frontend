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
import useTheme from 'hooks/useTheme';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { useNavigate } from 'react-router-dom';
import useOnClickOutside from 'hooks/useOnClickOutside';
import {
  PrefixConfig,
  calculateFee,
  formatNumbers,
  getConvertedPool,
  getConvertedPosition,
  getTick,
  initialXtoY,
  showPrefix,
  tickerToAddress
} from 'pages/Pool-V3/helpers/helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { printBigint } from '../PriceRangePlot/utils';
import { network } from 'config/networks';
import SingletonOraiswapV3, { fetchPositionAprInfo, poolKeyToString, PositionAprInfo } from 'libs/contractSingleton';
import { getTransactionUrl, handleErrorTransaction } from 'helper';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { getCosmWasmClient } from 'libs/cosmjs';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { oraichainTokens } from 'config/bridgeTokens';
import { oraichainTokensWithIcon } from 'config/chainInfos';
import { toDisplay, parseAssetInfo, TokenItemType, BigDecimal } from '@oraichain/oraidex-common';
import { Tick } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';

const shorterPrefixConfig: PrefixConfig = {
  B: 1000000000,
  M: 1000000,
  K: 1000
};

const PositionItem = ({ position, setStatusRemove }) => {
  const theme = useTheme();
  const ref = useRef();
  const { data: prices } = useCoinGeckoPrices();
  const navigate = useNavigate();

  const {
    min,
    max,
    fee,
    principalAmountX = 0,
    principalAmountY = 0,
    totalEarn,
    totalEarnIncentiveUsd = 0,
    tokenXUsd = 0,
    tokenYUsd = 0
  } = position || {};

  const { earnX = 0, earnY = 0, earnIncentive = null } = totalEarn || {};

  const IconBoots = theme === 'light' ? BootsIcon : BootsIconDark;

  const [address] = useConfigReducer('address');
  const [cachePrices] = useConfigReducer('coingecko');

  const [openTooltip, setOpenTooltip] = useState(false);
  const [openTooltipApr, setOpenTooltipApr] = useState(false);
  const [openCollapse, setCollapse] = useState(false);
  const [tick, setTick] = useState<{ lowerTick: Tick | any; upperTick: Tick | any }>({
    lowerTick: undefined,
    upperTick: undefined
  });
  const [incentives, setIncentives] = useState<{ [key: string]: number }>();
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [isClaimSuccess, setIsClaimSuccess] = useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);
  const [statusRange, setStatusRange] = useState(undefined);
  const [xToY, _] = useState<boolean>(
    initialXtoY(tickerToAddress(position?.pool_key.token_x), tickerToAddress(position?.pool_key.token_y))
  );

  useOnClickOutside(ref, () => {
    setCollapse(false);
  });

  const [aprInfo, setAprInfo] = useState<PositionAprInfo>({
    total: 0,
    swapFee: 0,
    incentive: 0
  });

  useEffect(() => {
    const getAPRInfo = async () => {
      const res = await fetchPositionAprInfo(
        position,
        prices,
        position.tokenXLiqInUsd,
        position.tokenYLiqInUsd,
        statusRange
      );
      setAprInfo(res);
    };
    if (statusRange && position.tokenXLiqInUsd && position.tokenYLiqInUsd && prices && position) {
      getAPRInfo();
    }
  }, [statusRange, prices, position]);

  useEffect(() => {
    if (!openCollapse) return;
    (async () => {
      const { pool_key, lower_tick_index, upper_tick_index } = position;
      const [lowerTickData, upperTickData, incentives] = await Promise.all([
        SingletonOraiswapV3.getTicks(lower_tick_index, pool_key),
        SingletonOraiswapV3.getTicks(upper_tick_index, pool_key),
        SingletonOraiswapV3.getIncentivesPosition(position, address)
      ]);

      const tokenIncentive = incentives.reduce((acc, cur) => {
        const tokenAttr = parseAssetInfo(cur.info);
        return {
          ...acc,
          [tokenAttr]: Number(acc[tokenAttr] || 0) + Number(cur.amount)
        };
      }, {});

      setIncentives(tokenIncentive);
      setTick({
        lowerTick: getTick(lowerTickData),
        upperTick: getTick(upperTickData)
      });
    })();

    return () => {};
  }, [openCollapse]);

  useEffect(() => {
    (async () => {
      const { pool } = await SingletonOraiswapV3.getPool({
        fee_tier: position.pool_key.fee_tier,
        token_x: position.pool_key.token_x,
        token_y: position.pool_key.token_y
      });
      const { lower_tick_index, upper_tick_index } = position;
      setStatusRange(pool.current_tick_index >= lower_tick_index && pool.current_tick_index <= upper_tick_index);
    })();

    return () => {};
  }, []);

  const [tokenXClaim, tokenYClaim, tokenXClaimInUsd, tokenYClaimInUsd, incentivesUSD] = useMemo(() => {
    if (isClaimSuccess) return [0, 0, 0, 0, 0];
    if (position?.poolData && openCollapse && tick.lowerTick && tick.lowerTick && incentives) {
      const convertedPool = getConvertedPool(position);
      const convertedPosition = getConvertedPosition(position);
      const res = calculateFee(convertedPool, convertedPosition, tick.lowerTick, tick.upperTick);

      const bnX = res.x;
      const bnY = res.y;

      const x_claim = +printBigint(bnX, position.tokenX.decimals);
      const y_claim = +printBigint(bnY, position.tokenY.decimals);

      const x_usd = x_claim * cachePrices[position.tokenX.coinGeckoId];
      const y_usd = y_claim * cachePrices[position.tokenY.coinGeckoId];

      const totalIncentiveUsd = Object.entries(incentives).reduce((acc: number, [tokenAddress, amount]) => {
        const token = oraichainTokens.find((e) => [e.contractAddress, e.denom].includes(tokenAddress));

        console.log('first', [tokenAddress, amount, token]);
        const usd = toDisplay(amount.toString()) * cachePrices[token.coinGeckoId];

        acc = new BigDecimal(acc || 0).add(usd).toNumber();

        return acc;
      }, 0);

      console.log('totalIncentiveUsd', totalIncentiveUsd);

      return [x_claim, y_claim, x_usd, y_usd, totalIncentiveUsd];
    }

    return [0, 0, 0, 0, 0];
  }, [position, tick.lowerTick, tick.upperTick, openCollapse, isClaimSuccess]);

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
            {statusRange !== undefined && (
              <span className={classNames(styles.item, styles.status, { [styles.inRange]: statusRange })}>
                {statusRange ? 'In Range' : 'Out Range'}
              </span>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.item}>
            <p>Price Range</p>
            <span className={styles.value}>
              {numberWithCommas(Number(formatNumbers(undefined)(xToY ? min : 1 / max)))}
              {/* {showPrefix(xToY ? min : 1 / max, shorterPrefixConfig)} */}
              {' - '}
              {numberWithCommas(Number(formatNumbers(undefined)(xToY ? max : 1 / min)))}
              {/* {showPrefix(xToY ? max : 1 / min, shorterPrefixConfig)}  */}{' '}
              {xToY ? position.tokenYName : position.tokenXName} per {xToY ? position.tokenXName : position.tokenYName}
            </span>
          </div>
          <div className={styles.item}>
            <p>My Liquidity</p>
            <span className={styles.value}>{formatDisplayUsdt(position.tokenXLiqInUsd + position.tokenYLiqInUsd)}</span>
          </div>
          <div className={styles.item}>
            <p>APR</p>
            <span className={classNames(styles.value, styles.apr)}>
              {numberWithCommas(aprInfo.total * 100)}%&nbsp;
              <TooltipIcon
                className={styles.tooltipWrapper}
                placement="top"
                visible={openTooltipApr}
                icon={<IconInfo />}
                setVisible={setOpenTooltipApr}
                content={
                  <div className={classNames(styles.tooltip, styles[theme])}>
                    <div className={styles.itemInfo}>
                      <span>Swap fee</span>
                      <span className={styles.value}>{numberWithCommas(aprInfo.swapFee * 100)}%</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <span>
                        Incentives Boost&nbsp;
                        <IconBoots />
                      </span>
                      <span className={styles.value}>{numberWithCommas(aprInfo.incentive * 100)}%</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <span>Total APR</span>
                      <span className={styles.totalApr}>{numberWithCommas(aprInfo.total * 100)}%</span>
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
                {formatDisplayUsdt(position.tokenXLiqInUsd + position.tokenYLiqInUsd, 6, 6)}
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <position.tokenXIcon />
                {position.tokenXLiq} {position?.tokenX.name}
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <position.tokenYIcon />
                {position.tokenYLiq} {position?.tokenY.name}
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
                <span className={styles.usd}>
                  {!principalAmountX || !principalAmountY
                    ? '--'
                    : formatDisplayUsdt(
                        new BigDecimal(toDisplay(principalAmountX || 0) * tokenXUsd)
                          .add(toDisplay(principalAmountY || 0) * tokenYUsd)
                          .toNumber(),
                        6,
                        6
                      )}
                </span>
                <span className={classNames(styles.token, styles[theme])}>
                  <position.tokenXIcon />
                  {!principalAmountX
                    ? '--'
                    : numberWithCommas(toDisplay(principalAmountX || 0), undefined, { maximumFractionDigits: 6 })}{' '}
                  {position?.tokenX.name}
                </span>
                <span className={classNames(styles.token, styles[theme])}>
                  <position.tokenYIcon />
                  {!principalAmountY
                    ? '--'
                    : numberWithCommas(toDisplay(principalAmountY || 0), undefined, { maximumFractionDigits: 6 })}{' '}
                  {position?.tokenY.name}
                </span>
              </div>
            </div>
            <div className={styles.btnGroup}>
              <Button
                disabled={removeLoading || (!position.tokenXLiqInUsd && !position.tokenYLiqInUsd)}
                type="third-sm"
                onClick={async () => {
                  try {
                    setRemoveLoading(true);
                    const { client } = await getCosmWasmClient({ chainId: network.chainId });
                    SingletonOraiswapV3.load(client, address);
                    const { transactionHash } = await SingletonOraiswapV3.dex.removePosition({
                      index: Number(position.id)
                    });

                    if (transactionHash) {
                      setStatusRemove(true);
                      setCollapse(false);
                      displayToast(TToastType.TX_SUCCESSFUL, {
                        customLink: getTransactionUrl(network.chainId, transactionHash)
                      });
                    }
                  } catch (error) {
                    console.log({ error });
                    handleErrorTransaction(error);
                  } finally {
                    setRemoveLoading(false);
                  }
                }}
              >
                {removeLoading && (
                  <>
                    <Loader width={20} height={20} />
                    <span style={{ width: 6 }}> </span>
                  </>
                )}
                Close Position
              </Button>
              <Button
                type="primary-sm"
                onClick={() => {
                  navigate(`/new-position/${encodeURIComponent(poolKeyToString(position.pool_key))}`);
                }}
              >
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
              <span className={styles.usd}>
                {!earnX || !earnY
                  ? '--'
                  : formatDisplayUsdt(
                      new BigDecimal(toDisplay(earnX || 0) * tokenXUsd)
                        .add(toDisplay(earnY || 0) * tokenYUsd)
                        .add(totalEarnIncentiveUsd)
                        .toNumber(),
                      6,
                      6
                    )}
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <position.tokenXIcon />
                {!earnX ? '--' : numberWithCommas(toDisplay(earnX), undefined, { maximumFractionDigits: 6 })}{' '}
                {position?.tokenX.name}
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <position.tokenYIcon />
                {!earnY ? '--' : numberWithCommas(toDisplay(earnY), undefined, { maximumFractionDigits: 6 })}{' '}
                {position?.tokenY.name}
              </span>
            </div>
            {earnIncentive && <div style={{ height: 8 }} />}
            {earnIncentive &&
              Object.values(earnIncentive).map((incentiveEarned: { amount: number; token: TokenItemType }, i) => {
                const { amount, token } = incentiveEarned;

                return (
                  <div className={styles.itemRow} key={'incentEarned-' + i}>
                    <span className={styles.usd}></span>
                    <span className={classNames(styles.token, styles[theme])}></span>
                    <span className={classNames(styles.token, styles[theme])}>
                      {theme === 'light' ? <token.IconLight /> : <token.Icon />}
                      {!amount || !Number(amount) ? '--' : toDisplay(amount.toString())} {token?.name}
                    </span>
                  </div>
                );
              })}
            <div className={styles.divider}></div>
            <div className={styles.row}>
              <h4>Unclaimed Rewards</h4>
              <div className={styles.itemRow}>
                <span className={styles.usd}>
                  {formatDisplayUsdt(tokenXClaimInUsd + tokenYClaimInUsd + incentivesUSD, 6, 6)}
                </span>
                <span className={classNames(styles.token, styles[theme])}>
                  <position.tokenXIcon />
                  {tokenXClaim} {position?.tokenX.name}
                </span>
                <span className={classNames(styles.token, styles[theme])}>
                  <position.tokenYIcon />
                  {tokenYClaim} {position?.tokenY.name}
                </span>
              </div>
              {incentives && <div style={{ height: 8 }} />}
              {incentives &&
                Object.keys(incentives).map((incent, i) => {
                  const tokenIncentive = oraichainTokensWithIcon.find((orai) =>
                    [orai.denom, orai.contractAddress].includes(incent)
                  );

                  return (
                    <div className={styles.itemRow} key={i}>
                      <span className={styles.usd}></span>
                      <span className={classNames(styles.token, styles[theme])}></span>
                      <span className={classNames(styles.token, styles[theme])}>
                        {theme === 'light' ? <tokenIncentive.IconLight /> : <tokenIncentive.Icon />}
                        {toDisplay(incentives[incent].toString())} {tokenIncentive?.name}
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className={styles.btnGroup}>
              <Button
                type="third-sm"
                disabled={claimLoading || (!tokenXClaimInUsd && !tokenYClaimInUsd && !incentives)}
                onClick={async () => {
                  try {
                    setClaimLoading(true);
                    const { client } = await getCosmWasmClient({ chainId: network.chainId });
                    SingletonOraiswapV3.load(client, address);
                    const { transactionHash } = await SingletonOraiswapV3.dex.claimFee({
                      index: Number(position.id)
                    });

                    if (transactionHash) {
                      setIsClaimSuccess(true);
                      displayToast(TToastType.TX_SUCCESSFUL, {
                        customLink: getTransactionUrl(network.chainId, transactionHash)
                      });
                    }
                  } catch (error) {
                    console.log({ error });
                    handleErrorTransaction(error);
                  } finally {
                    setClaimLoading(false);
                  }
                }}
              >
                {claimLoading && (
                  <>
                    <Loader width={20} height={20} />
                    <span style={{ width: 6 }}> </span>
                  </>
                )}
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
