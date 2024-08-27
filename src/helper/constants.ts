import { ChainIdEnum } from '@oraichain/oraidex-common';

export const leapSnapId = 'npm:@leapwallet/metamask-cosmos-snap';
export const leapWalletType = 'leapSnap';

export const btcNetwork: any = 'testnet'; // "bitcoin" or "testnet"

// TODO: hardcode switch bitcoinTestnet and bitcoin
export const bitcoinChainId: any = ChainIdEnum.BitcoinTestnet;
export const bitcoinLcd = 'http://18.191.171.150:8000';
export const CWBitcoinContractAddress = 'orai16qnhuc5jpp4h322ju4ass3z05hw2du0e9k5t5knzwcqyjr3rmzrsa8s5ag';
export const CWBitcoinFactoryDenom = 'factory/orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42/XuanDang';

export const AMOUNT_BALANCE_ENTRIES_UNIVERSAL_SWAP: [number, string, string][] = [
  [0.5, '50%', 'half'],
  [1, '100%', 'max']
];

export const DEFAULT_RELAYER_FEE = '1000000';
export const RELAYER_DECIMAL = 6;
export const DAY_IN_MILIS = 86400000;
