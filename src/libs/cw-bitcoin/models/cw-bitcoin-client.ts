import { DepositSuccess } from '@oraichain/orai-bitcoin';
import { bitcoinLcd, btcNetwork } from 'helper/constants';
import { CwBitcoinClientInterface } from './cw-bitcoin-client-interface';
import { Dest } from '@oraichain/bitcoin-bridge-contracts-sdk/build/CwBitcoin.types';
// import { generateDepositAddress } from '..';
import { generateDepositAddress } from '@oraichain/bitcoin-bridge-lib-js';

export class CwBitcoinClient implements CwBitcoinClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);
  initialized = false;

  public depositAddress: DepositSuccess | null = null;

  public async generateAddress(dest: Dest) {
    const isKeplrActive = await window.Keplr.getKeplr();
    if (isKeplrActive) {
      // @ts-ignore-check
      const config = {
        relayers: [bitcoinLcd],
        network: btcNetwork,
        dest
      } as any;

      const btcAddressToDeposit = (await generateDepositAddress(config)) as DepositSuccess;

      this.depositAddress = btcAddressToDeposit;
    }
  }
}
