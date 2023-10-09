import { toAmount } from '@oraichain/oraidex-common';
import { cosmosTokens, TokenItemType } from 'config/bridgeTokens';
import { GAS_ESTIMATION_SWAP_DEFAULT, ORAI } from 'config/constants';
import { network } from 'config/networks';
import { feeEstimate } from 'helper';
import { generateMsgsSwap } from 'pages/SwapV2/helpers';
import { generateContractMessages, Type } from 'rest/api';

describe('swap', () => {
  describe('generate msgs contract for swap action', () => {
    const senderAddress = 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz';
    const fromAmountToken = 10;
    const fromTokenDecimals = 6;
    const fromTokenHaveContract = cosmosTokens.find((item) => item.name === 'AIRI' && item.chainId === 'Oraichain');
    const fromTokenNoContract = cosmosTokens.find((item) => item.name === 'ATOM' && item.chainId === 'Oraichain');
    const toTokenInfoData = cosmosTokens.find((item) => item.name === 'ORAIX' && item.chainId === 'Oraichain');
    const _fromAmount = toAmount(fromAmountToken, fromTokenDecimals).toString();
    const amounts = {
      airi: '2000000'
    };
    const userSlippage = 1;
    const simulateAverage = '2';
    const minimumReceive = '1000';

    it('return msgs generate contract', () => {
      testMsgs(fromTokenHaveContract, toTokenInfoData);
      testMsgs(fromTokenNoContract, toTokenInfoData);
    });

    function testMsgs(fromTokenInfoData: TokenItemType, toTokenInfoData: TokenItemType) {
      const msg = generateContractMessages({
        type: Type.SWAP,
        sender: senderAddress,
        amount: _fromAmount,
        fromInfo: fromTokenInfoData,
        toInfo: toTokenInfoData,
        minimumReceive
      } as any);

      // check if the contract address, msg and sender are correct
      if (fromTokenInfoData.contractAddress) {
        expect(msg.contractAddress).toEqual(fromTokenInfoData.contractAddress);
        expect(msg.msg.send.contract).toEqual(network.router);
        expect(msg.msg.send.amount).toEqual(_fromAmount);
      } else {
        expect(msg.contractAddress).toEqual(network.router);
        // check swap operation msg when pair is false
        expect(msg.msg).toEqual({
          execute_swap_operations: {
            operations: [
              {
                orai_swap: {
                  offer_asset_info: {
                    native_token: {
                      denom: fromTokenInfoData.denom
                    }
                  },
                  ask_asset_info: {
                    native_token: {
                      denom: ORAI
                    }
                  }
                }
              },
              {
                orai_swap: {
                  offer_asset_info: {
                    native_token: {
                      denom: ORAI
                    }
                  },
                  ask_asset_info: {
                    token: {
                      contract_addr: toTokenInfoData.contractAddress
                    }
                  }
                }
              }
            ],
            minimum_receive: minimumReceive
          }
        });
      }
      expect(msg.funds).toBeDefined();

      const multipleMsgs = generateMsgsSwap(
        fromTokenInfoData,
        fromAmountToken,
        toTokenInfoData,
        amounts,
        userSlippage,
        senderAddress,
        simulateAverage
      );
      expect(Array.isArray(multipleMsgs)).toBe(true);
    }
  });
});
