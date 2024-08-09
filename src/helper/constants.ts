export const leapSnapId = 'npm:@leapwallet/metamask-cosmos-snap';
export const leapWalletType = 'leapSnap';

export const btcNetwork: any = 'bitcoin';
// TODO: hardcode switch bitcoinTestnet and bitcoin
export const bitcoinChainId: any = 'bitcoin';
export const bitcoinLcd = 'https://btc.lcd.orai.io';

export const MIN_DEPOSIT_BTC = 600;
export const MIN_WITHDRAW_BTC = 600;

export const AMOUNT_BALANCE_ENTRIES_UNIVERSAL_SWAP: [number, string, string][] = [
  [0.5, '50%', 'half'],
  [1, '100%', 'max']
];

export const DEFAULT_RELAYER_FEE = '1000000';
export const RELAYER_DECIMAL = 6;
export const DAY_IN_MILIS = 86400000;
