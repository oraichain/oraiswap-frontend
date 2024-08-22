import Axios from 'axios';
import { throttleAdapterEnhancer, retryAdapterEnhancer } from 'axios-extensions';
import { AXIOS_TIMEOUT, AXIOS_THROTTLE_THRESHOLD } from '@oraichain/oraidex-common';
import {
  BitcoinConfigInterface,
  CheckpointFeeInterface,
  CheckpointParsedData,
  CheckpointQueueInterface,
  CheckpointStatus,
  DepositFeeInterface,
  DepositInfo,
  PendingDeposit,
  TotalValueLockedInterface,
  TransactionInput,
  TransactionOutput,
  TransactionParsedInput,
  TransactionParsedOutput,
  WithdrawalFeeInterface
} from '../@types';
import { useQuery } from '@tanstack/react-query';
import { convertScriptPubkeyToBtcAddress } from '../utils/bitcoin';
import { bitcoinLcd } from 'helper/constants';

const axios = Axios.create({
  timeout: AXIOS_TIMEOUT,
  retryTimes: 3,
  // cache will be enabled by default in 2 seconds
  adapter: retryAdapterEnhancer(
    throttleAdapterEnhancer(Axios.defaults.adapter!, {
      threshold: AXIOS_THROTTLE_THRESHOLD
    })
  ),
  baseURL: `${bitcoinLcd}/api`
});

const getCheckpointQueue = async (): Promise<CheckpointQueueInterface> => {
  try {
    const res = await axios.get('/bitcoin/checkpoint_queue', {});
    return res.data.data;
  } catch (e) {
    console.error('getCheckpointQueue', e);
    return {
      index: 0,
      first_unhandled_confirmed_cp_index: 0,
      confirmed_index: 0
    };
  }
};

export const useGetCheckpointQueue = () => {
  const { data } = useQuery(['checkpoint_queue'], getCheckpointQueue, {
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000
  });
  return data;
};

const getTotalValueLocked = async (): Promise<TotalValueLockedInterface> => {
  try {
    const res = await axios.get('/bitcoin/value_locked', {
      params: {}
    });
    return { value: res.data.data };
  } catch (e) {
    console.error('getTotalValueLocked', e);
    return {
      value: 0
    };
  }
};

export const useGetTotalValueLocked = () => {
  const { data } = useQuery(['value_locked'], () => getTotalValueLocked(), {
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000
  });
  return data;
};

const getBitcoinConfig = async (): Promise<BitcoinConfigInterface> => {
  try {
    const res = await axios.get('/bitcoin/config', {});
    return res.data.data;
  } catch (e) {
    console.error('getBitcoinConfig', e);
    return {
      capacity_limit: 0,
      fee_pool_reward_split: [0, 0],
      fee_pool_target_balance: 0,
      max_deposit_age: 0,
      max_offline_checkpoints: 0,
      max_withdrawal_amount: 0,
      max_withdrawal_script_length: 0,
      min_checkpoint_confirmations: 0,
      min_confirmations: 0,
      min_deposit_amount: 0,
      min_withdrawal_amount: 0,
      min_withdrawal_checkpoints: 0,
      transfer_fee: 0,
      units_per_sat: 0
    };
  }
};

export const useGetBitcoinConfig = () => {
  const { data } = useQuery(['bitcoin_config'], getBitcoinConfig, {
    refetchOnWindowFocus: true,
    staleTime: Infinity
  });
  return data;
};

const getDepositFee = async (checkpointIndex?: number): Promise<DepositFeeInterface> => {
  try {
    const res = await axios.get('/checkpoint/deposit_fee', {
      params: {
        checkpoint_index: checkpointIndex
      }
    });
    return { deposit_fees: res.data.data };
  } catch (e) {
    console.error('getDepositFee', e);
    return {
      deposit_fees: 0
    };
  }
};

export const useGetDepositFee = (checkpointIndex?: number) => {
  const { data } = useQuery(['deposit_fee', checkpointIndex], () => getDepositFee(checkpointIndex), {
    refetchOnWindowFocus: true,
    staleTime: 10 * 60 * 1000
  });
  return data;
};

