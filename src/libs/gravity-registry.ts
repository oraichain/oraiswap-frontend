import { Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes as defaultStargateTypes } from '@cosmjs/stargate';
import { MsgSendToEth } from 'libs/proto/gravity/v1/msgs';

const gravityRegistry = new Registry(defaultStargateTypes);
gravityRegistry.register('/gravity.v1.MsgSendToEth', MsgSendToEth); // Replace with your own type URL and Msg class

export const sendToEthAminoTypes = {
  '/gravity.v1.MsgSendToEth': {
    aminoType: 'gravity/MsgSendToEth',
    toAmino: ({ sender, ethDest, amount, bridgeFee }) => ({
      sender,
      eth_dest: ethDest,
      amount,
      bridge_fee: bridgeFee,
    }),
    fromAmino: ({ sender, eth_dest, amount, bridge_fee }) => ({
      sender,
      ethDest: eth_dest,
      amount,
      bridgeFee: bridge_fee,
    }),
  },
};

export default gravityRegistry;
