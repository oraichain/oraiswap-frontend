import { ChainIdEnum } from '@oraichain/oraidex-common';

export const leapSnapId = 'npm:@leapwallet/metamask-cosmos-snap';
export const leapWalletType = 'leapSnap';

export const btcNetwork: any = 'bitcoin';
// TODO: hardcode switch bitcoinTestnet and bitcoin
export const bitcoinChainId: any = ChainIdEnum.Bitcoin;
export const bitcoinLcd = 'https://btc.lcd.orai.io';
export const bitcoinLcdV2 = 'https://relayer-btc.oraidex.io';
export const CWAppBitcoinContractAddress = 'orai1xt4ahzz2x8hpkc0tk6ekte9x6crw4w6u0r67cyt3kz9syh24pd7sxfqs0x';
export const CWBitcoinFactoryDenom = 'factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/obtc';

export const MIN_DEPOSIT_BTC = 600;
export const MIN_WITHDRAW_BTC = 600;

export const AMOUNT_BALANCE_ENTRIES_UNIVERSAL_SWAP: [number, string, string][] = [
  [0.5, '50%', 'half'],
  [1, '100%', 'max']
];

export const DEFAULT_RELAYER_FEE = '1000000';
export const RELAYER_DECIMAL = 6;
export const DAY_IN_MILIS = 86400000;
