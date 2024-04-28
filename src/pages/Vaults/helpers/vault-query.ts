import { ethers } from 'ethers-v6';
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
  static ethereumProvider: ethers.JsonRpcProvider;

  static getEthereumProvider() {
    if (!this.ethereumProvider) {
      const rpcProviderUrl = 'https://bsc-dataseed2.binance.org/';
      this.ethereumProvider = new ethers.JsonRpcProvider(rpcProviderUrl);
    }
    return this.ethereumProvider;
  }

  static getVaultFactory() {
    if (!this.vaultFactory) {
      this.vaultFactory = VaultLPFactory__factory.connect(VAULT_FACTORY_CONTRACT_ADDRESS, this.getEthereumProvider());
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
      this.multicall = MultiCall__factory.connect(MULTICALL_CONTRACT_ADDRESS, this.getEthereumProvider());
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

    const vaultLpInterface = new ethers.Interface(VaultLP__factory.abi);
    const dataCall = vaultAddrs.map((_vaultAddr) =>
      vaultLpInterface.encodeFunctionData('getVaultInfo', [ORAI_VAULT_BSC_CONTRACT_ADDRESS])
    );
    const amounts = await VaultClients.getMulticall().multiCall.staticCall(vaultAddrs, dataCall);
    // decode TVL
    const decodedResults = amounts.map((result, index) => {
      const arrs = Array.from(vaultLpInterface.decodeFunctionResult('getVaultInfo', result));
      return {
        vaultAddress: arrs[0],
        tvlByToken1: ethers.formatEther(arrs[1] as any),
        totalSupply: ethers.formatEther(arrs[2] as any),
        oraiBalance: ethers.formatEther(arrs[3] as any)
      };
    });
    return decodedResults;
  } catch (error) {
    console.error('Error getVaultInfosFromContract: ', error);
    return [];
  }
};
