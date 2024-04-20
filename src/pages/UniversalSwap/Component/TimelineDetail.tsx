import React from 'react';
import styles from './TimelineDetail.module.scss';
import classNames from 'classnames';
import {
  CosmosStateInterface,
  DBStateInterface,
  DbStateToChainName,
  EvmStateInterface,
  OraiBridgeStateInterface,
  OraichainStateInterface
} from '../ibc-routing';
import { sortAddress } from 'pages/BitcoinDashboard/utils/bitcoin';
import { ethers } from 'ethers';

export enum TimelineType {
  CONFIRMED = 'confirmed',
  WAITING = 'waiting',
  INACTIVE = 'inactive'
}

const TimelineDetail: React.FC<{
  type: TimelineType;
  data: [string, DBStateInterface];
  lastIndex: boolean;
}> = ({ type, data, lastIndex }) => {
  const getReceiver = (): string => {
    return (
      (data[1] as EvmStateInterface)?.oraiReceiver ||
      (data[1] as OraiBridgeStateInterface)?.receiver ||
      (data[1] as OraichainStateInterface).nextReceiver
    );
  };

  const getAmount = (): string => {
    return (
      (data[1] as EvmStateInterface)?.fromAmount ||
      (data[1] as OraiBridgeStateInterface)?.amount ||
      (data[1] as OraichainStateInterface).nextAmount
    );
  };

  const getDenom = (): string => {
    let denom = (data[1] as EvmStateInterface)?.destinationDenom;

    if ((data[1] as OraichainStateInterface)?.nextDestinationDenom) {
      const lastDenom = (data[1] as OraichainStateInterface).nextDestinationDenom;

      const splitData = lastDenom.split('/');

      denom = splitData[splitData.length - 1];
    }

    if ((data[1] as OraiBridgeStateInterface).denom) {
      const lastDenom = (data[1] as OraiBridgeStateInterface).denom;

      const splitData = lastDenom.split('/');

      denom = splitData[splitData.length - 1];
    }

    return denom || '';
  };

  return (
    <div className={styles['timeline-detail-wrapper']}>
      <div className={classNames(styles['timeline-detail'], styles[type])}>
        <p className={styles.title}>
          {data[1].nextState !== ''
            ? `Bridge from ${DbStateToChainName[data[0]]} to ${DbStateToChainName[data[1].nextState]}`
            : `On ${DbStateToChainName[data[0]]}`}
        </p>
      </div>
      {!lastIndex && (
        <div className={styles['timeline-info']}>
          <div className={styles['text-wrapper']}>
            <h3>Tx Hash:</h3>
            <p>{sortAddress(data[1].txHash)}</p>
          </div>
          <div className={styles['text-wrapper']}>
            <h3>Height:</h3>
            <p>{data[1].height}</p>
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
