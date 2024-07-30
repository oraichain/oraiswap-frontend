import styles from './index.module.scss';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as AddIcon } from 'assets/icons/Add.svg';
import OraixIcon from 'assets/icons/oraix.svg';
import UsdtIcon from 'assets/icons/tether.svg';
import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { Button } from 'components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import useTheme from 'hooks/useTheme';
import { useEffect, useState } from 'react';
import { formatNumberKMB } from 'helper/format';
import PositionItem from '../PositionItem';
import SingletonOraiswapV3, { stringToPoolKey } from 'libs/contractSingleton';
import { toDisplay, BigDecimal } from '@oraichain/oraidex-common';
import { formatPoolData, PoolWithTokenInfo } from 'pages/Pool-V3/helpers/format';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { PERCENTAGE_SCALE, calcYPerXPriceByTickIndex } from 'pages/Pool-V3/helper';
import { printBigint } from '../PriceRangePlot/utils';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import { oraichainTokens } from 'config/bridgeTokens';
import { oraichainTokensWithIcon } from 'config/chainInfos';

const MID_PERCENT = 50;

const PoolV3Detail = () => {
  const { data: prices } = useCoinGeckoPrices();
  const [address] = useConfigReducer('address');
  const navigate = useNavigate();
  const theme = useTheme();
  const isLight = theme === 'light';
  const [dataPosition, setDataPosition] = useState<any[]>([]);
  const IconBoots = isLight ? BootsIcon : BootsIconDark;
  const { poolId } = useParams<{ poolId: string }>();
  const [poolDetail, setPoolDetail] = useState<PoolWithTokenInfo>();
  const [liquidity, setLiquidity] = useState({
    total: 0,
    allocation: {}
  });

  useEffect(() => {
    (async () => {
      try {
        const poolKey = stringToPoolKey(poolId);
        const pool = await SingletonOraiswapV3.getPool(poolKey);
        const isLight = theme === 'light';
        const fmtPool = formatPoolData(pool, isLight);
        const liquidity = await SingletonOraiswapV3.getLiquidityByPool(pool, prices);

        setLiquidity(liquidity);
        setPoolDetail(fmtPool);
      } catch (error) {
        console.log('error: get pool detail', error);
      }
    })();
  }, [poolId]);

  const { FromTokenIcon, ToTokenIcon, feeTier, spread, tokenXinfo, tokenYinfo, pool_key } = poolDetail || {};

  const { allocation, total } = liquidity;

  const [balanceX, balanceY] = [
    allocation[pool_key?.token_x]?.balance || 0,
    allocation[pool_key?.token_y]?.balance || 0
  ];

  const percentX = !(balanceX && balanceY)
    ? MID_PERCENT
    : new BigDecimal(balanceX).div(new BigDecimal(balanceX).add(balanceY)).mul(100).toNumber();

  useEffect(() => {
    (async () => {
      if (!pool_key) return;
      const positions = await SingletonOraiswapV3.getAllPosition(address);
      const positionsMap = positions
        .filter((pos) => pos.pool_key.token_x === pool_key.token_x && pos.pool_key.token_y === pool_key.token_y)
        .map((position: any, index) => {
          const [tokenX, tokenY] = [position?.pool_key.token_x, position?.pool_key.token_y];
          let [tokenXIcon, tokenYIcon] = [DefaultIcon, DefaultIcon];
          const tokenXinfo =
            tokenX && oraichainTokens.find((token) => token.denom === tokenX || token.contractAddress === tokenX);
          const tokenYinfo =
            tokenY && oraichainTokens.find((token) => token.denom === tokenY || token.contractAddress === tokenY);

          if (tokenXinfo) {
            const findFromToken = oraichainTokensWithIcon.find(
              (tokenIcon) =>
                tokenIcon.denom === tokenXinfo.denom || tokenIcon.contractAddress === tokenXinfo.contractAddress
            );
            const findToToken = oraichainTokensWithIcon.find(
              (tokenIcon) =>
                tokenIcon.denom === tokenYinfo.denom || tokenIcon.contractAddress === tokenYinfo.contractAddress
            );
            tokenXIcon = isLight ? findFromToken.IconLight : findFromToken.Icon;
            tokenYIcon = isLight ? findToToken.IconLight : findToToken.Icon;
          }

          const lowerPrice = Number(
            calcYPerXPriceByTickIndex(position.lower_tick_index, tokenXinfo.decimals, tokenYinfo.decimals)
          );

          const upperPrice = calcYPerXPriceByTickIndex(
            position.upper_tick_index,
            tokenXinfo.decimals,
            tokenYinfo.decimals
          );

          const min = Math.min(lowerPrice, upperPrice);
          const max = Math.max(lowerPrice, upperPrice);

          let tokenXLiq: any, tokenYLiq: any;

          const x = 0n;
          const y = 0n;

          if (position.poolData) {
            // ;[x, y] = calculateTokenAmounts(position.poolData, position)
          }

          try {
            tokenXLiq = +printBigint(x, tokenXinfo.decimals);
          } catch (error) {
            tokenXLiq = 0;
          }

          try {
            tokenYLiq = +printBigint(y, tokenYinfo.decimals);
          } catch (error) {
            tokenYLiq = 0;
          }

          const currentPrice = calcYPerXPriceByTickIndex(
            position.poolData?.pool?.current_tick_index ?? 0,
            tokenXinfo.decimals,
            tokenYinfo.decimals
          );

          const valueX = tokenXLiq + tokenYLiq / currentPrice;
          const valueY = tokenYLiq + tokenXLiq * currentPrice;

          return {
            ...position,
            tokenX: tokenXinfo,
            tokenY: tokenYinfo,
            tokenXName: tokenXinfo.name,
            tokenYName: tokenYinfo.name,
            tokenXIcon: tokenXIcon,
            tokenYIcon: tokenYIcon,
            fee: +printBigint(BigInt(position.pool_key.fee_tier.fee), PERCENTAGE_SCALE - 2),
            min,
            max,
            tokenXLiq,
            tokenYLiq,
            valueX,
            valueY,
            address,
            id: index,
            isActive: currentPrice >= min && currentPrice <= max,
            tokenXId: tokenXinfo.coinGeckoId
          };
        });

      setDataPosition(positionsMap);
    })();

    return () => {};
  }, [poolDetail]);

  return (
    <div className={classNames(styles.poolDetail, 'small_container')}>
      <div className={styles.header}>
        <div className={styles.name}>
          <div className={styles.back} onClick={() => navigate('/pools-v3')}>
            <BackIcon />
          </div>
          <div className={styles.info}>
            <div className={classNames(styles.icons, styles[theme])}>
              {/* <img src={OraixIcon} alt="base-tk" />
              <img src={UsdtIcon} alt="quote-tk" /> */}

              {FromTokenIcon && <FromTokenIcon />}
              {ToTokenIcon && <ToTokenIcon />}
            </div>
            <span>
              {tokenXinfo?.name?.toUpperCase()} / {tokenYinfo?.name?.toUpperCase()}
            </span>
          </div>
          <div className={styles.fee}>
            <span className={styles.item}>Fee: {toDisplay((feeTier || 0).toString(), 10)}%</span>
            {/* <span className={styles.item}>{toDisplay((spread || 0).toString(), 3)}% Spread</span> */}
            <span className={styles.item}>0.01% Spread</span>
          </div>
        </div>

        <div className={styles.addPosition}>
          <Button
            onClick={() => {
              navigate(`/new-position/${pool_key?.token_x}-${pool_key?.token_y}-${pool_key.fee_tier.fee}`);
            }}
            type="primary-sm"
          >
            <div>
              <AddIcon />
              &nbsp;
            </div>
            Add Position
          </Button>
        </div>
      </div>
      <div className={styles.detail}>
        <div className={styles.infos}>
          <div className={styles.tvl}>
            <div className={styles.box}>
              <p>Liquidity</p>
              <h1>{formatDisplayUsdt(total || 0)}</h1>
              {/* <span className={classNames(styles.percent, { [styles.positive]: true })}>
                {true ? '+' : '-'}
                {numberWithCommas(2.07767, undefined, { maximumFractionDigits: 2 })}%
              </span> */}
            </div>
            <div className={styles.box}>
              <p>Volume (24H)</p>
              <h1>{formatDisplayUsdt(14334398)}</h1>
              {/* <span className={classNames(styles.percent, { [styles.positive]: false })}>
                {false ? '+' : '-'}
                {numberWithCommas(2.07767, undefined, { maximumFractionDigits: 2 })}%
              </span> */}
            </div>
          </div>

          <div className={classNames(styles.box, styles.alloc)}>
            <p>Liquidity Allocation</p>
            <div className={styles.tokensAlloc}>
              <div className={styles.base} style={{ width: `50%` }}></div>
              <div className={styles.quote} style={{ width: `50%` }}></div>
            </div>
            <div className={styles.tokens}>
              <div className={classNames(styles.tokenItem, styles[theme])}>
                {/* <img src={OraixIcon} alt="base-tk" /> */}
                {FromTokenIcon && <FromTokenIcon />}
                <span>{tokenXinfo?.name?.toUpperCase()}</span>
                <span className={styles.value}>{formatNumberKMB(balanceX, false)}</span>
              </div>
              <div className={classNames(styles.tokenItem, styles[theme])}>
                {/* <img src={UsdtIcon} alt="quote-tk" /> */}
                {ToTokenIcon && <ToTokenIcon />}
                <span>{tokenYinfo?.name?.toUpperCase()}</span>
                <span className={styles.value}>{formatNumberKMB(balanceY, false)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.reward}>
          <div className={styles.title}>Reward</div>
          <div className={styles.desc}>
            <div className={styles.item}>
              <span>Incentive</span>
              <p>ORAIX</p>
            </div>
            <div className={styles.item}>
              <span>Swap Fee</span>
              <p>0%</p>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>
                Incentive Boost&nbsp;
                <IconBoots />
              </span>
              <p>22.91%</p>
            </div>
            <div className={styles.item}>
              <span>Total APR</span>
              <p className={styles.total}>34.82%</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.positions}>
        {!!dataPosition?.length && <h1>Your Liquidity Positions ({dataPosition.length})</h1>}
        <div className={styles.list}>
          {dataPosition.map((position, index) => {
            return (
              <div className={styles.positionWrapper} key={`pos-${index}`}>
                <PositionItem position={position} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PoolV3Detail;
