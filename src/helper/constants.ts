import { network } from 'config/networks';

export const leapSnapId = 'npm:@leapwallet/metamask-cosmos-snap';
export const leapWalletType = 'leapSnap';

export const btcNetwork: any = 'bitcoin';
// TODO: hardcode switch bitcoinTestnet and bitcoin
export const bitcoinChainId: any = 'bitcoin';
export const bitcoinLcd = 'https://btc.lcd.orai.io';

export const MIN_DEPOSIT_BTC = 600;
export const MIN_WITHDRAW_BTC = 600;
export const INDEXER_V3_URL = network.indexer_v3 ?? 'https://staging-ammv3-indexer.oraidex.io/';
