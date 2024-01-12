export interface DepositAddress {
  address: string;
  expiration: bigint;
}

export abstract class NomicClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);

  initialized: boolean;

  depositAddress: DepositAddress | null = null;

  init: () => Promise<void>;

  generateAddress: (destination?: string) => Promise<void>;

  setRecoveryAddress: (recovery_address: string) => Promise<void>;
}
