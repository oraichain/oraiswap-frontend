import { evmChains, WalletType, cosmosTokens, flattenTokens } from '@oraichain/oraidex-common';
import { useDispatch } from 'react-redux';
import { updateAmounts } from 'reducer/token';

export type Wallet = WalletType | 'metamask' | 'tron';
export const useResetBalance = () => {
  const dispatch = useDispatch();

  const handleResetBalance = (wallets: Wallet[]) => {
    let amounts: AmountDetails = {};
    for (const wallet of wallets) {
      amounts = {
        ...amounts,
        ...getResetedBalanceByWallet(wallet)
      };
    }
    dispatch(updateAmounts(amounts));
  };

  const getResetedBalanceByWallet = (walletType: Wallet) => {
    let updatedAmounts: AmountDetails = {};
    switch (walletType) {
      case 'keplr':
        updatedAmounts = resetBalanceCosmos();
        break;
      case 'owallet':
        updatedAmounts = resetBalanceCosmos();
        break;
      case 'metamask':
        updatedAmounts = resetBalanceMetamask();
        break;
      case 'tron':
        updatedAmounts = resetBalanceTron();
        break;
      default:
        break;
    }
    return updatedAmounts;
  };

  const resetBalanceCosmos = () => {
    return Object.fromEntries(cosmosTokens.map((t) => [t.denom, '0']));
  };

  const resetBalanceMetamask = () => {
    const metamaskToken = flattenTokens.filter((token) =>
      // @ts-ignore
      evmChains.filter((chainId) => chainId !== '0x2b6653dc').includes(token.chainId)
    );
    return Object.fromEntries(metamaskToken.map((t) => [t.denom, '0']));
  };

  const resetBalanceTron = () => {
    const tronTokens = flattenTokens.filter((token) => token.chainId === '0x2b6653dc');
    return Object.fromEntries(tronTokens.map((t) => [t.denom, '0']));
  };

  return { handleResetBalance };
};
