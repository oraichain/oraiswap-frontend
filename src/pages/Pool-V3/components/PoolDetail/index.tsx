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

const MID_PERCENT = 50;

const PoolV3Detail = () => {
  const { data: prices } = useCoinGeckoPrices();
  const navigate = useNavigate();
  const theme = useTheme();
  const isLight = theme === 'light';
  const [dataPosition, setDataPosition] = useState<any[]>([...Array(0)]);
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

        setPoolDetail(fmtPool);

        const liquidity = await SingletonOraiswapV3.getLiquidityByPool(pool, prices);

        setLiquidity(liquidity);
      } catch (error) {
        console.log('error: get pool detail', error);
      }
    })();
  }, [poolId]);

  const { FromTokenIcon, ToTokenIcon, feeTier, spread, tokenXinfo, tokenYinfo, poolKey, pool_key } = poolDetail || {};

  const { allocation, total } = liquidity;

  const [balanceX, balanceY] = [
    allocation[pool_key?.token_x]?.balance || 0,
    allocation[pool_key?.token_y]?.balance || 0
  ];

  const percentX = !(balanceX && balanceY)
    ? MID_PERCENT
    : new BigDecimal(balanceX).div(new BigDecimal(balanceX).add(balanceY)).mul(100).toNumber();

  if (!poolDetail) {
    return null;
  }

  return (
    <div className={classNames(styles.poolDetail, 'small_container')}>
      <div className={styles.header}>
        <div className={styles.name}>
          <div className={styles.back} onClick={() => navigate('/pools-v3')}>
            <BackIcon />
          </div>
          <div className={styles.info}>
            <div className={classNames(styles.icons, styles[theme])}>
              <img src={OraixIcon} alt="base-tk" />
              <img src={UsdtIcon} alt="quote-tk" />
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
              navigate('/new-position/ORAIX/USDT/0.01');
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
              <div className={styles.base} style={{ width: `${percentX}%` }}></div>
              <div className={styles.quote} style={{ width: `${100 - percentX}%` }}></div>
            </div>
            <div className={styles.tokens}>
              <div className={classNames(styles.tokenItem, styles[theme])}>
                {/* <img src={OraixIcon} alt="base-tk" /> */}
                <FromTokenIcon />
                <span>{tokenXinfo?.name?.toUpperCase()}</span>
                <span className={styles.value}>
                  {formatNumberKMB(allocation[pool_key.token_x]?.balance || 0, false)}
                </span>
              </div>
              <div className={classNames(styles.tokenItem, styles[theme])}>
                {/* <img src={UsdtIcon} alt="quote-tk" /> */}
                <ToTokenIcon />
                <span>{tokenYinfo?.name?.toUpperCase()}</span>
                <span className={styles.value}>
                  {formatNumberKMB(allocation[pool_key.token_y]?.balance || 0, false)}
                </span>
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
              <p>11.91%</p>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>
                ORAI Boost&nbsp;
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
        {!!dataPosition?.length && <h1>Your Liquidity Positions</h1>}
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
