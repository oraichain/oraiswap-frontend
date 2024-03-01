import { TokenItemType, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { ReactComponent as NoDataDark } from 'assets/images/nodata-bid-dark.svg';
import { ReactComponent as NoData } from 'assets/images/nodata-bid.svg';
import { ReactComponent as LinkIcon } from 'assets/icons/link.svg';
import LoadingBox from 'components/LoadingBox';
import useConfigReducer from 'hooks/useConfigReducer';
import styles from './index.module.scss';
import { formatDateV2, formatTime, shortenAddress } from 'pages/CoHarvest/helpers';
import { getAccountUrl, getTransactionUrl } from 'helper';
import { network } from 'config/networks';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { useTransactionHistory } from 'pages/Pools/hooks/useTransactionHistory';

const TransactionHistory = ({ baseToken, quoteToken }: { baseToken: TokenItemType; quoteToken: TokenItemType }) => {
  const [theme] = useConfigReducer('theme');
  const { data: prices } = useCoinGeckoPrices();

  let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];
  const baseDenom = baseToken.contractAddress || baseToken.denom;
  const quoteDenom = quoteToken.contractAddress || quoteToken.denom;

  const { txHistories, isLoading } = useTransactionHistory(baseDenom, quoteDenom);

  if (isLoading) {
    return (
      <LoadingBox loading={false} className={styles.loadingDivWrapper}>
        <div className={styles.loadingDiv}></div>
      </LoadingBox>
    );
  }

  return (
    <LoadingBox loading={false} className={styles.loadingDivWrapper}>
      <div className={styles.txHistory}>
        <div className={styles.title}>Last 20 transactions</div>
        {txHistories?.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>TX HASH</th>
                  <th>TIME</th>
                  <th className={styles.alignRight}>PAY AMOUNT</th>
                  <th className={styles.alignRight}>RECEIVE AMOUNT</th>
                  <th className={styles.alignRight}>VALUE</th>
                  <th className={styles.alignRight}>FEE</th>
                  <th>ADDRESS</th>
                </tr>
              </thead>
              <tbody>
                {txHistories
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((item, index) => {
                    const offerToken = item.offerDenom === baseDenom ? baseToken : quoteToken;
                    const returnToken = item.askDenom === quoteDenom ? quoteToken : baseToken;

                    if (offerToken)
                      BaseTokenIcon = theme === 'light' ? offerToken.IconLight || offerToken.Icon : offerToken.Icon;
                    if (returnToken)
                      QuoteTokenIcon = theme === 'light' ? returnToken.IconLight || returnToken.Icon : returnToken.Icon;

                    const returnUSD = getUsd(item.returnAmount, returnToken, prices);
                    const feeUSD = getUsd(item.commissionAmount, returnToken, prices);

                    return (
                      <tr className={styles.item} key={index}>
                        <td className={styles.hash}>
                          <span className={styles.txhash}>{shortenAddress(item.txhash || '', 4, 4)}</span>
                          <a
                            href={getTransactionUrl(network.chainId, item.txhash || '')}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LinkIcon />
                          </a>
                        </td>
                        <td className={styles.time}>
                          <div>
                            <span>{formatDateV2(item.timestamp * 1000)}</span>
                            <span>{formatTime(item.timestamp * 1000)}</span>
                          </div>
                        </td>
                        <td className={`${styles.pay}`}>
                          <div className={styles.amount}>
                            <div>
                              <BaseTokenIcon />
                            </div>
                            <span>{numberWithCommas(toDisplay(item.offerAmount))}</span>
                            <span className={styles.symbol}>{offerToken.name}</span>
                          </div>
                        </td>
                        <td className={`${styles.receive}`}>
                          <div className={styles.amount}>
                            <div>
                              <QuoteTokenIcon />
                            </div>
                            <span>{numberWithCommas(toDisplay(item.returnAmount))}</span>
                            <span className={styles.symbol}>{returnToken.name}</span>
                          </div>
                        </td>
                        <td className={styles.value}>
                          <div className={styles.amount}>{formatDisplayUsdt(returnUSD)}</div>
                        </td>
                        <td className={styles.fee}>
                          <div className={styles.amount}>{formatDisplayUsdt(feeUSD)}</div>
                        </td>
                        <td className={styles.address}>
                          <span className={styles.txt}>
                            {!item.sender ? '-' : shortenAddress(item.sender || '', 5, 5)}
                          </span>
                          {!item.sender ? null : (
                            <a href={getAccountUrl(item.sender || '')} target="_blank" rel="noopener noreferrer">
                              <LinkIcon />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.nodata}>
            {theme === 'light' ? <NoData /> : <NoDataDark />}
            {/* <span>No data!</span> */}
          </div>
        )}
      </div>
    </LoadingBox>
  );
};

export default TransactionHistory;
