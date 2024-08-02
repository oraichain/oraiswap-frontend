import styles from './index.module.scss';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as AddIcon } from 'assets/icons/Add.svg';
import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { Button } from 'components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import useTheme from 'hooks/useTheme';
import { useEffect, useState } from 'react';
import { formatNumberKMB, numberWithCommas } from 'helper/format';
import PositionItem from '../PositionItem';
import SingletonOraiswapV3, {
  fetchPoolAprInfo,
  PoolAprInfo,
  poolKeyToString,
  stringToPoolKey
} from 'libs/contractSingleton';
import { toDisplay } from '@oraichain/oraidex-common';
import { formatPoolData, getIconPoolData, PoolWithTokenInfo } from 'pages/Pool-V3/helpers/format';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { convertPosition } from 'pages/Pool-V3/helpers/helper';
import useConfigReducer from 'hooks/useConfigReducer';
import LoadingBox from 'components/LoadingBox';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import { getFeeClaimData } from '../PositionList';

const PoolV3Detail = () => {
  const [address] = useConfigReducer('address');
  const [liquidityPools] = useConfigReducer('liquidityPools');
  const [volumnePools] = useConfigReducer('volumnePools');
  const [cachePrices] = useConfigReducer('coingecko');

  const { data: prices } = useCoinGeckoPrices();
  const navigate = useNavigate();
  const theme = useTheme();
  const { poolId } = useParams<{ poolId: string }>();

  const [tokenX, tokenY, fee, tick] = poolId.split('-');
  const isLight = theme === 'light';
  const IconBoots = isLight ? BootsIcon : BootsIconDark;

  const { FromTokenIcon, ToTokenIcon, tokenXinfo, tokenYinfo } = getIconPoolData(tokenX, tokenY, isLight);
  const totalLiquidity = liquidityPools?.[poolId] ?? 0;
  const volumn24h = (volumnePools && volumnePools.find((vo) => vo.poolAddress === poolId))?.volume24 ?? 0;

  const [dataPosition, setDataPosition] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [poolDetail, setPoolDetail] = useState<PoolWithTokenInfo>();
  const [statusRemove, setStatusRemove] = useState<boolean>(undefined);
  const [liquidity, setLiquidity] = useState({
    total: totalLiquidity,
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

  const [aprInfo, setAprInfo] = useState<PoolAprInfo>({
    apr: 0,
    incentives: [],
    incentivesApr: 0,
    swapFee: 0
  });

  useEffect(() => {
    const getAPRInfo = async () => {
      const res = await fetchPoolAprInfo([poolDetail.pool_key], prices, liquidityPools);
      // console.log({ res });
      setAprInfo(res[poolDetail.poolKey]);
    };
    if (poolDetail && prices && liquidityPools) {
      getAPRInfo();
    }
  }, [poolDetail, prices, liquidityPools]);

  const { spread, pool_key } = poolDetail || {};
  const { allocation, total } = liquidity;

  const [balanceX, balanceY] = [
    allocation[pool_key?.token_x]?.balance || 0,
    allocation[pool_key?.token_y]?.balance || 0
  ];

  // const percentX = !(balanceX && balanceY)
  //   ? MID_PERCENT
  //   : new BigDecimal(balanceX).div(new BigDecimal(balanceX).add(balanceY)).mul(100).toNumber();

  useEffect(() => {
    (async () => {
      try {
        setLoading(false);
        if (!address) return setDataPosition([]);
        if (!pool_key) return;
        setLoading(true);
        const [positions, poolsData, feeClaimData] = await Promise.all([
          SingletonOraiswapV3.getAllPosition(address),
          SingletonOraiswapV3.getPools(),
          getFeeClaimData(address)
        ]);

        const positionsMap = convertPosition({
          positions: positions
            .map((po, ind) => ({ ...po, ind }))
            .filter((pos) => poolKeyToString(pos.pool_key) === poolKeyToString(pool_key)),
          poolsData,
          cachePrices,
          address,
          isLight,
          feeClaimData
        });

        setDataPosition(positionsMap);
      } catch (error) {
        console.log('error call position', error);
      } finally {
        setLoading(false);
        setStatusRemove(false);
      }
    })();

    return () => {};
  }, [poolDetail, address, statusRemove]);

  return (
    <div className={classNames(styles.poolDetail, 'small_container')}>
      <div className={styles.header}>
        <div className={styles.name}>
          <div className={styles.back} onClick={() => navigate('/pools-v3')}>
            <BackIcon />
          </div>
          <div className={styles.info}>
            <div className={classNames(styles.icons, styles[theme])}>
              {FromTokenIcon && <FromTokenIcon />}
              {ToTokenIcon && <ToTokenIcon />}
            </div>
            <span>
              {tokenXinfo?.name?.toUpperCase()} / {tokenYinfo?.name?.toUpperCase()}
            </span>
          </div>
          <div className={styles.fee}>
            <span className={styles.item}>Fee: {toDisplay((fee || 0).toString(), 10)}%</span>
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
              <h1>{formatDisplayUsdt(volumn24h)}</h1>
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
                {FromTokenIcon && <FromTokenIcon />}
                <span>{tokenXinfo?.name?.toUpperCase()}</span>
                <span className={styles.value}>{formatNumberKMB(balanceX, false)}</span>
              </div>
              <div className={classNames(styles.tokenItem, styles[theme])}>
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
              <p>{!aprInfo.incentives?.length ? '--' : [...new Set(aprInfo.incentives)].join(', ')}</p>
            </div>
            <div className={styles.item}>
              <span>Swap Fee</span>
              <p>{numberWithCommas(aprInfo.swapFee * 100)}%</p>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>
                Incentive Boost&nbsp;
                <IconBoots />
              </span>
              <p>{!aprInfo.incentivesApr ? '-- ' : `${numberWithCommas(aprInfo.incentivesApr * 100)}%`}</p>
            </div>
            <div className={styles.item}>
              <span>Total APR</span>
              <p className={styles.total}>{numberWithCommas(aprInfo.apr * 100)}%</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.positions}>
        {<h1>Your Liquidity Positions ({dataPosition?.length ?? 0})</h1>}
        <LoadingBox loading={loading} styles={{ height: '30vh' }}>
          <div className={styles.list}>
            {dataPosition.length
              ? dataPosition.map((position, index) => {
                  return (
                    <div className={styles.positionWrapper} key={`pos-${index}`}>
                      <PositionItem position={position} setStatusRemove={setStatusRemove} />
                    </div>
                  );
                })
              : !loading && (
                  <>
                    <div className={styles.nodata}>
                      {theme === 'light' ? <NoData /> : <NoDataDark />}
                      <span>No Positions!</span>
                    </div>
                  </>
                )}
          </div>
        </LoadingBox>
      </div>
    </div>
  );
};

export default PoolV3Detail;
