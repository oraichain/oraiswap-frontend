import { TokenItemType } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as BoostIconDark } from 'assets/icons/ic_apr_boost_dark.svg';
import { ReactComponent as BoostIconLight } from 'assets/icons/ic_apr_boost_light.svg';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { FallbackEmptyData } from 'components/FallbackEmptyData';
import { Table, TableHeaderProps } from 'components/Table';
import useConfigReducer from 'hooks/useConfigReducer';
import { useGetVaults } from 'pages/Vaults/hooks/useVaults';
import { VaultInfo } from 'pages/Vaults/type';
import { useNavigate } from 'react-router-dom';
import styles from './ListVaultsAsList.module.scss';
import { formatDisplayUsdt } from 'helper/format';

type ListPoolProps = {};

export const ListVaultsAsList: React.FC<ListPoolProps> = ({}) => {
  const [theme] = useConfigReducer('theme');
  const navigate = useNavigate();
  const { totalVaultInfos } = useGetVaults();

  const generateIcon = (baseToken: TokenItemType, quoteToken: TokenItemType): JSX.Element => {
    let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];

    if (baseToken) BaseTokenIcon = theme === 'light' ? baseToken.IconLight : baseToken.Icon;
    if (quoteToken) QuoteTokenIcon = theme === 'light' ? quoteToken.IconLight : quoteToken.Icon;

    return (
      <div className={styles.symbols}>
        <BaseTokenIcon width={30} height={30} className={styles.symbols_logo_left} />
        <QuoteTokenIcon width={30} height={30} className={styles.symbols_logo_right} />
      </div>
    );
  };

  const headers: TableHeaderProps<VaultInfo> = {
    symbols: {
      name: 'Vault',
      accessor: (data) => (
        <div className={styles.strategy}>
          {!isMobile() && <div className={styles.strategyLogo}>{generateIcon(data.tokenInfo0, data.tokenInfo1)}</div>}
          <div className={styles.strategyName}>
            <div className={styles.strategyNameTitle}>Strategy</div>
            <div className={styles.strategyNameValue}>
              {data.token0.symbol}/{data.token1.symbol}
            </div>
          </div>
        </div>
      ),
      sortField: null,
      width: '25%',
      align: 'left'
    },
    apr: {
      name: 'APR',
      width: '25%',
      accessor: (data) => (
        <div className={styles.infoApr}>
          {theme === 'dark' ? <BoostIconDark /> : <BoostIconLight />}
          {data.aprAllTime}%
        </div>
      ),
      sortField: 'aprAllTime',
      align: 'left'
    },
    tvl: {
      name: 'TVL',
      width: '25%',
      align: 'left',
      sortField: 'tvl',
      accessor: (data) => <span className={styles.tvl}>{formatDisplayUsdt(data.tvl, undefined, '$')}</span>
    },
    claimable: {
      name: 'My Share',
      width: '25%',
      align: isMobile() ? 'right' : 'left',
      sortField: 'oraiBalance',
      accessor: (data) => {
        return (
          <span className={styles.tvl}>
            {formatDisplayUsdt(data.oraiBalance)} {data.lpToken.symbol}
          </span>
        );
      }
    }
  };

  const handleClickRow = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, info: VaultInfo) => {
    event.stopPropagation();
    navigate(`/vaults/${encodeURIComponent(info.vaultAddr)}`);
  };

  return (
    <div className={styles.listVault}>
      <div className={styles.listVaultView}>
        {totalVaultInfos.length > 0 ? (
          <Table headers={headers} data={totalVaultInfos} handleClickRow={handleClickRow} defaultSorted="tvl" />
        ) : (
          <FallbackEmptyData />
        )}
      </div>
    </div>
  );
};
