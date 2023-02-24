import { NetworkConfig } from 'types/network';
import { ORAI_LCD, ORAI_RPC, ORAI_SCAN } from './constants';

export enum NetworkKey {
  MAINNET = 'mainnet',
  TESTNET = 'testnet'
}

const networks: Record<NetworkKey, NetworkConfig> = {
  [NetworkKey.MAINNET]: {
    chainId: 'Oraichain',
    prefix: 'orai',
    denom: 'orai',
    coinType: 118,
    lcd: ORAI_LCD,
    rpc: ORAI_RPC,
    id: NetworkKey.MAINNET,
    fee: { gasPrice: '0.00506', amount: '1518', gas: '2000000' }, // 0.000500 ORAI
    factory: process.env.REACT_APP_FACTORY_CONTRACT,
    factory_v2: process.env.REACT_APP_FACTORY_V2_CONTRACT,
    router: process.env.REACT_APP_ROUTER_V2_CONTRACT,
    oracle: process.env.REACT_APP_ORACLE_CONTRACT,
    staking: process.env.REACT_APP_STAKING_CONTRACT,
    rewarder: process.env.REACT_APP_REWARDER_CONTRACT,
    converter: process.env.REACT_APP_CONVERTER_CONTRACT,
    explorer: ORAI_SCAN
  },
  [NetworkKey.TESTNET]: {
    chainId: 'Oraichain-testnet',
    prefix: 'orai',
    denom: 'orai',
    coinType: 118,
    lcd: 'https://testnet.lcd.orai.io',
    rpc: 'https://testnet.rpc.orai.io',
    id: NetworkKey.TESTNET,
    fee: { gasPrice: '0.00506', amount: '1518', gas: '2000000' }, // 0.050000 ORAI
    factory: 'orai1d5g77f27jg8wvrrdval36dd5q97rfgn7lmnmra',
    factory_v2: process.env.REACT_APP_FACTORY_V2_CONTRACT,
    router: 'orai1g0pwp3rgzqywvt0xdut08gknyj5q37rtn5aecx',
    oracle: 'orai1pnujlcvcqwawclat8xrhw80rvjx2yynanpevpn',
    staking: process.env.REACT_APP_STAKING_CONTRACT,
    explorer: 'https://testnet.scan.orai.io',
    rewarder: process.env.REACT_APP_REWARDER_CONTRACT,
    converter: process.env.REACT_APP_CONVERTER_CONTRACT
  }
};

export default networks;

export const network =
  // sure have value
  networks[process.env.REACT_APP_NETWORK];

export interface NetworkItem {
  cosmosBased: boolean;
  name: string;
  chainId: string;
  icon: string;
  rpc: string;
}

// sadly our Oraichain is not added into keplr yet
export const mobileBlacklistNetworks: string[] = [
  network.chainId
  // 'cosmoshub-4',
  // 'columbus-5'
];
