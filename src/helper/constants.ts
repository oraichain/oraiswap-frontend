export const leapSnapId = 'npm:@leapwallet/metamask-cosmos-snap';
export const leapWalletType = 'leapSnap';
// TODO: hardcode switch bitcoinTestnet and bitcoin
export const bitcoinChainId: any = process.env.REACT_APP_ORAIBTC_NETWORK === 'testnet' ? 'bitcoinTestnet' : 'bitcoin';
console.log('🚀 ~ bitcoinChainId:', bitcoinChainId);
export const MIN_DEPOSIT_BTC = 600;
export const MIN_WITHDRAW_BTC = 600;
