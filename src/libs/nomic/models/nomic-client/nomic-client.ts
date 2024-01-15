import init, { OraiBtc, DepositAddress } from '@oraichain/oraibtc-wasm';

import { config } from '../../config';

import { NomicClientInterface } from './nomic-client-interface';

export class NomicClient implements NomicClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);

  initialized = false;
  private nomic: OraiBtc;

  public depositAddress: DepositAddress | null = null;

  public async setRecoveryAddress(recovery_address: string) {
    const isKeplrActive = await window.Keplr.getKeplr();
    if (isKeplrActive) {
      const address = await window.Keplr.getKeplrAddr(config.chainId as any);
      if (!address) {
        return;
      }

      await this.nomic.setRecoveryAddress(address, recovery_address);
    }
  }
  public async generateAddress(destination?: string) {
    const isKeplrActive = await window.Keplr.getKeplr();
    if (isKeplrActive) {
      const address = await window.Keplr.getKeplrAddr(config.chainId as any);
      if (!address) {
        return;
      }

      const btcAddress = await this.nomic.generateDepositAddress(address);

      await this.nomic.broadcastDepositAddress(
        address,
        btcAddress.sigsetIndex,
        [config.relayerUrl],
        btcAddress.address
      ); // (make sure this succeeds before showing the btc address to the user)

      if (destination) {
        const [channel, receiver] = destination.split('/', 2);
        try {
          // fromBech32(receiver);
          this.depositAddress = await this.nomic.generateDepositAddress(receiver, channel, address);
        } catch {}
      }

      if (!this.depositAddress) this.depositAddress = btcAddress;
    }
  }

  public async init() {
    if (!this.initialized) {
      await init();
      this.nomic = new OraiBtc(config.restUrl, config.chainId, 'testnet');
      this.initialized = true;
    }
  }
}