export const useGetWithdrawalFee = (btcAddress: string, checkpointIndex?: number) => {
  const getWithdrawalFee = async (btcAddress: String, checkpointIndex?: number): Promise<WithdrawalFeeInterface> => {
    try {
      const res = await axios.get(`/checkpoint/withdraw_fee`, {
        params: {
          address: btcAddress,
          index: checkpointIndex
        }
      });
      return { withdrawal_fees: res.data.data };
    } catch (e) {
      console.error('getWithdrawalFee', e);
      return {
        withdrawal_fees: 0
      };
    }
  };

  const { data } = useQuery(
    ['withdraw_fee', btcAddress, checkpointIndex],
    () => getWithdrawalFee(btcAddress, checkpointIndex),
    {
      refetchOnWindowFocus: true,
      enabled: !!btcAddress,
      staleTime: 10 * 60 * 1000
    }
  );
  return data;
};

export const useGetCheckpointFee = (checkpointIndex?: number) => {
  const getCheckpointFee = async (checkpointIndex?: number): Promise<CheckpointFeeInterface> => {
    try {
      const res = await axios.get(`/checkpoint/checkpoint_fee`, {
        params: {
          index: checkpointIndex
        }
      });
      return { checkpoint_fees: res.data.data };
    } catch (e) {
      console.error('getCheckpointFee', e);
      return {
        checkpoint_fees: 0
      };
    }
  };

  const { data } = useQuery(['checkpoint_fee', checkpointIndex], () => getCheckpointFee(checkpointIndex), {
    refetchOnWindowFocus: true,
    enabled: !!checkpointIndex,
    staleTime: 10 * 60 * 1000
  });
  return data;
};

const getCheckpointData = async (checkpointIndex?: number): Promise<CheckpointParsedData> => {
  try {
    const res = await axios.get(`/checkpoint`, {
      params: {
        index: checkpointIndex
      }
    });
    let data = res.data.data;
    let status = data.status;
    // Slice 1 to remove the input of previosu checkpoint
    data.transaction.data.input = data.transaction.data.input.map((item: TransactionInput) => {
      let [txid, vout] = item.previous_output.split(':');
      return {
        txid,
        vout
      };
    }) as TransactionParsedInput;
    // Slice 2 to remove the two addition outputs of complete checkpoint
    data.transaction.data.output = data.transaction.data.output
      .slice(status == CheckpointStatus.Building ? 0 : 2)
      .map((item: TransactionOutput) => {
        return {
          address: convertScriptPubkeyToBtcAddress(item.script_pubkey),
          value: item.value
        };
      }) as TransactionParsedOutput;

    return data;
  } catch (e) {
    console.log(e);
    return {
      fee_collected: 0,
      fee_rate: 0,
      signed_at_btc_height: 0,
      sigset: {
        create_time: 0,
        index: 0,
        possible_vp: 0,
        present_vp: 0,
        signatories: []
      },
      status: CheckpointStatus.Building,
      transaction: {
        hash: '',
        data: {
          input: [],
          output: [],
          lock_time: 0
        }
      }
    };
  }
};

export const useGetCheckpointData = (checkpointIndex?: number) => {
  const { data } = useQuery(['checkpoint', checkpointIndex], () => getCheckpointData(checkpointIndex), {
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000
  });
  return data;
};

const getPendingDeposits = async (address?: String): Promise<DepositInfo[]> => {
  try {
    const res = await axios.get('/bitcoin/pending_deposits', {
      params: {
        address
      }
    });
    return res.data.data.map((item: PendingDeposit) => ({
      confirmations: item.confirmations,
      ...item.deposit
    })) as DepositInfo[];
  } catch (e) {
    console.error('getPendingDeposits', e);
    return [];
  }
};

export const useGetPendingDeposits = (address?: String) => {
  const { data } = useQuery(['pending_deposits', address], () => getPendingDeposits(address), {
    refetchOnWindowFocus: true,
    refetchInterval: 10000
  });
  return data;
};
