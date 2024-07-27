import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import OraixIcon from 'assets/icons/oraix.svg';
import UsdtIcon from 'assets/icons/tether.svg';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import SearchLightSvg from 'assets/images/search-light-svg.svg';
import SearchSvg from 'assets/images/search-svg.svg';
import classNames from 'classnames';
import { TooltipIcon } from 'components/Tooltip';
import useTheme from 'hooks/useTheme';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { getCosmWasmClient } from 'libs/cosmjs';
import { network } from 'config/networks';
import { oraichainTokens } from 'config/bridgeTokens';
import { toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { oraichainTokensWithIcon } from 'config/chainInfos';

const PoolList = () => {
  const theme = useTheme();
  const [search, setSearch] = useState<string>();
  const [dataPool, setDataPool] = useState([...Array(10)]);
  const bgUrl = theme === 'light' ? SearchLightSvg : SearchSvg;

  useEffect(() => {
    (async () => {
      const { client } = await getCosmWasmClient({ chainId: network.chainId });
      const pools = await client.queryContractSmart('orai10s0c75gw5y5eftms5ncfknw6lzmx0dyhedn75uz793m8zwz4g8zq4d9x9a', {
        pools: {}
      });
      setDataPool(pools);
    })();

    // get list pool o day => set vo
    // setDataPool
    return () => {};
  }, []);

  return (
    <div className={styles.poolList}>
      <div className={styles.headerTable}>
        <div className={styles.total}>
          <p>Total liquidity</p>
          <h1>{formatDisplayUsdt(29512.16)}</h1>
        </div>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search pool"
            value={search}
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
            style={{
              paddingLeft: 40,
              backgroundImage: `url(${bgUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '16px center'
            }}
          />
        </div>
      </div>
      <div className={styles.list}>
        {dataPool?.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Pool name</th>
                  <th className={styles.textRight}>Liquidity</th>
                  <th className={styles.textRight}>Volume (24H)</th>
                  <th className={styles.textRight}>APR</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataPool.map((item, index) => {
                  return (
                    <tr className={styles.item} key={`${index}-pool-${item?.id}`}>
                      <PoolItemTData item={item} theme={theme} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.nodata}>
            {theme === 'light' ? <NoData /> : <NoDataDark />}
            <span>No Pools!</span>
          </div>
        )}
      </div>
    </div>
  );
};

const PoolItemTData = ({ item, theme }) => {
  const [openTooltip, setOpenTooltip] = useState(false);
  const isLight = theme === 'light';
  const IconBoots = isLight ? BootsIcon : BootsIconDark;
  const navigate = useNavigate();
  const [tokenX, tokenY] = [item?.pool_key.token_x, item?.pool_key.token_y];

  let [FromTokenIcon, ToTokenIcon] = [DefaultIcon, DefaultIcon];
  const feeTier = item?.pool_key.fee_tier.fee || 0;
  const tokenXinfo =
    tokenX && oraichainTokens.find((token) => token.denom === tokenX || token.contractAddress === tokenX);
  const tokenYinfo =
    tokenY && oraichainTokens.find((token) => token.denom === tokenY || token.contractAddress === tokenY);

  if (tokenXinfo) {
    const findFromToken = oraichainTokensWithIcon.find(
      (tokenIcon) => tokenIcon.denom === tokenXinfo.denom || tokenIcon.contractAddress === tokenXinfo.contractAddress
    );
    const findToToken = oraichainTokensWithIcon.find(
      (tokenIcon) => tokenIcon.denom === tokenYinfo.denom || tokenIcon.contractAddress === tokenYinfo.contractAddress
    );
    FromTokenIcon = isLight ? findFromToken.IconLight : findFromToken.Icon;
    ToTokenIcon = isLight ? findToToken.IconLight : findToToken.Icon;
  }

  return (
    <>
      <td>
        <div className={styles.name} onClick={() => navigate(`/pools-v3/${item?.id}`)}>
          <div className={classNames(styles.icons, styles[theme])}>
            <FromTokenIcon />
            <ToTokenIcon />
          </div>
          <span>
            {tokenXinfo?.name} / {tokenYinfo?.name}
          </span>

          <div>
            <span className={styles.fee}>Fee: {toDisplay(BigInt(feeTier), 10)}%</span>
          </div>
        </div>
      </td>
      <td className={styles.textRight}>
        <span className={styles.amount}>{formatDisplayUsdt(1232343)}</span>
      </td>
      <td className={styles.textRight}>
        <span className={styles.amount}>{formatDisplayUsdt(1348)}</span>
      </td>
      <td>
        <div className={styles.apr}>
          <span className={styles.amount}>{formatDisplayUsdt(1348)}</span>

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
        </div>
      </td>
      <td>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/new-position/ORAIX/USDT/0.01');
          }}
          className={styles.add}
        >
          Add Position
        </button>
      </td>
    </>
  );
};

export default PoolList;
