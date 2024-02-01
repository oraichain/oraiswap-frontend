export enum ChainEnableByNetwork {
  evm = '0x01',
  tron = '0x2b6653dc'
}

export const triggerUnlockOwalletInEvmNetwork = async (typeNetwork: ChainEnableByNetwork) => {
  if (!typeNetwork) return;
  return await window.owallet.enable(ChainEnableByNetwork[typeNetwork]);
};
