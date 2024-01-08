import { toDisplay } from '@oraichain/oraidex-common';
import { useEffect, useState } from 'react';
import { fetchRoundBid } from 'rest/api';
import { useQuery } from '@tanstack/react-query';
import useConfigReducer from 'hooks/useConfigReducer';
import { CoharvestBidPoolQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { network } from 'config/networks';

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

  return { potentialReturn, isLoading, refetchPotentialReturn };
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
