// import init, { OraiBtc, DepositAddress } from '@oraichain/oraibtc-wasm';
// import { generateDepositAddress, DepositOptions, DepositSuccess } from '@oraichain/orai-bitcoin';

import { config as Config } from '../../config';

import { NomicClientInterface } from './nomic-client-interface';
import { OraiBtcSubnetChain } from '../ibc-chain';
import { DepositSuccess, generateDepositAddress, DepositOptions } from '@oraichain/orai-bitcoin';

export class NomicClient implements NomicClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);

  initialized = false;

  public depositAddress: DepositSuccess | null = null;

  public async setRecoveryAddress(recovery_address: string) {
    // const isKeplrActive = await window.Keplr.getKeplr();
    // if (isKeplrActive) {
    //   const address = await window.Keplr.getKeplrAddr(config.chainId as any);
    //   if (!address) {
    //     return;
    //   }
    //   await this.nomic.setRecoveryAddress(address, recovery_address);
    // }
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
        relayers: ['https://oraibtc.relayer.orai.io'],
        channel: OraiBtcSubnetChain.source.channelId, // ibc between oraibtc and orai chain
        network: 'testnet',
        receiver: receiver, // bech32 address of the depositing user,
        sender: sender
      } as DepositOptions;

      const btcAddressToDeposit = (await generateDepositAddress(config, false)) as DepositSuccess;

      this.depositAddress = btcAddressToDeposit;
    }
  }
}
