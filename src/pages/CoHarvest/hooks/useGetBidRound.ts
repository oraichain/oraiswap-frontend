import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { BigDecimal, oraichainTokens, toDisplay } from '@oraichain/oraidex-common';
import { CoharvestBidPoolQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { useQuery } from '@tanstack/react-query';
import { network } from 'config/networks';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import { useEffect, useState } from 'react';
import { fetchRoundBid } from 'rest/api';
import { BidStatus, TIMER } from '../constants';

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

export const useGetBiddingFilter = (round: number) => {
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
  } = useQuery(['bidding-info-filter', round], () => getBiddingInfo(), {
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
    isFetching,
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

  return { allBidPoolRound: formattedBidPoolRound, isLoading: isFetching, refetchAllBidPoolRound };
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

export const useGetBidHistoryWithPotentialReturn = (props: {
  exchangeRate: string;
  listBidHistories: any[];
  biddingInfo: any;
}) => {
  const { listBidHistories, exchangeRate, biddingInfo } = props;
  const ORAIX_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
  const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');

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
      // get potential return
      if (!res.return_data[ind].success) {
        return {
          ...bid,
          potentialReturnUSD: '0',
          estimate_receive: '0',
          estimate_residue_bid: '0',
          status: BidStatus.BIDDING
        };
      }

      const response = fromBinary(res.return_data[ind].data);

      // get status
      const isRunningRound =
        !bid.is_distributed || // case: chưa chia reward
        new Date().getTime() <= new Date(biddingInfo.bid_info.end_time * TIMER.MILLISECOND).getTime(); // case: time now < time end

      const estimateReceive = isRunningRound ? response?.receive || '0' : bid.amount_received || '0';
      const estimateResidueBid = isRunningRound ? response?.residue_bid || '0' : bid.residue_bid || '0';

      const returnAmountUsd = getUsd(estimateReceive, USDC_TOKEN_INFO, prices);
      const residueBidAmountUsd = getUsd(estimateResidueBid, ORAIX_TOKEN_INFO, prices);

      const potentialReturnUSD = new BigDecimal(returnAmountUsd).add(residueBidAmountUsd).toNumber();

      let status = BidStatus.BIDDING;
      let percent = 0;
      if (isRunningRound) {
        status = BidStatus.BIDDING;
      } else if (estimateReceive === '0') {
        status = BidStatus.DRAW;
      } else {
        status = BidStatus.WIN;
        percent = new BigDecimal(new BigDecimal(bid.amount || '0').sub(estimateResidueBid))
          .div(bid.amount)
          .mul(100)
          .toNumber();
      }

      return {
        ...bid,
        potentialReturnUSD,
        estimateReceive,
        estimateResidueBid,
        status,
        percent
      };
    });
  };

  const {
    data: listPotentialReturn,
    isFetching,
    isRefetching,
    refetch: refetchPotentialReturn
  } = useQuery(
    ['all-potential-return', listBidHistories, biddingInfo?.bid_info.end_time],
    () => getListPotentialReturn(),
    {
      refetchOnWindowFocus: false,
      placeholderData: [],
      enabled: !!listBidHistories && !!biddingInfo?.bid_info.end_time && !!biddingInfo?.round
    }
  );

  return { listPotentialReturn, isLoading: isFetching, refetchPotentialReturn };
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

export const useGetAllBids = (round: number, exchangeRate: string) => {
  const getHistoryBidPool = async () => {
    const coHarvestBidPool = new CoharvestBidPoolQueryClient(window.client, network.bid_pool);
    const data = await coHarvestBidPool.allBidInRound({
      round,
      // limit: 1000,
      startAfter: null
    });

    const multicall = new MulticallQueryClient(window.client, network.multicall);

    const res = await multicall.aggregate({
      queries: data.map((bidId) => ({
        address: network.bid_pool,
        data: toBinary({
          bid: {
            idx: bidId
          }
        })
      }))
    });

    return data.map((bid, ind) => {
      if (!res.return_data[ind].success) {
        return {
          ...bid
        };
      }
      const response = fromBinary(res.return_data[ind].data);
      return response;
    });
  };

  const {
    data: historyAllBidPool,
    isLoading,
    isFetching,
    refetch: refetchAllHistoryBidPool
  } = useQuery(['history-bid-pool-all', round], () => getHistoryBidPool(), {
    refetchOnWindowFocus: false,
    placeholderData: [],
    enabled: !!round
  });

  return { historyAllBidPool, isLoading: isFetching, refetchAllHistoryBidPool };
};
