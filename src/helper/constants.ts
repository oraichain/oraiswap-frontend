export const leapSnapId = 'npm:@leapwallet/metamask-cosmos-snap';
export const leapWalletType = 'leapSnap';
export const btcNetwork: 'bitcoin' | 'testnet' = 'testnet';
// TODO: hardcode switch bitcoinTestnet and bitcoin
export const bitcoinChainId: any = btcNetwork === 'testnet' ? 'bitcoinTestnet' : 'bitcoin';

export const MIN_DEPOSIT_BTC = 600;
export const MIN_WITHDRAW_BTC = 600;
