import { ethers, utils, providers } from 'ethers';
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
  static multicall: any;
  static ethereumProvider: providers.JsonRpcProvider;

  static getEthereumProvider() {
    if (!this.ethereumProvider) {
      const rpcProviderUrl = 'https://endpoints.omniatech.io/v1/bsc/mainnet/public';
      this.ethereumProvider =  new providers.JsonRpcProvider(rpcProviderUrl);
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
      this.multicall = new ethers.Contract(MULTICALL_CONTRACT_ADDRESS, MultiCall__factory.abi, this.getEthereumProvider());
    }
    return this.multicall;
  }
}

export const vaultInfos = [
  {
    vaultAddr: '0xba10c932b2920910E03CD5E33fa0874284c09A46',
    firstDenom: 'USDT',
    firstCoingeckoId: 'tether',
    secondDenom: 'BTC',
    secondCoingeckoId: 'bitcoin',
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
    const dataCall = vaultAddrs.map((_vaultAddr) =>
      vaultLpInterface.encodeFunctionData('getVaultInfo', [ORAI_VAULT_BSC_CONTRACT_ADDRESS])
    );
    const provider = new providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/bsc/mainnet/public');
    console.log({ provider });

    const amounts = await VaultClients.getMulticall().callStatic.multiCall(vaultAddrs, dataCall);
    // decode TVL
    const decodedResults = amounts.map((result, index) => {
      const arrs = Array.from(vaultLpInterface.decodeFunctionResult('getVaultInfo', result));
      return {
        vaultAddress: arrs[0],
        tvlByToken1: utils.formatEther(arrs[1] as any),
        totalSupply: utils.formatEther(arrs[2] as any),
        oraiBalance: utils.formatEther(arrs[3] as any)
      };
    });
    return decodedResults;
  } catch (error) {
    console.error('Error getVaultInfosFromContract: ', error);
    return [];
  }
};
