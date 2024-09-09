import { Coin } from '@cosmjs/proto-signing';
import { ZapperClient } from '@oraichain/oraidex-contracts-sdk';
import { network } from 'config/networks';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import { getCosmWasmClient } from 'libs/cosmjs';
import { executeMultiple } from '../helpers/helper';
import { TokenItemType } from '@oraichain/oraidex-common';
import { ZapInLiquidityResponse } from '@oraichain/oraiswap-v3';

export type ZapInData = {
  tokenZap: TokenItemType;
  zapAmount: string;
  zapInResponse: ZapInLiquidityResponse;
};

const useZap = () => {
  const ZAP_CONTRACT = 'orai1tyjh83hq3rxl0rd5upt4tfjjk87x73tv0kaskethjukwknjlq4wsltf7nn';

  const zapIn = async (data: ZapInData, walletAddress: string, onSuccess: any, onError: any) => {
    try {
      const { tokenZap, zapAmount, zapInResponse } = data;

      let msg = [];

      // approve
      const coins: Coin[] = [];
      if (tokenZap.contractAddress) {
        msg.push({
          contractAddress: tokenZap.contractAddress,
          msg: {
            increase_allowance: {
              amount: zapAmount,
              spender: ZAP_CONTRACT
            }
          }
        });
      } else {
        coins.push({
          denom: tokenZap.denom,
          amount: zapAmount
        });
      }

      // zapIn message
      msg.push({
        contractAddress: ZAP_CONTRACT,
        msg: {
          zap_in_liquidity: {
            amount_to_x: zapInResponse.amountToX,
            amount_to_y: zapInResponse.amountToY,
            asset_in: zapInResponse.assetIn,
            pool_key: zapInResponse.poolKey,
            tick_lower_index: zapInResponse.tickLowerIndex,
            tick_upper_index: zapInResponse.tickUpperIndex,
            minimum_receive_x: zapInResponse.minimumReceiveX,
            minimum_receive_y: zapInResponse.minimumReceiveY,
            operation_to_x: zapInResponse.operationToX.length > 0 ? zapInResponse.operationToX : undefined,
            operation_to_y: zapInResponse.operationToY.length > 0 ? zapInResponse.operationToY : undefined
          }
        },
        funds: coins
      });

      const tx = await executeMultiple(msg, walletAddress);

      if (tx) {
        onSuccess(tx);
      }

      return tx;
    } catch (e: any) {
      console.log('error', e);
      onError(e);
    }
  };

  return {
    zapIn
  };
};

export default useZap;
