import { COSMOS_CHAIN_ID_COMMON, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as ArrowDown } from 'assets/icons/down-arrow-v3.svg';
import OpenNewWindowImg from 'assets/icons/open_new_window.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/success-v2.svg';
import { ReactComponent as ArrowUp } from 'assets/icons/up-arrow-v3.svg';
import classNames from 'classnames';
import { flattenTokens, tokenMap } from 'config/bridgeTokens';
import ArrowImg from 'assets/icons/arrow_right.svg';
import { chainInfosWithIcon, flattenTokensWithIcon } from 'config/chainInfos';
import {
  CosmosState,
  DatabaseEnum,
  DbStateToChainName,
  EvmChainPrefix,
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
}> = ({ type, data, lastIndex, historyData, isRouteFinished, currentIndex }) => {
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

  const getReceiver = (): string => {
    return (
      (data.data as EvmState)?.oraiReceiver ||
      (data.data as OraiBridgeState)?.receiver ||
      (data.data as OraichainState).nextReceiver
    );
  };

  const getAmount = (): string => {
    return (
      (data.data as EvmState)?.fromAmount ||
      (data.data as OraiBridgeState)?.amount ||
      (data.data as OraichainState).nextAmount
    );
  };

  const getToken = () => {
    let denom = (data.data as EvmState)?.denom;

    if ((data.data as OraichainState)?.nextDestinationDenom) {
      const lastDenom = (data.data as OraichainState).nextDestinationDenom;

      const splitData = lastDenom.split('/');

      denom = splitData[splitData.length - 1];
    }

    if ((data.data as OraiBridgeState).denom) {
      const lastDenom = (data.data as OraiBridgeState).denom;

      const splitData = lastDenom.split('/');

      denom = splitData[splitData.length - 1];
    }

    const tokenByDenom = lastIndex
      ? toToken
      : flattenTokensWithIcon.find((tk) => tk.contractAddress === denom || tk.denom === denom);
    const tokenChain = chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === tokenByDenom?.chainId);

    return { tokenWithIcon: tokenByDenom, tokenChain, denom: lastIndex ? toToken.denom : denom };
  };

  const { tokenChain, tokenWithIcon: token, denom } = getToken();
  const amount = numberWithCommas(toDisplay(getAmount(), token?.decimals), undefined, { maximumFractionDigits: 6 });

  const additionalToken =
    data.type !== DatabaseEnum.Evm
      ? flattenTokensWithIcon.find((tk) => tk.coinGeckoId === toToken?.coinGeckoId && tk.chainId === fromToken?.chainId)
      : flattenTokensWithIcon.find(
          (tk) => tk.coinGeckoId === toToken?.coinGeckoId && tk.chainId === 'oraibridge-subnet-2'
        );

  const tokenArrayInFirstStep =
    data.type === DatabaseEnum.Evm
      ? [
          { token: fromToken, amount: historyData.fromAmount },
          {
            token,
            amount: historyData.expectedOutput
          },
          { token: additionalToken, amount }
        ]
      : [
          { token: fromToken, amount: historyData.fromAmount },
          { token: additionalToken, amount: historyData.expectedOutput },
          {
            token,
            amount
          }
        ];

  const supportChains = [DatabaseEnum.Evm, DatabaseEnum.Oraichain];
  const isBridge = fromToken?.coinGeckoId === toToken?.coinGeckoId;

  return (
    <div className={classNames(styles['timeline-detail-wrapper'], styles[theme])}>
      <div className={classNames(styles['timeline-detail'], styles[type])}>
        <div className={styles.wrapper}>
          <p className={styles.title}>
            {data.data.nextState !== '' ? (
              <span className={styles.stateTxt}>
                Bridge &#x2022; From {DbStateToChainName[data.type]} to {DbStateToChainName[data.data.nextState]}
              </span>
            ) : (
              `On ${DbStateToChainName[data.type]}`
            )}
          </p>
          {type === TimelineType.WAITING && <Loader />}
          {type === TimelineType.CONFIRMED && <SuccessIcon />}
        </div>
      </div>

      {((!lastIndex && currentIndex !== 1) ||
        (currentIndex === 1 && isBridge) ||
        (!supportChains.includes(data.type) && currentIndex === 1)) && (
        <div className={styles.tokenWrapper}>
          <div className={styles.txt}>{!lastIndex ? 'Bridge' : 'Receive'}</div>

          <div className={styles.tokenDetail}>
            <div className={styles.logo}>
              {theme === 'light' ? <token.IconLight width={24} height={24} /> : <token.Icon width={24} height={24} />}
            </div>
            <div className={styles.info}>
              <span className={styles.token}>
                {numberWithCommas(toDisplay(getAmount(), token?.decimals), undefined, { maximumFractionDigits: 6 })}{' '}
                <span>{token?.name}</span>
              </span>
              <span className={styles.chain}>{token?.org === 'OraiBridge' ? 'OBridge' : token?.org || ''}</span>
            </div>
          </div>
        </div>
      )}
      {!lastIndex && !isBridge && currentIndex === 1 && supportChains.includes(data.type) && (
        <div className={classNames(styles.tokenWrapper, styles.list)}>
          {tokenArrayInFirstStep?.map((data, key) => {
            const { token: tk, amount } = data;
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
            <p>{reduceString(getReceiver(), 8, 8)}</p>
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

export const getScanUrl = (data: RoutingQueryItem): string => {
  if (data.type === DatabaseEnum.Evm) {
    const evmChainPrefix = (data.data as EvmState).evmChainPrefix;
    if (evmChainPrefix === EvmChainPrefix.BSC_MAINNET) {
      return `https://bscscan.com/tx/${data.data.txHash}`;
    }
    if (evmChainPrefix === EvmChainPrefix.ETH_MAINNET) {
      return `https://etherscan.io/tx/${data.data.txHash}`;
    }
    if (evmChainPrefix === EvmChainPrefix.TRON_MAINNET) {
      return `https://tronscan.org/#/transaction/${data.data.txHash}`;
    }
  }
  if (data.type === DatabaseEnum.Cosmos) {
    const chainId = (data.data as CosmosState).chainId;
    if (chainId === COSMOS_CHAIN_ID_COMMON.COSMOSHUB_CHAIN_ID) {
      return `https://www.mintscan.io/cosmos/tx/${data.data.txHash}`;
    }
    if (chainId === COSMOS_CHAIN_ID_COMMON.INJECTVE_CHAIN_ID) {
      return `https://www.mintscan.io/injective/tx/${data.data.txHash}`;
    }
    if (chainId === COSMOS_CHAIN_ID_COMMON.OSMOSIS_CHAIN_ID) {
      return `https://www.mintscan.io/osmosis/tx/${data.data.txHash}`;
    }
  }
  if (data.type === DatabaseEnum.Oraichain) {
    return `https://scan.orai.io/txs/${data.data.txHash}`;
  }
  return `https://scan.bridge.orai.io/txs/${data.data.txHash}`;
};
