import {
  BSC_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  KWT_SUBNETWORK_EVM_CHAIN_ID,
  KWT_SUBNETWORK_CHAIN_ID,
  COSMOS_CHAIN_ID,
  OSMOSIS_CHAIN_ID,
  ORAICHAIN_ID,
  ERC20_ORAI,
  BEP20_ORAI,
  KAWAII_ORAI,
  ETHEREUM_RPC,
  BSC_RPC
} from 'config/constants';
import { ChainInfoType } from 'hooks/useGlobalState';

export const handleCheckChain = (
  chainId: string | number,
  infoCosmos?: ChainInfoType
) => {
  switch (chainId) {
    case BSC_CHAIN_ID:
      return window.Metamask.isBsc();
    case ETHEREUM_CHAIN_ID:
      return window.Metamask.isEth();
    case KWT_SUBNETWORK_EVM_CHAIN_ID:
      return (
        Number(window.ethereum.chainId) === Number(KWT_SUBNETWORK_EVM_CHAIN_ID)
      );
    case KWT_SUBNETWORK_CHAIN_ID:
      return infoCosmos.chainId === KWT_SUBNETWORK_CHAIN_ID;
    case COSMOS_CHAIN_ID:
      return infoCosmos.chainId === COSMOS_CHAIN_ID;
    case OSMOSIS_CHAIN_ID:
      return infoCosmos.chainId === OSMOSIS_CHAIN_ID;
    case ORAICHAIN_ID:
      return (
        infoCosmos.chainId !== OSMOSIS_CHAIN_ID &&
        infoCosmos.chainId !== COSMOS_CHAIN_ID &&
        infoCosmos.chainId !== KWT_SUBNETWORK_CHAIN_ID
      );
    default:
      return false;
  }
};

export const getDenomEvm = () => {
  if (window.Metamask.isEth()) return ERC20_ORAI;
  if (window.Metamask.isBsc()) return BEP20_ORAI;
  return KAWAII_ORAI;
};

export const getRpcEvm = (infoEvm?: ChainInfoType) => {
  if (window.Metamask.isEth()) return ETHEREUM_RPC;
  if (window.Metamask.isBsc()) return BSC_RPC;
  return infoEvm?.rpc;
};
