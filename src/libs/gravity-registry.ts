import { Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes as defaultStargateTypes } from '@cosmjs/stargate';
import { MsgSendToEth } from './proto/gravity/v1/msgs';

const gravityRegistry = new Registry(defaultStargateTypes);
gravityRegistry.register('/gravity.v1.MsgSendToEth', MsgSendToEth); // Replace with your own type URL and Msg class

export const sendToEthAminoTypes = {
  '/gravity.v1.MsgSendToEth': {
    aminoType: 'gravity/MsgSendToEth',
    toAmino: ({
      sender,
      ethDest,
      amount,
      bridgeFee,
      chainFee,
      evmChainPrefix
    }: MsgSendToEth) => ({
      sender,
      eth_dest: ethDest,
      amount,
      bridge_fee: bridgeFee,
      chain_fee: chainFee,
      evm_chain_prefix: evmChainPrefix
    }),
    fromAmino: ({
      sender,
      eth_dest,
      amount,
      bridge_fee,
      chain_fee,
      evm_chain_prefix
    }): MsgSendToEth => ({
      sender,
      ethDest: eth_dest,
      amount,
      bridgeFee: bridge_fee,
      chainFee: chain_fee,
      evmChainPrefix: evm_chain_prefix
    })
  }
};

export default gravityRegistry;
