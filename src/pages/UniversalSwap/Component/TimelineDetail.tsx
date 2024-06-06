import { toDisplay } from '@oraichain/oraidex-common';
import ArrowImg from 'assets/icons/arrow_right.svg';
import { ReactComponent as ArrowDown } from 'assets/icons/down-arrow-v3.svg';
import OpenNewWindowImg from 'assets/icons/open_new_window.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/success-v2.svg';
import { ReactComponent as ArrowUp } from 'assets/icons/up-arrow-v3.svg';
import classNames from 'classnames';
import { chainInfosWithIcon, flattenTokensWithIcon } from 'config/chainInfos';
import {
  CosmosState,
  DatabaseEnum,
  DbStateToChainName,
  EvmState,
  OraiBridgeState,
  OraichainState,
  RoutingQueryItem
} from 'config/ibc-routing';
import useTheme from 'hooks/useTheme';
import { TransactionHistory } from 'libs/duckdb';
import { reduceString } from 'libs/utils';
import { numberWithCommas } from 'pages/Pools/helpers';
import React, { useState } from 'react';
import {
  genTokenOnCurrentStep,
  getAmount,
  getChainName,
  getNextChainId,
  getReceiver,
  getScanUrl
} from '../ibc-routing';
import Loader from './Loader';
import styles from './TimelineDetail.module.scss';

export enum TimelineType {
  CONFIRMED = 'confirmed',
  WAITING = 'waiting',
  INACTIVE = 'inactive'
}

