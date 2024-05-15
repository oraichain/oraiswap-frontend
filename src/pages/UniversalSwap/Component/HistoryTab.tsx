import ArrowImg from 'assets/icons/arrow_right.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/ic_status_done.svg';
import OpenNewWindowImg from 'assets/icons/open_new_window.svg';
import cn from 'classnames/bind';
import { FallbackEmptyData } from 'components/FallbackEmptyData';
import { Table, TableHeaderProps } from 'components/Table';
import { chainInfosWithIcon, flattenTokensWithIcon } from 'config/chainInfos';
import useTheme from 'hooks/useTheme';
import { TransactionHistory } from 'libs/duckdb';
import { reduceString, timeSince } from 'libs/utils';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { useRef, useState } from 'react';
import IbcRouting from '../Modals/IbcRouting';
import { useGetTransHistory } from '../Swap/hooks';
import { getExplorerScan } from '../helpers';
import styles from './HistoryTab.module.scss';

import { Button } from 'components/Button';
import { DbStateToChainName, StateDBStatus } from 'config/ibc-routing';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useGetAllRoutingData } from '../hooks/useGetRoutingData';
import { isMobile } from '@walletconnect/browser-utils';

const cx = cn.bind(styles);
const RowsComponent: React.FC<{
  rows: TransactionHistory;
  onClick: () => void;
  routingData: any[];
}> = ({ rows, onClick, routingData }) => {
  const theme = useTheme();
  const [showAction, setShowAction] = useState(false);
  const ref = useRef();
  const mobileMode = isMobile();

  useOnClickOutside(ref, () => {
    setShowAction(false);
  });

  const [fromToken, toToken] = [
    flattenTokensWithIcon.find((token) => token.coinGeckoId === rows.fromCoingeckoId),
    flattenTokensWithIcon.find((token) => token.coinGeckoId === rows.toCoingeckoId)
  ];
  if (!fromToken || !toToken) return <></>;

  const [fromChain, toChain] = [
    chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === rows.fromChainId),
    chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === rows.toChainId)
  ];
  if (!fromChain || !toChain) return <></>;

  // const { activeStep, routingData, routingFinished, currentRoute } = useCheckIbcDataStatus(rows);
  const generateTransactionStatus = () => {
    const pendingItems = !routingData
      ? []
      : routingData.filter((item: any) => item.data.status === StateDBStatus.PENDING);
    const isLoading = pendingItems.length !== 0;

    // if (status === 'error') return <ErrorIcon />;
    // if (status === 'success') return <SuccessIcon />;
    if (!isLoading) return <SuccessIcon />;
    return (
      <div className={styles.loadingTrans}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };

  const currentStep = routingData && routingData[routingData.length - 1];

  return (
    <div className={styles.historyContainer} onClick={() => setShowAction(!showAction)} ref={ref}>
      <div className={styles.history}>
        <div className={styles.status}>{generateTransactionStatus()}</div>
        <div className={styles.time}>
          <div className={styles.type}>{rows.type}</div>
          <div className={styles.timestamp}>{timeSince(Number(rows.timestamp))}</div>
        </div>
        <div className={styles.from}>
          <div className={styles.list}>
            <div className={styles.img}>
              {theme === 'light' ? (
                <fromToken.IconLight width={26} height={26} />
              ) : (
                <fromToken.Icon width={26} height={26} />
              )}
              <div className={styles.imgChain}>
                {theme === 'light' ? (
                  <fromChain.IconLight width={14} height={14} />
                ) : (
                  <fromChain.Icon width={14} height={14} />
                )}
              </div>
            </div>
            <div className={styles.value}>
              <div className={styles.subBalance}>
                {'-'}
                {numberWithCommas(Number(rows.fromAmount), undefined, { maximumFractionDigits: 6 })}
                <span className={styles.denom}>{fromToken.name}</span>
              </div>
              <div className={styles.timestamp}>{formatDisplayUsdt(rows.fromAmountInUsdt)}</div>
            </div>
          </div>
        </div>
        <div className={styles.icon}>
          <img src={ArrowImg} width={26} height={26} alt="filter" />
        </div>
        <div className={styles.to}>
          <div className={styles.list}>
            <div className={styles.img}>
              {theme === 'light' ? (
                <toToken.IconLight width={26} height={26} />
              ) : (
                <toToken.Icon width={26} height={26} />
              )}
              <div className={styles.imgChain}>
                {theme === 'light' ? (
                  <toChain.IconLight width={14} height={14} />
                ) : (
                  <toChain.Icon width={14} height={14} />
                )}
              </div>
            </div>
            <div className={styles.value}>
              <div className={styles.addBalance}>
                {'+'}
                {numberWithCommas(Number(rows.toAmount), undefined, { maximumFractionDigits: 6 })}

                <span className={styles.denom}>{toToken.name}</span>
              </div>
              <div className={styles.timestamp}>{formatDisplayUsdt(rows.toAmountInUsdt)}</div>
            </div>
          </div>
        </div>
        <div className={styles.txhash}>
          <div className={styles.type}>TxHash</div>
          <div
            className={styles.link}
            onClick={() => window.open(`${getExplorerScan(rows.fromChainId)}/${rows.initialTxHash}`)}
          >
            <span>{reduceString(rows.initialTxHash, 6, 4)}</span>
            <div className={styles.open_link}>
              <img src={OpenNewWindowImg} width={11} height={11} alt="filter" />
            </div>
          </div>
        </div>
      </div>
      {showAction && (
        // !mobileMode && ( // !!routingData?.length &&
        <div className={styles.action}>
          <div className={styles.progress}>
            {currentStep && currentStep.data ? (
              currentStep.data.nextState !== '' ? (
                <span className={styles.stateTxt}>
                  Bridge &#x2022; From {DbStateToChainName[currentStep.type]} to{' '}
                  {DbStateToChainName[currentStep.data.nextState]}
                </span>
              ) : (
                `On ${DbStateToChainName[currentStep.type]}`
              )
            ) : toChain?.chainName ? (
              `On ${toChain?.chainName}`
            ) : (
              ''
            )}
          </div>
          <div className={styles.btn}>
            <Button
              type="primary-sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const HistoryTab: React.FC<{
  networkFilter: string;
}> = ({ networkFilter }) => {
  const { transHistory } = useGetTransHistory();
  const [isOpenIbcRouting, setIsOpenIbcRouting] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const mobileMode = isMobile();
  const [txtSearch, setTxtSearch] = useState(null);

  const allRoutingData = useGetAllRoutingData(transHistory);

  const headers: TableHeaderProps<TransactionHistory> = {
    assets: {
      name: '',
      accessor: (data) => (
        <RowsComponent
          rows={data}
          onClick={() => {
            setSelectedData(data);
            setIsOpenIbcRouting(true);
          }}
          routingData={allRoutingData?.[data?.initialTxHash]}
        />
      ),
      width: '100%',
      align: 'left'
    }
  };

  return (
    <>
      <div className={cx('historyTab')}>
        {/* <div className={cx('info')}>
          <div className={cx('filter')}>
            <img src={FilterIcon} className={cx('filter-icon')} alt="filter" />
            <span className={cx('filter-title')}>Transaction</span>
          </div>
          <div className={cx('search')}>
            <SearchInput
              placeholder="Search by address, asset, type"
              onSearch={(tokenName) => {
                setTxtSearch(tokenName);
              }}
            />
          </div>
        </div> */}
        <div className={styles.historyData}>
          {/* <button
            onClick={() => {
              window.duckDb.addTransHistory({
                initialTxHash: 'DE358265EE954E9EF3E4110DCA34CAB5348C19F5161D00FE6387035C3E67C9A3',
                fromCoingeckoId: 'injective-protocol',
                toCoingeckoId: 'tether',
                fromChainId: 'injective-1',
                toChainId: '0x38',
                fromAmount: '0.1',
                toAmount: '0.953595',
                fromAmountInUsdt: '2.161',
                toAmountInUsdt: '0.9533289469949999',
                status: 'success',
                type: 'Universal Swap',
                timestamp: 1715757291333,
                userAddress: 'orai1hvr9d72r5um9lvt0rpkd4r75vrsqtw6yujhqs2',
                avgSimulate: '21.577212',
                expectedOutput: '2.157987'
              });
            }}
            style={{ background: 'white', color: 'black', cursor: 'pointer', padding: 4 }}
          >
            Add Test tx
          </button> */}
          <h2>Latest 20 transactions</h2>
          {transHistory && transHistory.length > 0 ? (
            <Table
              headers={headers}
              data={transHistory}
              stylesColumn={{
                padding: '16px 0'
              }}
              handleClickRow={(e, data) => {
                setSelectedData(data);
                // mobileMode && setIsOpenIbcRouting(true);
              }}
            />
          ) : (
            <FallbackEmptyData />
          )}
        </div>
      </div>
      {isOpenIbcRouting && <IbcRouting data={selectedData} close={() => setIsOpenIbcRouting(false)} />}
    </>
  );
};
