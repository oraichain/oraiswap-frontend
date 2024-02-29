import { TokenItemType } from '@oraichain/oraidex-common';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { ReactComponent as NoDataDark } from 'assets/images/nodata-bid-dark.svg';
import { ReactComponent as NoData } from 'assets/images/nodata-bid.svg';
import { ReactComponent as LinkIcon } from 'assets/icons/link.svg';
import LoadingBox from 'components/LoadingBox';
import useConfigReducer from 'hooks/useConfigReducer';
import styles from './index.module.scss';
import { shortenAddress } from 'pages/CoHarvest/helpers';
import { getTransactionUrl } from 'helper';
import { network } from 'config/networks';

const TransactionHistory = ({ baseToken, quoteToken }: { baseToken: TokenItemType; quoteToken: TokenItemType }) => {
  const [theme] = useConfigReducer('theme');

  let [BaseTokenIcon, QuoteTokenIcon] = [DefaultIcon, DefaultIcon];
  if (baseToken) BaseTokenIcon = theme === 'light' ? baseToken.IconLight : baseToken.Icon;
  if (quoteToken) QuoteTokenIcon = theme === 'light' ? quoteToken.IconLight : quoteToken.Icon;

  if (false) {
    // isLoading
    return (
      <LoadingBox loading={false} className={styles.loadingDivWrapper}>
        <div className={styles.loadingDiv}></div>
      </LoadingBox>
    );
  }

  return (
    <LoadingBox loading={false} className={styles.loadingDivWrapper}>
      <div className={styles.txHistory}>
        {LIST?.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>TX HASH</th>
                  <th>TIME</th>
                  <th>PAY AMOUNT</th>
                  <th>RECEIVE AMOUNT</th>
                  <th>VALUE</th>
                  <th>FEE</th>
                  {/* <th>ADDRESS</th> */}
                </tr>
              </thead>
              <tbody>
                {LIST.sort((a, b) => b.timestamp - a.timestamp).map((item, index) => {
                  return (
                    <tr className={styles.item} key={index}>
                      <td className={styles.hash}>
                        <span>{shortenAddress(item.txhash)}</span>
                        <a
                          href={getTransactionUrl(network.chainId, item.txhash)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkIcon />
                        </a>
                      </td>
                      <td className={styles.time}>{item.timestamp}</td>
                      <td className={styles.pay}>{item.offerAmount}</td>
                      <td className={`${styles.receive} `}>
                        <span>{item.returnAmount}</span>
                      </td>
                      <td className={styles.value}>{item.returnAmount}</td>
                      <td className={styles.fee}>
                        {item.spreadAmount} -{item.taxAmount}
                      </td>
                      {/* <td className={styles.address}>{item.address}</td> */}
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

const LIST = [
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '402120',
    direction: 'Sell',
    offerAmount: '59128202',
    offerDenom: 'orai',
    uniqueKey: '13950002-orai-59128202-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-133638033',
    returnAmount: '133638033',
    spreadAmount: '54583',
    taxAmount: '0',
    timestamp: 1697447760,
    txhash: 'E453B5B1F5A10F1011046DA8F7CDFB64EA0DD676773E640E42D90DC0A6F1A6B6',
    txheight: 13950002
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '401599',
    direction: 'Sell',
    offerAmount: '59099546',
    offerDenom: 'orai',
    uniqueKey: '13950109-orai-59099546-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-133464757',
    returnAmount: '133464757',
    spreadAmount: '54464',
    taxAmount: '0',
    timestamp: 1697448360,
    txhash: 'A43AEE3724DCD9BC69EEADEA89B40BCF66D3E7624C38810FF5A95579864265E8',
    txheight: 13950109
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '23094',
    direction: 'Sell',
    offerAmount: '3400000',
    offerDenom: 'orai',
    uniqueKey: '13950150-orai-3400000-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-7674941',
    returnAmount: '7674941',
    spreadAmount: '180',
    taxAmount: '0',
    timestamp: 1697448600,
    txhash: 'C470CD398791D512342F10E7C0E3BF655C2411B274525FBA23C8D971C1B4862B',
    txheight: 13950150
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '53145',
    direction: 'Sell',
    offerAmount: '7824896',
    offerDenom: 'orai',
    uniqueKey: '13950282-orai-7824896-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-17662055',
    returnAmount: '17662055',
    spreadAmount: '954',
    taxAmount: '0',
    timestamp: 1697449380,
    txhash: '5FF5C01137AF9627A822782FB915A79A79BBEE7CC552A7EEF5675B40980D56EE',
    txheight: 13950282
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '2716',
    direction: 'Sell',
    offerAmount: '400000',
    offerDenom: 'orai',
    uniqueKey: '13950465-orai-400000-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-902814',
    returnAmount: '902814',
    spreadAmount: '2',
    taxAmount: '0',
    timestamp: 1697450400,
    txhash: '2282CB82AFEBF10050D93E351BF1179561D1625BD27C4DF7EC254A2FF5D2B296',
    txheight: 13950465
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '4017',
    direction: 'Sell',
    offerAmount: '591626',
    offerDenom: 'orai',
    uniqueKey: '13950726-orai-591626-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-1335312',
    returnAmount: '1335312',
    spreadAmount: '5',
    taxAmount: '0',
    timestamp: 1697451900,
    txhash: '23EA72AF2DBF94C6E08A85867B192E2333B18B807A57FE82BD2D0628DE462C25',
    txheight: 13950726
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '605202',
    direction: 'Sell',
    offerAmount: '89167648',
    offerDenom: 'orai',
    uniqueKey: '13950793-orai-89167648-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-201128842',
    returnAmount: '201128842',
    spreadAmount: '123773',
    taxAmount: '0',
    timestamp: 1697452320,
    txhash: 'B7C382A871774500BD96D17E953F2EF39932D0C961815A6E9A92FB5D6701BDA0',
    txheight: 13950793
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '42984',
    direction: 'Sell',
    offerAmount: '6337259',
    offerDenom: 'orai',
    uniqueKey: '13951625-orai-6337259-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-14285123',
    returnAmount: '14285123',
    spreadAmount: '625',
    taxAmount: '0',
    timestamp: 1697457060,
    txhash: 'DEC2F3B3517CC6526AB7956846FA33F02F6AE4A439E7B8E396675CDC8E06018C',
    txheight: 13951625
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '20906',
    direction: 'Sell',
    offerAmount: '3082540',
    offerDenom: 'orai',
    uniqueKey: '13951630-orai-3082540-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-6948054',
    returnAmount: '6948054',
    spreadAmount: '148',
    taxAmount: '0',
    timestamp: 1697457120,
    txhash: '222B479EEA1B847704FE3264E6652F8D8B07FC4F959C9DF527B4160D9668B840',
    txheight: 13951630
  },
  {
    askDenom: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    commissionAmount: '401239',
    direction: 'Sell',
    offerAmount: '59184673',
    offerDenom: 'orai',
    uniqueKey: '13951753-orai-59184673-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-133345338',
    returnAmount: '133345338',
    spreadAmount: '54429',
    taxAmount: '0',
    timestamp: 1697457780,
    txhash: 'FD16EE9C411BCB6DE1A7F82D0A41885E8FB04E64B784BA263B21F21C08A4AC2F',
    txheight: 13951753
  }
];