const TimelineDetail: React.FC<{
  type: TimelineType;
  data: RoutingQueryItem;
  lastIndex: boolean;
  historyData: TransactionHistory;
  isRouteFinished: boolean;
  currentIndex: number;
  nextData: RoutingQueryItem | null | undefined;
  prevData: RoutingQueryItem | null | undefined;
}> = ({ type, data, lastIndex, historyData, isRouteFinished, currentIndex, nextData, prevData }) => {
  const theme = useTheme();
  const [showInfo, setShowInfo] = useState(true);

  const [fromToken, toToken] = [
    flattenTokensWithIcon.find(
      (token) => token.coinGeckoId === historyData.fromCoingeckoId && token.chainId === historyData.fromChainId
    ),
    flattenTokensWithIcon.find(
      (token) => token.coinGeckoId === historyData.toCoingeckoId && token.chainId === historyData.toChainId
    )
  ];

  const isBridgeOnly = historyData.fromCoingeckoId === historyData.toCoingeckoId;

  const getToken = (data: RoutingQueryItem) => {
    let denom = data?.data?.['denom'];

    switch (data?.type) {
      case DatabaseEnum.Evm:
        denom = (data.data as EvmState).denom;
        break;
      case DatabaseEnum.Oraichain:
        if (!isBridgeOnly) {
          const lastDenom = (data.data as OraichainState).nextDestinationDenom;
          const splitData = lastDenom.split('/');

          denom = splitData[splitData.length - 1];
        }
        break;

      case DatabaseEnum.OraiBridge:
        const lastDenomBridge = (data.data as OraiBridgeState).denom;
        const splitDataBridge = lastDenomBridge.split('/');

        denom = splitDataBridge[splitDataBridge.length - 1];
        break;

      case DatabaseEnum.Cosmos:
        const lastDenomCosmos = (data.data as CosmosState).denom;
        const cosmosDenomSplitter = lastDenomCosmos.split('/');

        denom = cosmosDenomSplitter[cosmosDenomSplitter.length - 1];
        break;

      default:
        break;
    }

    const tokenByDenom = lastIndex
      ? toToken
      : flattenTokensWithIcon.find((tk) => tk.contractAddress === denom || tk.denom === denom);
    const tokenChain = chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === tokenByDenom?.chainId);

    return { tokenWithIcon: tokenByDenom, tokenChain, denom: lastIndex ? toToken.denom : denom };
  };

  const { tokenChain, tokenWithIcon: token, denom } = getToken(data);
  const amount = numberWithCommas(toDisplay(getAmount(data), token?.decimals), undefined, {
    maximumFractionDigits: 6
  });

  const nextChainId = getNextChainId(nextData);

  const originalPrevToken = getToken(prevData).tokenWithIcon;
  const prevToken = !prevData ? fromToken : genTokenOnCurrentStep(originalPrevToken);
  const prevTokenAmount = !prevData
    ? historyData.fromAmount
    : numberWithCommas(toDisplay(getAmount(prevData), originalPrevToken?.decimals), undefined, {
        maximumFractionDigits: 6
      });

  const additionalToken =
    data.type !== DatabaseEnum.Evm
      ? flattenTokensWithIcon.find((tk) => tk.coinGeckoId === toToken?.coinGeckoId && tk.chainId === 'Oraichain')
      : flattenTokensWithIcon.find((tk) => tk.coinGeckoId === token?.coinGeckoId && tk.chainId === nextChainId);

  const tokenArraySwap =
    data.type === DatabaseEnum.Evm
      ? [
          { token: prevToken, amount: prevTokenAmount },
          {
            token,
            amount: historyData.expectedOutput
          },
          { token: additionalToken, amount }
        ]
      : data.type === DatabaseEnum.Oraichain
      ? [
          { token: prevToken, amount: prevTokenAmount },
          { token: additionalToken, amount: historyData.expectedOutput },
          {
            token,
            amount
          }
        ]
      : [];

  const isSwapEvmStep = data.type === DatabaseEnum.Evm && prevToken?.coinGeckoId !== token?.coinGeckoId;

  const isSwapOraichainStep = data.type === DatabaseEnum.Oraichain && prevToken?.coinGeckoId !== token?.coinGeckoId;

  const isShowSwapRoute = isSwapEvmStep || isSwapOraichainStep;

  const title = nextData ? (
    <span className={styles.stateTxt}>
      Bridge &#x2022; From {getChainName(data)} to {getChainName(nextData)}
    </span>
  ) : lastIndex && data.data?.nextState ? (
    <span className={styles.stateTxt}>
      Bridge &#x2022; From {DbStateToChainName[data.type]} to {DbStateToChainName[data.data?.nextState]}
    </span>
  ) : !isRouteFinished ? (
    `On ${DbStateToChainName[data.type]}`
  ) : (
    `On ${token?.org}`
  );

  return (
    <div className={classNames(styles['timeline-detail-wrapper'], styles[theme])}>
      <div className={classNames(styles['timeline-detail'], styles[type])}>
        <div className={styles.wrapper}>
          <p className={styles.title}>{title}</p>
          {type === TimelineType.WAITING && <Loader />}
          {type === TimelineType.CONFIRMED && <SuccessIcon />}
        </div>
      </div>

      {/* Bridge */}
      {!lastIndex && !isShowSwapRoute && (
        <div className={styles.tokenWrapper}>
          <div className={styles.txt}>{!lastIndex ? 'Bridge' : 'Receive'}</div>

          <div className={styles.tokenDetail}>
            <div className={styles.logo}>
              {theme === 'light' ? <token.IconLight width={24} height={24} /> : <token.Icon width={24} height={24} />}
            </div>
            <div className={styles.info}>
              <span className={styles.token}>
                {numberWithCommas(toDisplay(getAmount(data, isBridgeOnly), token?.decimals), undefined, {
                  maximumFractionDigits: 6
                })}{' '}
                <span>{token?.name}</span>
              </span>
              <span className={styles.chain}>{token?.org === 'OraiBridge' ? 'OBridge' : token?.org || ''}</span>
            </div>
          </div>
        </div>
      )}
      {/*  && currentIndex === 1 */}
      {/* {!lastIndex && !isBridge && !isBridgeEvmStep && supportChains.includes(data.type) && ( */}

      {/* Swap */}
      {!lastIndex && isShowSwapRoute && (
        <div className={classNames(styles.tokenWrapper, styles.list)}>
          {tokenArraySwap?.map((data, key) => {
            const { token: tk, amount } = data;

            if (!tk) return null;

            return (
              <div className={styles.tokenItem} key={key}>
                <div className={styles.tokenDetail}>
                  <div className={styles.logo}>
                    {theme === 'light' ? <tk.IconLight width={24} height={24} /> : <tk.Icon width={24} height={24} />}
                  </div>
                  <div className={styles.info}>
                    <span className={styles.token}>
                      {amount} <span>{tk?.name}</span>
                    </span>
                    <span className={styles.chain}>{tk?.org === 'OraiBridge' ? 'OBridge' : tk?.org || ''}</span>
                  </div>
                </div>
                <img src={ArrowImg} alt="arrow" />
              </div>
            );
          })}
        </div>
      )}

      {!lastIndex && (
        <div className={styles.showInfo} onClick={() => setShowInfo(!showInfo)}>
          <span>Show {showInfo ? 'less' : 'more'}</span>
          <div>{showInfo ? <ArrowUp /> : <ArrowDown />}</div>
        </div>
      )}
      {showInfo && !lastIndex && (
        <div className={styles['timeline-info']}>
          <div className={styles['text-wrapper']}>
            <h3>Receiver:</h3>
            <p>{reduceString(getReceiver(data), 8, 8)}</p>
          </div>
          <div className={styles['text-wrapper']}>
            <h3>Tx Hash:</h3>
            <p
              className={styles.hash}
              onClick={() => {
                window.open(getScanUrl(data), '_blank');
              }}
            >
              {reduceString(data.data.txHash, 6, 4)}
              <img src={OpenNewWindowImg} width={11} height={11} alt="filter" />
            </p>
          </div>
          {/* <div className={styles['text-wrapper']}>
            <h3>Height:</h3>
            <p>{data.data.height}</p>
          </div>*/}
          {/* <div className={styles['text-wrapper']}>
            <h3>Amount:</h3>
            <p>{getAmount()}</p>
          </div>
          <div className={styles['text-wrapper']}>
            <h3>Denom:</h3>
            {denom}
          </div> */}
        </div>
      )}
    </div>
  );
};

export default TimelineDetail;
