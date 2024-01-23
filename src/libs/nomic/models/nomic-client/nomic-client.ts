import { config as Config } from '../../config';

import { NomicClientInterface } from './nomic-client-interface';
import { OraiBtcSubnetChain } from '../ibc-chain';
import { DepositSuccess, generateDepositAddress, DepositOptions } from '@oraichain/orai-bitcoin';

export class NomicClient implements NomicClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);

  initialized = false;

  public depositAddress: DepositSuccess | null = null;

  public async getRecoveryAddress() {
    const isKeplrActive = await window.Keplr.getKeplr();
    if (isKeplrActive) {
      const address = await window.Keplr.getKeplrAddr(Config.chainId as any);
      if (!address) {
        return;
      }
      const result = await this.getRecoveredAddress(address);
      console.log('🚀 ~ NomicClient ~ getRecoveryAddress ~ result:', result);
      return result;
    }
    return null;
  }

  public async getAccountInfo(accAddress: string) {
    return await fetch(`${Config.restUrl}/cosmos/auth/v1beta1/accounts/${accAddress}`, { method: 'GET' }).then((data) =>
      data.json()
    );
  }
  public async getRecoveredAddress(accAddress: string) {
    return await fetch(
      `${Config.restUrl}/bitcoin/recovery_address/${accAddress}?network=${
        process.env.REACT_APP_ORAIBTC_NETWORK ?? 'bitcoin'
      }`,
      {
        method: 'GET'
      }
    ).then((data) => data.json());
  }

  public async generateAddress() {
    const isKeplrActive = await window.Keplr.getKeplr();
    if (isKeplrActive) {
      const sender = await window.Keplr.getKeplrAddr(Config.chainId as any);
      const receiver = await window.Keplr.getKeplrAddr();
      if (!sender || !receiver) {
        return;
      }
      const config = {
        relayers: [Config.relayerUrl],
        channel: OraiBtcSubnetChain.source.channelId, // ibc between oraibtc and orai chain
        network: process.env.REACT_APP_ORAIBTC_NETWORK ?? 'bitcoin',
        receiver: receiver, // bech32 address of the depositing user,
        sender: sender
      } as DepositOptions;

      const btcAddressToDeposit = (await generateDepositAddress(config, false)) as DepositSuccess;

      this.depositAddress = btcAddressToDeposit;
    }
  }
}
