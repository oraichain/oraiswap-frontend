import { Coin } from '@cosmjs/proto-signing';
import { ZapperClient } from '@oraichain/oraidex-contracts-sdk';
import { network } from 'config/networks';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import { getCosmWasmClient } from 'libs/cosmjs';
import { executeMultiple } from '../helpers/helper';
import { TokenItemType } from '@oraichain/oraidex-common';
import { ZapInLiquidityResponse, ZapOutLiquidityResponse } from '@oraichain/oraiswap-v3';

export type ZapInData = {
  tokenZap: TokenItemType;
  zapAmount: string;
  zapInResponse: ZapInLiquidityResponse;
};

export type ZapOutData = {
  tokenId: number;
  zapOutResponse: ZapOutLiquidityResponse;
};

const useZap = () => {
  const ZAP_CONTRACT = 'orai1zersemmt4cdwqg8ujx2mzz5cv34puwf7nt7e5ywg954hpscdgtrqu29tu9';

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

  const zapOut = async (data: ZapOutData, walletAddress: string, onSuccess: any, onError: any) => {
    try {
      const { tokenId, zapOutResponse } = data;

      let msg = [];

      // first approve NFT for ZAP_CONTRACT
      msg.push({
        contractAddress: network.pool_v3,
        msg: {
          approve: {
            spender: ZAP_CONTRACT,
            token_id: tokenId
          }
        }
      });

      // zapOut message
      msg.push({
        contractAddress: ZAP_CONTRACT,
        msg: {
          zap_out_liquidity: {
            minimum_receive_x: zapOutResponse.minimumReceiveX,
            minimum_receive_y: zapOutResponse.minimumReceiveY,
            operation_from_x: zapOutResponse.operationFromX.length > 0 ? zapOutResponse.operationFromX : undefined,
            operation_from_y: zapOutResponse.operationFromY.length > 0 ? zapOutResponse.operationFromY : undefined,
            position_index: zapOutResponse.positionIndex
          }
        }
      });

      const tx = await executeMultiple(msg, walletAddress);

      if (tx) {
        onSuccess(tx);
      }
    } catch (e: any) {
      console.log('error', e);
      onError(e);
    }
  };

  return {
    zapIn,
    zapOut
  };
};

export default useZap;
