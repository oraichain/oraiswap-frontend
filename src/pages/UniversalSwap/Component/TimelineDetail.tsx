import React from 'react';
import styles from './TimelineDetail.module.scss';
import classNames from 'classnames';
import {
  CosmosState,
  DatabaseEnum,
  DbStateToChainName,
  EvmChainPrefix,
  EvmState,
  OraiBridgeState,
  OraichainState,
  RoutingQueryItem
} from '../ibc-routing';
import { sortAddress } from 'pages/BitcoinDashboard/utils/bitcoin';
import { COSMOS_CHAIN_ID_COMMON } from '@oraichain/oraidex-common';
import Loader from './Loader';

export enum TimelineType {
  CONFIRMED = 'confirmed',
  WAITING = 'waiting',
  INACTIVE = 'inactive'
}

const TimelineDetail: React.FC<{
  type: TimelineType;
  data: RoutingQueryItem;
  lastIndex: boolean;
}> = ({ type, data, lastIndex }) => {
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

  const getDenom = (): string => {
    let denom = (data.data as EvmState)?.destinationDenom;

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

    return denom || '';
  };

  return (
    <div className={styles['timeline-detail-wrapper']}>
      <div className={classNames(styles['timeline-detail'], styles[type])}>
        <div className={styles.wrapper}>
          <p className={styles.title}>
            {data.data.nextState !== ''
              ? `Bridge from ${DbStateToChainName[data.type]} to ${DbStateToChainName[data.data.nextState]}`
              : `On ${DbStateToChainName[data.type]}`}
          </p>
          {type === TimelineType.WAITING && <Loader />}
        </div>
      </div>
      {!lastIndex && (
        <div className={styles['timeline-info']}>
          <div className={styles['text-wrapper']}>
            <h3>Tx Hash:</h3>
            <p
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.open(getScanUrl(data), '_blank');
              }}
            >
              {sortAddress(data.data.txHash)}
            </p>
          </div>
          <div className={styles['text-wrapper']}>
            <h3>Height:</h3>
            <p>{data.data.height}</p>
          </div>
          <div className={styles['text-wrapper']}>
            <h3>Receiver:</h3>
            <p>{getReceiver()}</p>
          </div>
          <div className={styles['text-wrapper']}>
            <h3>Amount:</h3>
            <p>{getAmount()}</p>
          </div>
          <div className={styles['text-wrapper']}>
            <h3>Denom:</h3>
            <p>{getDenom()}</p>
          </div>
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
    return `https://scan.bridge.orai.io/txs/${data.data.txHash}`;
  }
  return `https://scan.orai.io/txs/${data.data.txHash}`;
};
