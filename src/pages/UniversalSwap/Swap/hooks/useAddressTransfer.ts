import { TokenItemType, checkValidateAddressWithNetwork } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { getAddressTransfer, networks } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useWalletReducer from 'hooks/useWalletReducer';
import { useEffect, useState } from 'react';
import { WalletsByNetwork } from 'reducer/wallet';

export const handleAddress = async ({
  token,
  walletByNetworks,
  onReset,
  onSuccess
}: {
  token: TokenItemType;
  walletByNetworks: WalletsByNetwork;
  onReset: () => void;
  onSuccess: (addr: string) => void;
}) => {
  if (!isMobile()) {
    if (!walletByNetworks.evm && !walletByNetworks.cosmos && !walletByNetworks.tron) {
      return onReset();
    }

    if (token.cosmosBased && !walletByNetworks.cosmos) {
      return onReset();
    }

    if (!token.cosmosBased && token.chainId === '0x2b6653dc' && !walletByNetworks.tron) {
      return onReset();
    }

    if (!token.cosmosBased && !walletByNetworks.evm) {
      return onReset();
    }
  }

  if (token.chainId) {
    const findNetwork = networks.find((net) => net.chainId === token.chainId);
    const address = await getAddressTransfer(findNetwork, walletByNetworks);

    onSuccess(address);
  }
};

const useAddressTransfer = ({
  originalToToken,
  originalFromToken
}: {
  originalToToken: TokenItemType;
  originalFromToken: TokenItemType;
}) => {
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [oraiAddress] = useConfigReducer('address');
  const [addressTransfer, setAddressTransfer] = useState('');
  const [initAddressTransfer, setInitAddressTransfer] = useState('');

  useEffect(() => {
    handleAddress({
      token: originalToToken,
      walletByNetworks,
      onReset: () => setAddressTransfer(''),
      onSuccess: (address) => {
        setAddressTransfer(address);
        setInitAddressTransfer(address);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    originalToToken,
    oraiAddress,
    metamaskAddress,
    tronAddress,
    walletByNetworks.evm,
    walletByNetworks.cosmos,
    walletByNetworks.tron,
    window?.ethereumDapp,
    window?.tronWebDapp
  ]);

  const validAddress = !(
    walletByNetworks.cosmos ||
    walletByNetworks.bitcoin ||
    walletByNetworks.evm ||
    walletByNetworks.tron
  )
    ? {
        isValid: true
      }
    : checkValidateAddressWithNetwork(addressTransfer, originalToToken?.chainId);

  return {
    addressTransfer,
    setAddressTransfer,
    initAddressTransfer,
    setInitAddressTransfer,
    validAddress
  };
};

export default useAddressTransfer;
