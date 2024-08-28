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
import { toDisplay, parseAssetInfo, TokenItemType, BigDecimal, CW20_DECIMALS } from '@oraichain/oraidex-common';
import { Tick } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { useGetFeeDailyData } from 'pages/Pool-V3/hooks/useGetFeeDailyData';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';
import { useGetPositions } from 'pages/Pool-V3/hooks/useGetPosition';
import { useGetAllPositions } from 'pages/Pool-V3/hooks/useGetAllPosition';
import { useGetIncentiveSimulate } from 'pages/Pool-V3/hooks/useGetIncentiveSimuate';
import { extractAddress } from '@oraichain/oraiswap-v3';

const PositionItem = ({ position }) => {
  const theme = useTheme();
  const ref = useRef();
  const { data: price } = useCoinGeckoPrices();
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
    tokenYUsd = 0,
    tokenYDecimal,
    tokenXDecimal
  } = position || {};

  const { earnX = 0, earnY = 0, earnIncentive = null } = totalEarn || {};

  const IconBoots = theme === 'light' ? BootsIcon : BootsIconDark;

  const [address] = useConfigReducer('address');

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

  const { feeDailyData, refetchfeeDailyData } = useGetFeeDailyData();
  const { refetchPositions } = useGetPositions(address);
  const { poolList, poolPrice } = useGetPoolList(price);
  const { simulation } = useGetIncentiveSimulate(address, position.id);

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
        poolList.find((e) => poolKeyToString(e.pool_key) === poolKeyToString(position.pool_key)),
        position,
        poolPrice,
        position.tokenXLiqInUsd,
        position.tokenYLiqInUsd,
        statusRange,
        feeDailyData
      );
      setAprInfo(res);
    };
    if (statusRange && position.tokenXLiqInUsd && position.tokenYLiqInUsd && poolPrice && position && poolList.length > 0) {
      getAPRInfo();
    }
  }, [statusRange, poolPrice, position, poolList, feeDailyData]);

  useEffect(() => {
    if (!openCollapse) return;
    (async () => {
      try {

        const { pool_key, lower_tick_index, upper_tick_index } = position;
        
        const {
          lowerTickData,
          upperTickData,
          incentivesData: incentives
        } = await SingletonOraiswapV3.getTicksAndIncentivesInfo(
          lower_tick_index,
          upper_tick_index,
          position.id,
          address,
          pool_key
        );
        
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
      } catch (error) {
        console.log("error", error);
      }
    })();

    return () => {};
  }, [openCollapse, poolPrice]);

  useEffect(() => {
    (async () => {
      if (poolList.length === 0) return;
      if (position === undefined) return;

      const { pool } = poolList.find((e) => poolKeyToString(e.pool_key) === poolKeyToString(position.pool_key));
      const { lower_tick_index, upper_tick_index } = position;
      setStatusRange(pool.current_tick_index >= lower_tick_index && pool.current_tick_index < upper_tick_index);
    })();

    return () => {};
  }, [position, poolList]);

  useEffect(() => {
    if (Object.keys(simulation).length > 0 && openCollapse && incentives) {
      const intervalId = setInterval(() => {
        const newIncentives: Record<string, number> = {};
        for (const [key, value] of Object.entries(simulation)) {
          newIncentives[key] = value + (incentives[key] || 0);
        }
        setIncentives(newIncentives);
      }, 2000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [openCollapse, incentives, simulation]);

  const earnXDisplay = toDisplay((earnX || 0).toString(), tokenXDecimal);
  const earnYDisplay = toDisplay((earnY || 0).toString(), tokenYDecimal);

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

      const x_usd = x_claim * poolPrice[position.tokenX.coinGeckoId];
      const y_usd = y_claim * poolPrice[position.tokenY.coinGeckoId];

      let totalIncentiveUsd = new BigDecimal(0);
      Object.keys(incentives).forEach((address) => {
        const token = oraichainTokens.find((e) => address === extractAddress(e));
        totalIncentiveUsd = totalIncentiveUsd.add(
          new BigDecimal(incentives[address])
            .mul(poolPrice[token.coinGeckoId])
            .div(new BigDecimal(10).pow(token.decimals || CW20_DECIMALS))
        );
      });

      return [x_claim, y_claim, x_usd, y_usd, totalIncentiveUsd.toNumber()];
    }

    return [0, 0, 0, 0, 0];
  }, [position, tick.lowerTick, tick.upperTick, openCollapse, isClaimSuccess, incentives, poolPrice]);

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
              {numberWithCommas(aprInfo.total * 100, undefined, { maximumFractionDigits: 2 })}%&nbsp;
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
                      <span className={styles.value}>
                        {numberWithCommas(aprInfo.swapFee * 100, undefined, { maximumFractionDigits: 2 })}%
                      </span>
                    </div>
                    <div className={styles.itemInfo}>
                      <span>
                        Incentives Boost&nbsp;
                        <IconBoots />
                      </span>
                      <span className={styles.value}>
                        {numberWithCommas(aprInfo.incentive * 100, undefined, { maximumFractionDigits: 2 })}%
                      </span>
                    </div>
                    <div className={styles.itemInfo}>
                      <span>Total APR</span>
                      <span className={styles.totalApr}>
                        {numberWithCommas(aprInfo.total * 100, undefined, { maximumFractionDigits: 2 })}%
                      </span>
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
                        new BigDecimal(toDisplay((principalAmountX || 0).toString(), tokenXDecimal))
                          .mul(tokenXUsd)
                          .add(
                            new BigDecimal(toDisplay((principalAmountY || 0).toString(), tokenYDecimal)).mul(tokenYUsd)
                          )
                          .toNumber(),
                        6,
                        6
                      )}
                </span>
                <span className={classNames(styles.token, styles[theme])}>
                  <position.tokenXIcon />
                  {!principalAmountX
                    ? '--'
                    : numberWithCommas(toDisplay(principalAmountX || 0, tokenXDecimal), undefined, {
                        maximumFractionDigits: 6
                      })}{' '}
                  {position?.tokenX.name}
                </span>
                <span className={classNames(styles.token, styles[theme])}>
                  <position.tokenYIcon />
                  {!principalAmountY
                    ? '--'
                    : numberWithCommas(toDisplay(principalAmountY || 0, tokenYDecimal), undefined, {
                        maximumFractionDigits: 6
                      })}{' '}
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
                      setCollapse(false);
                      displayToast(TToastType.TX_SUCCESSFUL, {
                        customLink: getTransactionUrl(network.chainId, transactionHash)
                      });
                      refetchPositions();
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
                {formatDisplayUsdt(earnXDisplay * tokenXUsd + earnYDisplay * tokenYUsd + totalEarnIncentiveUsd, 6, 6)}
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <position.tokenXIcon />
                {numberWithCommas(earnXDisplay, undefined, {
                  maximumFractionDigits: 6
                })}{' '}
                {position?.tokenX.name}
              </span>
              <span className={classNames(styles.token, styles[theme])}>
                <position.tokenYIcon />
                {numberWithCommas(earnYDisplay, undefined, {
                  maximumFractionDigits: 6
                })}{' '}
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
                      {!amount || !Number(amount)
                        ? '--'
                        : toDisplay(amount.toString(), token.decimals || CW20_DECIMALS)}{' '}
                      {token?.name}
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
                      refetchPositions();
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
