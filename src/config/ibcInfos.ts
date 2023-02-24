import { IBCInfo } from 'types/ibc';
import {
  IBC_TRANSFER_TIMEOUT,
  KWT_SUBNETWORK_CHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID
} from './constants';
import { network, NetworkKey } from './networks';

export const [atom2oraichain, oraicbain2atom] =
  process.env.REACT_APP_ATOM_ORAICHAIN_CHANNELS.split(/\s+/);
const [terra2oraichain, oraicbain2terra] =
  process.env.REACT_APP_TERRA_ORAICHAIN_CHANNELS.split(/\s+/);
const [osmosis2oraichain, oraicbain2osmosis] =
  process.env.REACT_APP_OSMOSIS_ORAICHAIN_CHANNELS.split(/\s+/);
const [oraib2oraichain, oraichain2oraib] =
  process.env.REACT_APP_ORAIB_ORAICHAIN_CHANNELS.split(/\s+/);
const [oraib2oraichain_old, oraichain2oraib_old] =
  process.env.REACT_APP_ORAIB_ORAICHAIN_CHANNELS_OLD.split(/\s+/);
const [kwt2oraichain, oraichain2kwt] =
  process.env.REACT_APP_KWT_ORAICHAIN_CHANNELS.split(/\s+/);

export interface IBCInfoMap {
  [key: string]: { [key: string]: IBCInfo };
}

const ibcInfosMap: Record<NetworkKey, IBCInfoMap> = {
  [NetworkKey.TESTNET]: {},
  [NetworkKey.MAINNET]: {
    'cosmoshub-4': {
      Oraichain: {
        source: 'transfer',
        channel: atom2oraichain,
        timeout: IBC_TRANSFER_TIMEOUT
      }
    },
    'columbus-5': {
      Oraichain: {
        source: 'transfer',
        channel: terra2oraichain,
        timeout: IBC_TRANSFER_TIMEOUT
      }
    },
    'osmosis-1': {
      Oraichain: {
        source: 'transfer',
        channel: osmosis2oraichain,
        timeout: IBC_TRANSFER_TIMEOUT
      }
    },
    [KWT_SUBNETWORK_CHAIN_ID]: {
      Oraichain: {
        source: 'transfer',
        channel: kwt2oraichain,
        timeout: IBC_TRANSFER_TIMEOUT
      }
    },
    Oraichain: {
      'cosmoshub-4': {
        source: 'transfer',
        channel: oraicbain2atom,
        timeout: IBC_TRANSFER_TIMEOUT
      },
      'columbus-5': {
        source: 'transfer',
        channel: oraicbain2terra,
        timeout: IBC_TRANSFER_TIMEOUT
      },
      'osmosis-1': {
        source: 'transfer',
        channel: oraicbain2osmosis,
        timeout: IBC_TRANSFER_TIMEOUT
      },
      [ORAI_BRIDGE_CHAIN_ID]: {
        source: `wasm.${process.env.REACT_APP_IBC_WASM_CONTRACT}`,
        channel: oraichain2oraib,
        timeout: IBC_TRANSFER_TIMEOUT
      },
      [KWT_SUBNETWORK_CHAIN_ID]: {
        source: 'transfer',
        channel: oraichain2kwt,
        timeout: IBC_TRANSFER_TIMEOUT,
      },
      // [ORAI_BRIDGE_ETHER_CHAIN_ID]: {
      //   source: 'transfer',
      //   channel: oraichain2oraibether,
      //   timeout: IBC_TRANSFER_TIMEOUT,
      // },
    },
    [ORAI_BRIDGE_CHAIN_ID]: {
      Oraichain: {
        source: 'transfer',
        channel: oraib2oraichain,
        timeout: IBC_TRANSFER_TIMEOUT,
      },
    },
    // [ORAI_BRIDGE_ETHER_CHAIN_ID]: {
    //   Oraichain: {
    //     source: 'transfer',
    //     channel: oraibether2oraichain,
    //     timeout: IBC_TRANSFER_TIMEOUT,
    //   },
    // },
  },
};

const ibcInfosMapOraiBridgeOld: Record<NetworkKey, IBCInfoMap> = {
  [NetworkKey.TESTNET]: {},
  [NetworkKey.MAINNET]: {
    Oraichain: {
      [ORAI_BRIDGE_CHAIN_ID]: {
        source: 'transfer',
        channel: oraichain2oraib_old,
        timeout: IBC_TRANSFER_TIMEOUT
      },
      // [ORAI_BRIDGE_ETHER_CHAIN_ID]: {
      //   source: 'transfer',
      //   channel: oraichain2oraibether,
      //   timeout: IBC_TRANSFER_TIMEOUT,
      // },
    },
    [ORAI_BRIDGE_CHAIN_ID]: {
      Oraichain: {
        source: 'transfer',
        channel: oraib2oraichain_old,
        timeout: IBC_TRANSFER_TIMEOUT,
      },
    },
    // [ORAI_BRIDGE_ETHER_CHAIN_ID]: {
    //   Oraichain: {
    //     source: 'transfer',
    //     channel: oraibether2oraichain,
    //     timeout: IBC_TRANSFER_TIMEOUT,
    //   },
    // },
  },
};

// this ibc mapping is solely used for backward compatibility - helps user bridge old IBC native back to OraiBridge & for KWT, MILKY
export const ibcInfosOld = ibcInfosMapOraiBridgeOld[network.id];

export const ibcInfos = ibcInfosMap[network.id];
