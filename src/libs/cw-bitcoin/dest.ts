import { Dest as SdkDest } from '@oraichain/bitcoin-bridge-contracts-sdk/build/CwBitcoin.types';
import { Dest as WasmDest } from 'bitcoin-bridge-wasm-sdk';

export function convertWasmDestToSdkDest(dest: WasmDest, receiver: string, sender: string): SdkDest {
  if ('Address' in dest) {
    return { address: dest.Address };
  }
  if ('Ibc' in dest) {
    return {
      ibc: {
        memo: dest.Ibc.memo,
        source_channel: dest.Ibc.source_channel,
        source_port: dest.Ibc.source_port,
        timeout_timestamp: dest.Ibc.timeout_timestamp,
        receiver,
        sender
      }
    };
  }
  throw new Error('Invalid destination type');
}

export function convertSdkDestToWasmDest(dest: SdkDest): WasmDest {
  if ('address' in dest) {
    return { Address: dest.address };
  }
  if ('ibc' in dest) {
    return {
      Ibc: {
        memo: dest.ibc.memo,
        source_channel: dest.ibc.source_channel,
        source_port: dest.ibc.source_port,
        timeout_timestamp: dest.ibc.timeout_timestamp,
        sender: dest.ibc.sender,
        receiver: dest.ibc.receiver
      }
    };
  }
  throw new Error('Invalid destination type');
}
