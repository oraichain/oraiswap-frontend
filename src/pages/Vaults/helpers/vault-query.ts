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
  VAULT_FACTORY_CONTRACT_ADDRESS
} from '../constants';

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

export const getListVaultAddrs = async (): Promise<string[]> => {
  try {
    const vaultFactory = VaultClients.getVaultFactory();
    const vaultAddrs = await vaultFactory.getAllVaultAddress();
    console.log(vaultAddrs.length);
    console.log({ vaultAddrs });
    return Array.from(vaultAddrs);
  } catch (error) {
    console.error('Error getListVaultAddrs: ', error);
    return [];
  }
};

export const vaultInfos = [
  {
    vaultAddr: '0xd939Ff4A1bF7Dd7AAeBdF0bcb20E2950f42A4dc1',
    firstDenom: 'USDT',
    firstCoingeckoId: 'tether',
    secondDenom: 'WBNB',
    secondCoingeckoId: 'wbnb',
    decimals: 18
  }
];

/**
 * Get vault infos
 * @param vaultAddrs
 * @returns
 */
export const getVaultInfos = async (vaultAddrs: string[]) => {
  try {
    if (!vaultAddrs.length) return null;

    const vaultLpInterface = new utils.Interface(VaultLP__factory.abi);
    const dataCall = vaultAddrs.map((_vaultAddr) => vaultLpInterface.encodeFunctionData('getTVLInToken0'));
    const amounts = await VaultClients.getMulticall().multiCall(vaultAddrs, dataCall);
    // decode TVL
    const result = amounts.map((amount, index) => {
      // TODO: current hardcode list vault
      const vaultInfo = vaultInfos.find((vault) => vault.vaultAddr === vaultAddrs[index]);
      if (!vaultInfo) return null;
      return {
        ...vaultInfo,
        tvlByToken0: Array.from(vaultLpInterface.decodeFunctionResult('getTVLInToken0', amount))[0].toString()
      };
    });
    console.log({ result });
    return result;
  } catch (error) {
    console.error('Error getVaultInfos: ', error);
    return [];
  }
};
