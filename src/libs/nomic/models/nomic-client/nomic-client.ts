import init, { OraiBtc, DepositAddress } from '@oraichain/oraibtc-wasm';
import Long from 'long';
import { Validator, getAllValidators } from '../validator';
import { Delegation, getDelegations } from '../delegation';
// import { makeAutoObservable } from 'mobx';
import { config } from '../../config';
import { SigningStargateClient, GasPrice, MsgTransferEncodeObject } from '@cosmjs/stargate';
import { IbcChain, OraichainChain, OraiBtcSubnetChain, OBTCContractAddress } from '../ibc-chain';
import { Decimal } from '@cosmjs/math';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { Wallet } from '../wallet/wallet';
import { Keplr } from '../wallet/keplr';
// import { Metamask } from '../wallet/metamask';
import { UnbondingValidator } from '../unbonding-validator';
import { StakedValidator } from '../staked-validator';
import { NomicClientInterface } from './nomic-client-interface';
import { Airdrop, Incentives } from '../reward';
import { makeStdTx } from '@cosmjs/amino';
import { EthSignType } from '@keplr-wallet/types';
// import { fromRpcSig } from '@ethereumjs/util';
import { EvmosAirdropState } from '../../models/evmos-airdrop-state';
import { SigningCosmWasmClient, toBinary } from '@cosmjs/cosmwasm-stargate';

