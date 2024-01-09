import { toDisplay, BigDecimal } from '@oraichain/oraidex-common';
import { useEffect, useState } from 'react';
import { fetchRoundBid } from 'rest/api';
import { useQuery } from '@tanstack/react-query';
import useConfigReducer from 'hooks/useConfigReducer';
import { CoharvestBidPoolQueryClient, OraiswapTokenTypes } from '@oraichain/oraidex-contracts-sdk';
import { network } from 'config/networks';
import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { getUsd } from 'libs/utils';
import { flattenTokens } from 'config/bridgeTokens';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';

export const useGetRound = () => {
  const [round, setRound] = useState(0);

  const queryRoundBid = async () => {
    const data = await fetchRoundBid();
    setRound(data as number);
  };

  useEffect(() => {
    queryRoundBid();
  }, []);

  return round;
};

export const useGetBidding = (round: number) => {
  const getBiddingInfo = async () => {
    const coHavestBidPool = new CoharvestBidPoolQueryClient(window.client, network.bid_pool);
    const data = await coHavestBidPool.biddingInfo({
      round
    });
    return data;
  };

  const {
    data: biddingInfo,
    isLoading,
    refetch: refetchBiddingInfo
  } = useQuery(['bidding-info', round], () => getBiddingInfo(), {
    refetchOnWindowFocus: false,
    placeholderData: {
      bid_info: {
        round: 0,
        start_time: Date.now(),
        end_time: Date.now(),
        total_bid_amount: '0',
        total_bid_matched: '0'
      },
      distribution_info: {
        total_distribution: '0',
        exchange_rate: '0',
        is_released: false,
        actual_distributed: '0',
        num_bids_distributed: 0
      }
    },
    enabled: !!round
  });

  return { biddingInfo, isLoading, refetchBiddingInfo };
};

export const useGetAllBidPoolInRound = (round: number) => {
  const getAllBidPoolRound = async () => {
    const coHarvestBidPool = new CoharvestBidPoolQueryClient(window.client, network.bid_pool);
    const data = await coHarvestBidPool.allBidPoolInRound({
      round
    });
    return data;
  };

  const {
    data: allBidPoolRound,
    isLoading,
    refetch: refetchAllBidPoolRound
  } = useQuery(['all-bid-pool-round', round], () => getAllBidPoolRound(), {
    refetchOnWindowFocus: false,
    placeholderData: [],
    enabled: !!round
  });
  const sortedBidPoolRound = [...(allBidPoolRound || [])];

  sortedBidPoolRound?.sort((a, b) => toDisplay(b.total_bid_amount) - toDisplay(a.total_bid_amount));

  const maxTotalAmount = sortedBidPoolRound[0]?.total_bid_amount;

  const formattedBidPoolRound = allBidPoolRound.map((bid) => {
    const percentage = (toDisplay(bid.total_bid_amount) / toDisplay(maxTotalAmount)) * 100;

    return {
      ...bid,
      percentage
    };
  });

  return { allBidPoolRound: formattedBidPoolRound, isLoading, refetchAllBidPoolRound };
};

export const useGetPotentialReturn = (props: {
  bidAmount: string;
  exchangeRate: string;
  round: number;
  slot: number;
}) => {
  const { bidAmount, exchangeRate, round, slot } = props;
  const getPotentialReturn = async () => {
    const coHarvestBidPool = new CoharvestBidPoolQueryClient(window.client, network.bid_pool);
    const data = await coHarvestBidPool.estimateAmountReceive({
      bidAmount, // bidAmount: gia nhap
      exchangeRate, // exchangeRate: 1 ORAX/USDC;
      round, // round: lastRoundId;
      slot // slot: %;
    });
    return data;
  };

  const getListPotentialReturn = async ({ listBidHistories, exchangeRate }) => {
    const multicall = new MulticallQueryClient(window.client, network.multicall);

    const res = await multicall.aggregate({
      queries: listBidHistories.map((bid) => ({
        address: network.bid_pool,
        data: toBinary({
          estimate_amount_receive: {
            bid_amount: bid.amount,
            exchange_rate: exchangeRate,
            round: bid.round,
            slot
          }
        })
      }))
    });

    return res;
  };

  const {
    data: potentialReturn,
    isLoading,
    refetch: refetchPotentialReturn
  } = useQuery(['potential-return', bidAmount, round], () => getPotentialReturn(), {
    refetchOnWindowFocus: false,
    placeholderData: {
      receive: '0',
      residue_bid: '0'
    },
    enabled: !!bidAmount && !!round
  });

  return { potentialReturn, isLoading, refetchPotentialReturn, getListPotentialReturn };
};

export const useGetBidHistoryWithPotentialReturn = (props: { exchangeRate: string; listBidHistories: any[] }) => {
  const { listBidHistories, exchangeRate } = props;
  const ORAIX_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'oraidex');
  const USDC_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'usd-coin');

  const { data: prices } = useCoinGeckoPrices();

  const getListPotentialReturn = async () => {
    const multicall = new MulticallQueryClient(window.client, network.multicall);

    const res = await multicall.aggregate({
      queries: listBidHistories.map((bid) => ({
        address: network.bid_pool,
        data: toBinary({
          estimate_amount_receive: {
            bid_amount: bid.amount,
            exchange_rate: exchangeRate,
            round: bid.round,
            slot: bid.premium_slot
          }
        })
      }))
    });
    return listBidHistories.map((bid, ind) => {
      if (!res.return_data[ind].success) {
        return {
          ...bid,
          potentialReturnUSD: '0',
          receive: '0',
          residue_bid: '0'
        };
      }
      const response = fromBinary(res.return_data[ind].data);

      const estimateReceive = response?.receive || '0';
      const estimateResidueBid = response?.residue_bid || '0';

      const returnAmountUsd = getUsd(estimateReceive, USDC_TOKEN_INFO, prices);
      const residueBidAmountUsd = getUsd(estimateResidueBid, ORAIX_TOKEN_INFO, prices);

      const potentialReturnUSD = new BigDecimal(returnAmountUsd).add(residueBidAmountUsd).toNumber();
      return {
        ...bid,
        potentialReturnUSD,
        ...response
      };
    });
  };

  const {
    data: listPotentialReturn,
    isLoading,
    refetch: refetchPotentialReturn
  } = useQuery(['all-potential-return', listBidHistories], () => getListPotentialReturn(), {
    refetchOnWindowFocus: false,
    placeholderData: [],
    enabled: !!listBidHistories
  });

  return { listPotentialReturn, isLoading, refetchPotentialReturn };
};

export const useGetHistoryBid = (round: number) => {
  const [address] = useConfigReducer('address');
  const getHistoryBidPool = async () => {
    const coHarvestBidPool = new CoharvestBidPoolQueryClient(window.client, network.bid_pool);
    const data = await coHarvestBidPool.bidsByUser({
      round,
      user: address
    });
    return data;
  };

  const {
    data: historyBidPool,
    isLoading,
    refetch: refetchHistoryBidPool
  } = useQuery(['history-bid-pool', round, address], () => getHistoryBidPool(), {
    refetchOnWindowFocus: false,
    placeholderData: [],
    enabled: !!round && !!address
  });

  return { historyBidPool, isLoading, refetchHistoryBidPool };
};
