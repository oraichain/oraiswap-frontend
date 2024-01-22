export const leapSnapId = 'npm:@leapwallet/metamask-cosmos-snap';
export const leapWalletType = 'leapSnap';
// TODO: hardcode switch bitcoinTestnet and bitcoin
export const bitcoinChainId = process.env.REACT_APP_ORAIBTC_NETWORK === 'testnet' ? 'bitcoinTestnet' : 'bitcoin';
console.log('🚀 ~ bitcoinChainId:', bitcoinChainId);
