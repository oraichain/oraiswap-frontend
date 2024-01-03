import { Validator } from '../validator';
import { DepositAddress } from '../deposit-address';
import { IbcChain } from '../ibc-chain';
import { Wallet } from '../wallet/wallet';
import { UnbondingValidator } from '../unbonding-validator';
import { StakedValidator } from '../staked-validator';
import { Airdrop, Incentives } from '../reward';

export abstract class NomicClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);

  initialized: boolean;

  wallet?: Wallet = undefined;

  nomBalance: bigint | null;
  nbtcBalance: bigint | null;

  nomRewardBalance: bigint | null;
  nbtcRewardBalance: bigint | null;
  incomingIbcNbtcBalance: bigint;

  airdropBalances: Airdrop;
  incentiveBalances: Incentives | null = null;

  validators: Validator[];
  stakedValidators: StakedValidator[];
  unbondingValidators: UnbondingValidator[];
  totalStaked: bigint;

  depositAddress: DepositAddress | null = null;
  btcBlockHeight: number | null = null;
  latestCheckpointHash: string | null = null;
  valueLocked: bigint | null = null;

  init: () => Promise<void>;
  build: () => Promise<void>;

  getCurrentWallet: () => Promise<Wallet | null>;
  disconnectWallet: () => void;
  clearUserState: () => Promise<void>;

  claimStakingRewards: () => Promise<void>;

  claimAirdrop1: () => Promise<void>;
  claimAirdrop2: () => Promise<void>;
  claimTestnetParticipationIncentives: () => Promise<void>;
  // joinRewardAccounts: () => Promise<void>;

  updateValidators: () => Promise<void>;
  getValidator: (address: string) => Validator | StakedValidator | undefined;
  delegate: (validatorAddress: string, uNom: bigint) => Promise<void>;
  undelegate: (address: string, uNom: bigint) => Promise<void>;
  redelegate: (from: string, to: string, uNom: bigint) => Promise<void>;

  generateAddress: (destination?: string) => Promise<void>;
  withdrawBitcoin: (address: string, sats: bigint) => Promise<void>;
  getBtcBlockHeight: () => Promise<void>;
  getLatestCheckpointHash: () => Promise<void>;
  getValueLocked: () => Promise<void>;

  claimIncomingIbc: () => Promise<void>;
  ibcTransferOut: (
    amount: bigint,
    denom: string,
    destinationAddress: string,
    channelId: string,
    portId: string
  ) => Promise<void>;
  ibcTransferIn: (
    amount: bigint,
    destinationAddress: string,
    senderChain: IbcChain,
    bitcoinAddress?: string
  ) => Promise<void>;
  getChainBalance: (chainId: IbcChain) => Promise<bigint>;
  getRewardBalances: () => Promise<void>;
}