export class NomicClient implements NomicClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);

  initialized = false;
  private nomic: OraiBtc;
  public nomBalance: bigint | null = null;
  public nbtcBalance: bigint | null = null;
  public nomRewardBalance: bigint | null = null;
  public nbtcRewardBalance: bigint | null = null;
  public incomingIbcNbtcBalance: bigint | null = null;
  public airdropBalances: Airdrop | null = null;
  public incentiveBalances: Incentives | null = null;
  public validators: Validator[] = [];
  private delegations: Delegation[] = [];
  public depositAddress: DepositAddress | null = null;
  public btcBlockHeight: number | null = null;
  public latestCheckpointHash: string | null = null;
  public valueLocked: bigint | null = null;

  public wallet?: Wallet = undefined;

  constructor() {
    // makeAutoObservable(this);
  }

  async getCurrentWallet(): Promise<Wallet | null> {
    // const currentWallet = localStorage.getItem('nomic/wallet');

    // if (currentWallet === 'keplr') {
    const wallet = new Keplr();
    return wallet;
    // }

    // else if (currentWallet === 'metamask') {
    //   const wallet = new Metamask();
    //   if (!wallet.connected) {
    //     await wallet.connect();
    //   }
    //   wallet.address = this.nomic.convertEthAddress(wallet.ethAddress);
    //   return wallet;
    // }
  }

  disconnectWallet() {
    localStorage.setItem('nomic/wallet', null);
    this.wallet = null;
    this.clearUserState();
  }

  async clearUserState() {
    this.nomBalance = null;
    this.nbtcBalance = null;
    this.airdropBalances = null;
    this.nomRewardBalance = null;
    this.nbtcRewardBalance = null;
    this.incomingIbcNbtcBalance = null;
    this.depositAddress = null;
    await this.getNoLogValidators();
  }

  public get unbondingValidators(): UnbondingValidator[] {
    return this.delegations.reduce((unbondingValidators, delegation) => {
      const validator = this.validators.find((validator) => validator.address === delegation.address);
      if (delegation.unbonding.length > 0) {
        unbondingValidators.push({
          ...validator,
          unbondInfo: delegation.unbonding
        });
      }
      return unbondingValidators;
    }, []);
  }

  public get stakedValidators(): StakedValidator[] | null {
    if (!this.delegations) return null;
    return this.delegations.reduce((stakedValidators, delegation) => {
      const validator = this.validators.find((validator) => validator.address === delegation.address);
      const pendingNomRewards = delegation.liquid.find((coin) => coin.denom === 69)?.amount || null;
      const pendingNbtcRewards = delegation.liquid.find((coin) => coin.denom === 21)?.amount || null;
      const stakedVal = {
        ...validator,
        pendingNbtcRewards,
        pendingNomRewards,
        amountStaked: delegation.staked
      };
      stakedValidators.push(stakedVal);
      return stakedValidators;
    }, []);
  }

  public get totalStaked() {
    if (this.stakedValidators.length <= 0) return 0n;
    return this.stakedValidators.reduce((acc, v) => acc + v.amountStaked, 0n);
  }

  public async build() {
    const address = this.wallet.address;
    this.validators = await getAllValidators(this.nomic);
    this.delegations = await getDelegations(this.nomic, address);

    this.nomBalance = await this.nomic.balance(address);
    this.nomRewardBalance = await this.nomic.nomRewardBalance(address);
    this.nbtcRewardBalance = await this.nomic.nbtcRewardBalance(address);
    this.incomingIbcNbtcBalance = await this.nomic.incomingIbcNbtcBalance(address);
    this.nbtcBalance = await this.nomic.nbtcBalance(address);

    this.getRewardBalances();
    this.getBtcBlockHeight();
    this.getLatestCheckpointHash();
    this.getValueLocked();
    this.refreshNonce();
  }

  private async getValidators(): Promise<void> {
    await Promise.all([this.updateValidators(), this.updateDelegations()]);
  }

  public async updateValidators() {
    this.validators = await getAllValidators(this.nomic);
  }

  private async updateDelegations() {
    if (this.wallet.address) {
      this.delegations = await getDelegations(this.nomic, this.wallet.address);
    }
  }

  private async getBalance(): Promise<bigint | null> {
    if (!this.wallet) {
      return Promise.resolve(null);
    }
    this.nomBalance = await this.nomic.balance(this.wallet.address);
    return this.nomBalance;
  }

  private async getNbtcBalance(): Promise<bigint | null> {
    if (!this.wallet) {
      return Promise.resolve(null);
    }

    this.nbtcBalance = await this.nomic.nbtcBalance(this.wallet.address);
    return this.nbtcBalance;
  }

  private async getNomRewardBalance() {
    if (!this.wallet) {
      return Promise.resolve(null);
    }
    this.nomRewardBalance = await this.nomic.nomRewardBalance(this.wallet.address);
    return this.nomRewardBalance;
  }

  private async getNbtcRewardBalance() {
    this.nbtcRewardBalance = await this.nomic.nbtcRewardBalance(this.wallet.address);
    return this.nbtcRewardBalance;
  }

  private async getIncomingIbcNbtcBalance() {
    this.incomingIbcNbtcBalance = await this.nomic.incomingIbcNbtcBalance(this.wallet.address);
    return this.incomingIbcNbtcBalance;
  }

  public async getRewardBalances() {
    this.airdropBalances = await this.nomic.airdropBalances(this.wallet.address);
    this.incentiveBalances = await this.nomic.incentiveBalances(this.wallet.address);
  }

  async getNoLogValidators() {
    return;
  }

  public async refreshNonce() {
    const nonce = await this.nomic.nonce(this.wallet.address);

    window.localStorage.setItem('orga/nonce', (nonce.valueOf() + 1n).toString());
  }

  public async claimStakingRewards() {
    const data = await this.nomic.claim(this.wallet.address);
    await this.wallet.sign(data);
    await Promise.all([
      this.getBalance(),
      this.getNbtcBalance(),
      this.getNomRewardBalance(),
      this.getNbtcRewardBalance(),
      this.getValidators()
    ]);
  }

  public async claimAirdrop1() {
    const data = await this.nomic.claimAirdrop1(this.wallet.address);
    await this.wallet.sign(data);
    await Promise.all([
      this.getBalance(),
      this.getNbtcBalance(),
      this.getNomRewardBalance(),
      this.getNbtcRewardBalance(),
      this.getRewardBalances()
    ]);
  }

  public async claimAirdrop2() {
    const data = await this.nomic.claimAirdrop2(this.wallet.address);
    await this.wallet.sign(data);
    await Promise.all([
      this.getBalance(),
      this.getNbtcBalance(),
      this.getNomRewardBalance(),
      this.getNbtcRewardBalance(),
      this.getRewardBalances()
    ]);
  }

  public async claimTestnetParticipationIncentives() {
    const data = await this.nomic.claimTestnetParticipationIncentives(this.wallet.address);
    await this.wallet.sign(data);
    await Promise.all([this.getBalance()]);
  }

  // public async joinRewardAccounts() {
  //   if (!this.wallet) {
  //     throw new Error('Cannot join airdrop accounts without wallet connected');
  //   }
  //   if (!(this.wallet instanceof Keplr)) {
  //     throw new Error('Joining airdrop not supported through Metamask');
  //   }
  //   const evmosKey = await window.keplr.getKey(OraichainChain.chainId);

  //   const evmosKeyData = fromBech32(evmosKey.bech32Address).data;
  //   const evmosNomicAddress = toBech32('oraibtc', evmosKeyData);
  //   const evmosAirdropBalance = await this.nomic.airdropBalances(evmosNomicAddress);
  //   const evmosIncentiveBalances = await this.nomic.incentiveBalances(evmosNomicAddress);
  //   const evmosAirdropClaimedState = localStorage.getItem('nomic/evmosAirdropClaimAttempted/' + this.wallet.address);

  //   // this local storage key will need to change for both testnet and mainnet
  //   const balanceEligible = evmosAirdropBalance.total() > 0n || evmosIncentiveBalances.total() > 0n;
  //   if (!balanceEligible && evmosAirdropClaimedState !== EvmosAirdropState.MOVED) {
  //     localStorage.setItem('nomic/evmosAirdropClaimAttempted/' + this.wallet.address, EvmosAirdropState.INELIGIBLE);
  //     return;
  //   }

  //   const data = await this.nomic.joinRewardAccounts(evmosNomicAddress, this.wallet.address);

  //   const sig = await window.keplr.signEthereum(OraichainChain.chainId, evmosKey.bech32Address, data, EthSignType.MESSAGE);
  //   const ecdSig = fromRpcSig('0x' + Buffer.from(sig).toString('hex'));

  //   const tx = makeStdTx(JSON.parse(data), {
  //     pub_key: {
  //       type: 'tendermint/PubKeySecp256k1',
  //       value: Buffer.from(evmosKey.pubKey).toString('base64')
  //     },
  //     signature: Buffer.concat([ecdSig.r, ecdSig.s]).toString('base64')
  //   });

  //   tx.signatures[0]['type'] = 'eth';
  //   const res = await Wallet.broadcast(tx);

  //   if (res.checkTx.code !== 0) {
  //     throw new Error('Failed to connect Evmos account. Try again later.');
  //   }

  //   localStorage.setItem('nomic/evmosAirdropClaimAttempted/' + this.wallet.address, EvmosAirdropState.MOVED);
  // }

  public async claimIncomingIbc() {
    const data = await this.nomic.claimIncomingIbcBtc(this.wallet.address);
    await this.wallet.sign(data);
    await Promise.all([this.getNbtcBalance(), this.getIncomingIbcNbtcBalance()]);
  }

  public async delegate(validatorAddress: string, uNom: bigint) {
    const data = await this.nomic.delegate(this.wallet.address, validatorAddress, uNom);
    await this.wallet.sign(data);

    await Promise.all([this.getBalance(), this.getValidators()]);
  }

  public async undelegate(address: string, uNom: bigint) {
    const data = await this.nomic.unbond(this.wallet.address, address, uNom);
    await this.wallet.sign(data);
    await Promise.all([this.getBalance(), this.getValidators()]);
  }

  public async redelegate(from: string, to: string, uNom: bigint) {
    const data = await this.nomic.redelegate(this.wallet.address, from, to, uNom);
    await this.wallet.sign(data);
    await Promise.all([this.getBalance(), this.getValidators()]);
  }

  public async ibcTransferOut(
    amount: bigint,
    denom: string,
    destinationAddress: string,
    channelId: string,
    portId: string
  ): Promise<void> {
    const timeout_timestamp = Date.now() + 60 * 60 * 1000;
    const data = await this.nomic.ibcTransferOut(
      amount,
      channelId,
      portId,
      denom,
      this.wallet.address,
      destinationAddress,
      BigInt(timeout_timestamp * 1e6).toString()
    );
    await this.wallet.sign(data);
    await Promise.all([this.getNbtcBalance()]);
  }

  public async ibcTransferIn(
    amount: bigint,
    destinationAddress: string,
    senderChain: IbcChain,
    bitcoinAddress: string | undefined
  ) {
    await window.keplr.enable(senderChain.chainId);

    const offlineSigner = window.keplr.getOfflineSigner(senderChain.chainId);

    const cosmJs = await SigningCosmWasmClient.connectWithSigner(senderChain.rpcEndpoint, offlineSigner, {
      gasPrice: new GasPrice(Decimal.fromUserInput((2500).toString(), 6), 'orai') as any
    });

    const chainInfo = await window.keplr.getKey(senderChain.chainId);
    const sourceAddr = chainInfo.bech32Address;

    // const timeoutTimestampSeconds = Math.floor(
    //   (Date.now() + 60 * 60 * 1000) / 1000
    // );
    // const timeoutTimestampNanoseconds = Long.fromNumber(
    //   timeoutTimestampSeconds
    // ).multiply(1000000000);

    const DEFAULT_TIMEOUT = 60 * 60;

    cosmJs.execute(
      sourceAddr,
      OBTCContractAddress,
      {
        send: {
          contract: senderChain.source.port.split('.')[1],
          amount: Decimal.fromAtomics(amount.toString(), 8).toString(),
          msg: toBinary({
            local_channel_id: senderChain.source.channelId,
            remote_address: destinationAddress,
            remote_denom: senderChain.source.nBtcIbcDenom,
            timeout: DEFAULT_TIMEOUT,
            memo: bitcoinAddress && bitcoinAddress.length > 0 ? `withdraw:${bitcoinAddress}` : ''
          })
        }
      },
      'auto'
    );

    // const transferMsg = {
    //   typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    //   value: {
    //     sourcePort: senderChain.source.port,
    //     sourceChannel: senderChain.source.channelId,
    //     sender: sourceAddr,
    //     receiver: destinationAddress,
    //     token: {
    //       amount: amount.toString(),
    //       denom: senderChain.source.nBtcIbcDenom
    //     },
    //     timeoutTimestamp: timeoutTimestampNanoseconds,
    //     memo: 'memo'
    //   }
    // } as MsgTransferEncodeObject;

    // await cosmJS.signAndBroadcast(sourceAddr, [transferMsg], 212);
  }

  async getChainBalance(chain: IbcChain) {
    if (chain === OraiBtcSubnetChain) {
      return this.nbtcBalance;
    }
    if (!(this.wallet instanceof Keplr)) {
      return 0n;
    }
    try {
      const cosmJS = await this.wallet.provideSigner(chain);
      const chainInfo = await window.keplr.getKey(chain.chainId);
      const sourceAddr = chainInfo.bech32Address;

      const { balance } = await cosmJS.queryContractSmart(OBTCContractAddress, {
        balance: {
          address: sourceAddr
        }
      });

      return BigInt(Decimal.fromUserInput(balance, 8).atomics.toString());
    } catch (e) {
      return 0n;
    }
  }
  public async refreshState() {
    await Promise.all([
      this.getValidators(),
      this.getBalance(),
      this.getNomRewardBalance(),
      this.getNbtcRewardBalance(),
      this.getRewardBalances(),
      this.getNbtcBalance()
    ]);
  }

  public async generateAddress(destination?: string) {
    if (!this.wallet?.address) {
      return;
    }

    const btcAddress = await this.nomic.generateDepositAddress(this.wallet.address);

    await this.nomic.broadcastDepositAddress(
      this.wallet.address,
      btcAddress.sigsetIndex,
      [config.relayerUrl],
      btcAddress.address
    ); // (make sure this succeeds before showing the btc address to the user)

    if (destination) {
      const [channel, receiver] = destination.split('/', 2);
      try {
        fromBech32(receiver);
        this.depositAddress = await this.nomic.generateDepositAddress(receiver, channel, this.wallet.address);
      } catch {}
    }

    if (!this.depositAddress) this.depositAddress = btcAddress;
  }

  public async withdrawBitcoin(address: string, sats: bigint) {
    const data = await this.nomic.withdraw(this.wallet.address, address, sats);
    await this.wallet.sign(data);
  }

  public getValidator(address: string): Validator | StakedValidator | undefined {
    const validator = this.validators.find((validator) => validator.address === address);
    const stakedValidator = this.stakedValidators.find((validator) => validator.address === address);
    return stakedValidator ? stakedValidator : validator;
  }

  public async getBtcBlockHeight() {
    this.btcBlockHeight = await this.nomic.bitcoinHeight();
  }

  public async getLatestCheckpointHash() {
    this.latestCheckpointHash = await this.nomic.latestCheckpointHash();
  }

  public async getValueLocked() {
    this.valueLocked = (await this.nomic.valueLocked()) * BigInt(1e6);
  }

  public async init() {
    if (!this.initialized) {
      await init();
      this.nomic = new OraiBtc(config.restUrl, config.chainId, 'testnet');
      this.initialized = true;
    }
  }
}
