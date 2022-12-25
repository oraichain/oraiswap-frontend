import { contracts } from 'libs/contracts';
import { Cw20Ics20Client, Cw20Ics20QueryClient } from 'libs/contracts/Cw20Ics20.client';
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
  | 'router'
  | 'staking'
  | 'rewarder'
  | 'converter'
  | 'pair'
  | 'token'
  | 'ibcwasm';

export class Contract {
  private static _sender: string = null;

  static set sender(sender: string) {
    this._sender = sender;
  }

  private static getContract(type: ContractName, address: string): any {
    const key = '_' + type;
    const className = type.charAt(0).toUpperCase() + type.slice(1);

    if (!this[key]) {
      this[key] = new contracts[`Oraiswap${className}`][
        `Oraiswap${className}Client`
      ](window.client, this._sender, address);
    } else {
      this[key].sender = this._sender;
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
    return new Cw20Ics20Client(window.client, this._sender, contractAddress);
  }
}
