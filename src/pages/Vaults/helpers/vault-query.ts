import { ethers, utils } from 'ethers';
import { OraiGatewayClient } from 'nestquant-vault-sdk';
import {
  MultiCall,
  MultiCall__factory,
  VaultLPFactory,
  VaultLPFactory__factory,
  VaultLP__factory
} from 'nestquant-vault-sdk/dist/typechain-types';
import {
  MULTICALL_CONTRACT_ADDRESS,
  ORAI_GATEWAY_CONTRACT_ADDRESS,
  ORAI_VAULT_BSC_CONTRACT_ADDRESS,
  VAULT_FACTORY_CONTRACT_ADDRESS
} from '../constants';
import { VaultInfoContract } from '../type';

export class VaultClients {
  static vaultFactory: VaultLPFactory;
  static oraiGateway: OraiGatewayClient;
  static multicall: MultiCall;

  static getVaultFactory() {
    if (!this.vaultFactory) {
      const provider = new ethers.providers.Web3Provider(window.ethereumDapp, 'any');
      this.vaultFactory = VaultLPFactory__factory.connect(VAULT_FACTORY_CONTRACT_ADDRESS, provider);
    }
    return this.vaultFactory;
  }

  static getOraiGateway(userAddr: string) {
    if (!this.oraiGateway) {
      this.oraiGateway = new OraiGatewayClient(window.client, userAddr, ORAI_GATEWAY_CONTRACT_ADDRESS);
    }
    return this.oraiGateway;
  }

  static getMulticall() {
    if (!this.multicall) {
      const provider = new ethers.providers.Web3Provider(window.ethereumDapp, 'any');
      this.multicall = MultiCall__factory.connect(MULTICALL_CONTRACT_ADDRESS, provider);
    }
    return this.multicall;
  }
}

export const vaultInfos = [
  {
    vaultAddr: '0xe7F9818426D6584f3abA93c203024C9AA8678eB2',
    firstDenom: 'USDT',
    firstCoingeckoId: 'tether',
    secondDenom: 'WBNB',
    secondCoingeckoId: 'wbnb',
    decimals: 18
  }
];

/**
 * Get vault infos from contract
 * @param vaultAddrs
 * @returns
 */
export const getVaultInfosFromContract = async (vaultAddrs: string[]): Promise<VaultInfoContract[]> => {
  try {
    if (!vaultAddrs.length) return null;

    const vaultLpInterface = new utils.Interface(VaultLP__factory.abi);
    const dataCall = vaultAddrs.map((_vaultAddr) => vaultLpInterface.encodeFunctionData('getVaultInfo', [ORAI_VAULT_BSC_CONTRACT_ADDRESS]));
    const amounts = await VaultClients.getMulticall().multiCall(vaultAddrs, dataCall);
    // decode TVL
    const decodedResults = amounts.map((result, index) => {
      const arrs = Array.from(
        vaultLpInterface.decodeFunctionResult("getVaultInfo", result)
      );
      return {
        vaultAddress: arrs[0],
        tvlByToken1: utils.formatEther(arrs[1]),
        totalSupply: utils.formatEther(arrs[2]),
        oraiBalance: utils.formatEther(arrs[3]),
      };
    });
    return decodedResults;
  } catch (error) {
    console.error('Error getVaultInfosFromContract: ', error);
    return [];
  }
};

export const getShareBalance = async (vaultAddr: string, userAddr: string, oraiVaultShare: bigint) => {
  try {
    const shareOfSender = await VaultClients.getOraiGateway(userAddr).balance({
      userAddress: userAddr,
      vaultAddress: vaultAddr,
    });
    const totalSupply = await VaultClients.getOraiGateway(userAddr).totalSupply({
      vaultAddress: vaultAddr,
    });
    const correspondingShare =
      (BigInt(shareOfSender.amount) * oraiVaultShare) /
      BigInt(totalSupply.total_supply); // corresponding share in lp token 
    return utils.formatEther(correspondingShare);
  } catch (error) {
    console.error('Error getShareBalance: ', error);
    return '0';
  }
}
