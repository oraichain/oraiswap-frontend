import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { contracts } from 'libs/contracts';
import { Cw20Ics20Client } from 'libs/contracts/Cw20Ics20.client';
import { MulticallQueryClient } from 'libs/contracts/Multicall.client';
import { OraiswapConverterClient } from 'libs/contracts/OraiswapConverter.client';
import { OraiswapFactoryClient } from 'libs/contracts/OraiswapFactory.client';
import { OraiswapOracleClient } from 'libs/contracts/OraiswapOracle.client';
import { OraiswapPairClient } from 'libs/contracts/OraiswapPair.client';
import { OraiswapRewarderClient } from 'libs/contracts/OraiswapRewarder.client';
import { OraiswapRouterClient } from 'libs/contracts/OraiswapRouter.client';
import { OraiswapStakingClient } from 'libs/contracts/OraiswapStaking.client';
import { OraiswapTokenClient } from 'libs/contracts/OraiswapToken.client';
import { network } from './networks';

type ContractName =
  | 'oracle'
  | 'factory'
  | 'factory_v2'
  | 'router'
  | 'staking'
  | 'rewarder'
  | 'converter'
  | 'pair'
  | 'token'
  | 'cw20Ics20'
  | 'multicall';

export class Contract {
  public static sender: string = null;
  public static client: CosmWasmClient = null;
  private static getContract(type: ContractName, address: string, signing: boolean = true, className?: string): any {
    const key = '_' + type;
    const name = className || `Oraiswap${type.charAt(0).toUpperCase() + type.slice(1)}`;
    if (!this[key]) {
      const args = signing ? [this.sender, address] : [address];
      this[key] = new contracts[name][`${name}${signing ? '' : 'Query'}Client`](this.client, ...args);
    } else {
      this[key].sender = this.sender;
      this[key].contractAddress = address;
    }
    return this[key];
  }

  static get oracle(): OraiswapOracleClient {
    return this.getContract('oracle', network.oracle);
  }

  static get factory(): OraiswapFactoryClient {
    return this.getContract('factory', network.factory);
  }

  static get factory_v2(): OraiswapFactoryClient {
    return new OraiswapFactoryClient(this.client as SigningCosmWasmClient, this.sender, network.factory_v2);
  }

  static get router(): OraiswapRouterClient {
    return this.getContract('router', network.router);
  }

  static get staking(): OraiswapStakingClient {
    return this.getContract('staking', network.staking);
  }

  static get rewarder(): OraiswapRewarderClient {
    return this.getContract('rewarder', network.rewarder);
  }

  static get converter(): OraiswapConverterClient {
    return this.getContract('converter', network.converter);
  }

  static pair(contractAddress: string): OraiswapPairClient {
    return this.getContract('pair', contractAddress);
  }

  static token(contractAddress: string): OraiswapTokenClient {
    return this.getContract('token', contractAddress);
  }

  static ibcwasm(contractAddress: string): Cw20Ics20Client {
    return this.getContract('cw20Ics20', contractAddress, true, 'Cw20Ics20');
  }

  static get multicall(): MulticallQueryClient {
    return this.getContract('multicall', network.multicall, false, 'Multicall');
  }
}
