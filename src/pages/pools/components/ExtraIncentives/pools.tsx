//@ts-nocheck

import React, { HTMLAttributes } from 'react';
import { useHistory } from 'react-router-dom';

import { PoolCardTokenIcon } from 'components/PoolCardTokenIcon';
import styled from 'styled-components';
import { AppCurrency } from '@keplr-wallet/types';
import { CoinPretty, Dec } from '@keplr-wallet/unit';

interface Props {
  poolList: {
    poolId: string;
    currencies: AppCurrency[];
    gaugeIds: string[];
    incentiveDenom: string;
  }[];
}

export function PoolCardList({ poolList }: Props) {
  const history = useHistory();
  return (
    <div>
      {poolList.map((pool) => {
        return (
          <PoolCardItem
            onClick={(e) => {
              e.preventDefault();
              history.push(`/pool/${pool.poolId}`);
            }}
            key={pool.poolId}
            poolId={pool.poolId}
            currencies={pool.currencies}
            gaugeIds={pool.gaugeIds}
            incentiveDenom={pool.incentiveDenom}
          />
        );
      })}
    </div>
  );
}

export const PoolCardItem = (props: {
  poolId: string;
  currencies: AppCurrency[];
  gaugeIds: string[];
  incentiveDenom: string;
  onClick: HTMLAttributes<HTMLLIElement>['onClick'];
}) => {
  const { poolId, currencies, gaugeIds, incentiveDenom, onClick } = props;

  const { chainStore, queriesStore } = {}; //useStore();

  //   const queries = queriesStore.get(chainStore.current.chainId);
  const queries = { osmosis: {} }; // queriesStore.get(chainStore.current.chainId);

  //   const gauges = gaugeIds.map((gaugeId) => {
  //     return queries.osmosis.queryGauge.get(gaugeId);
  //   });
  const gauges = []; //

  //   const currency = chainStore
  //     .getChain(chainStore.current.chainId)
  //     .forceFindCurrency(incentiveDenom);
  const currency = {
    coinDecimals: 6,
    coinGeckoId: 'juno-network',
    coinImageUrl: 'http://localhost:8080/assets/tokens/juno.svg',
    coinMinimalDenom:
      'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
    coinDenom: 'JUNO',
    paths: [
      {
        portId: 'transfer',
        channelId: 'channel-42'
      }
    ],
    originChainId: 'juno-1',
    originCurrency: {
      coinDenom: 'JUNO',
      coinMinimalDenom: 'ujuno',
      coinDecimals: 6,
      coinGeckoId: 'juno-network',
      coinImageUrl: 'http://localhost:8080/assets/tokens/juno.svg'
    }
  };
  let sumRemainingBonus: CoinPretty = new CoinPretty(currency, new Dec(0));

  let maxRemainingEpoch = 0;
  for (const gauge of gauges) {
    sumRemainingBonus = sumRemainingBonus.add(gauge.getRemainingCoin(currency));

    if (gauge.remainingEpoch > maxRemainingEpoch) {
      maxRemainingEpoch = gauge.remainingEpoch;
    }
  }

  return (
    <PoolCardItemContainer onClick={onClick}>
      <TokenInfoContainer>
        <PoolCardTokenIcon bgIndex={poolId} src="/assets/Icons/OSMO.svg" />
        <div style={{ marginTop: '15px' }}>
          <h5>Pool #{poolId}</h5>
          <PoolSubTitle>
            {currencies
              .map((token) => {
                // IBC Currency라도 원래의 coin denom을 보여준다.
                return 'originCurrency' in token && token.originCurrency
                  ? token.originCurrency.coinDenom.toUpperCase()
                  : token.coinDenom.toUpperCase();
              })
              .join('/')}
          </PoolSubTitle>
        </div>
      </TokenInfoContainer>

      <div>
        <AprCol>
          <PoolHeaderText>Bonus Remaining</PoolHeaderText>
          <PoolValueText>
            {sumRemainingBonus.maxDecimals(0).toString()}
          </PoolValueText>
        </AprCol>
        <div style={{ marginLeft: '20px' }}>
          <PoolHeaderText>Epochs Remaining</PoolHeaderText>
          <PoolValueText>{maxRemainingEpoch}</PoolValueText>
        </div>
      </div>
    </PoolCardItemContainer>
  );
};

const PoolCardItemContainer = styled.li`
  border-width: 1px;
  cursor: pointer;
  padding: 20px;
  background-color: rgba(45, 39, 85, 1);
  border-radius: 0.75rem;
  border-color: transparent;

  &:hover {
    border-color: rgba(196, 164, 106, 1);
  }

  @media (min-width: 768px) {
    padding: 24px 30px;
  }
`;

const TokenInfoContainer = styled.section`
  display: flex;
  margin-bottom: 16px;
`;

const PoolTextBase = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  word-break: break-all;
`;

const PoolSubTitle = styled(PoolTextBase)`
  font-weight: 600;
  margin-top: 8px;
`;

const PoolHeaderText = styled(PoolTextBase)`
  margin-bottom: 8px;
`;

const PoolValueText = styled.h6`
  color: rgba(255, 255, 255, 0.87);
`;

const Hr = styled.div<{ apr?: string; myLockedAmount?: string }>`
  border-bottom-width: 1px;
  border-color: rgba(196, 164, 106, 1);
  margin-top: 16px;
  margin-bottom: 16px;
`;

const AprCol = styled.div`
  border-right-width: 1px;
  border-color: rgba(196, 164, 106, 1);
  padding-right: 20px;
  min-width: 150px;
`;
