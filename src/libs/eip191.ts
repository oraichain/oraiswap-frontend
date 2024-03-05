import { fromHex, toHex, toUtf8 } from '@cosmjs/encoding';
import { AccountData } from '@cosmjs/proto-signing';
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
  encodeSecp256k1Signature,
  serializeSignDoc
} from '@cosmjs/amino';
import { keccak256, ripemd160, sha256 } from '@cosmjs/crypto';
import * as secp256k1 from '@noble/secp256k1';
import bech32 from 'bech32';

export function pubkeyToBechAddress(pubkey: Uint8Array, prefix: string = 'orai'): string {
  return bech32.encode(prefix, bech32.toWords(ripemd160(sha256(pubkey))));
}

export function getPubkeyFromEthSignatures(rawMsg: Uint8Array, sigResult: string) {
  // On ETHland pubkeys are recovered from signatures, so we're going to:
  // 1. sign something
  // 2. recover the pubkey from the signature
  // 3. derive a secret address from the the pubkey

  // strip leading 0x and extract recovery id
  const sig = fromHex(sigResult.slice(2, -2));
  let recoveryId = parseInt(sigResult.slice(-2), 16) - 27;

  // When a Ledger is used, this value doesn't need to be adjusted
  if (recoveryId < 0) {
    recoveryId += 27;
  }

  const eip191MessagePrefix = toUtf8('\x19Ethereum Signed Message:\n');
  const rawMsgLength = toUtf8(String(rawMsg.length));

  const publicKey = secp256k1.recoverPublicKey(
    keccak256(new Uint8Array([...eip191MessagePrefix, ...rawMsgLength, ...rawMsg])),
    sig,
    recoveryId,
    true
  );

  return publicKey;
}

export interface IEthProvider {
  request: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
}

const GET_COSMOS_ADDRESS_MESSAGE = 'Get cosmos address';

type CosmosToEvm = {
  [key: string]: string;
};

export class MetamaskOfflineSigner implements OfflineAminoSigner {
  cosmosToEvm: CosmosToEvm = {};
  accounts: AccountData[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructor(
    public readonly ethProvider: IEthProvider,
    public readonly ethAddress: string,
    public readonly prefix: string = 'cosmos'
  ) {}

  public static async connect(ethProvider: IEthProvider, prefix: string = 'orai'): Promise<MetamaskOfflineSigner> {
    // all address in the metamask
    let accounts = await window.ethereum.request({
      method: 'eth_accounts',
      params: [60]
    });

    if (accounts.length === 0) {
      accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: []
      });
    }
    // always get the first address
    return new MetamaskOfflineSigner(ethProvider, accounts[0], prefix);
  }

  async getAccounts(): Promise<readonly AccountData[]> {
    if (this.accounts.length < 1) {
      const pubKey = await this.getPubkeyFromEthSignature();
      const address = pubkeyToBechAddress(pubKey, this.prefix);
      this.cosmosToEvm[address] = this.ethAddress;
      this.accounts = [
        {
          address,
          algo: 'secp256k1',
          pubkey: pubKey
        }
      ];
    }
    return this.accounts;
  }

  async signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
    const ethAddress = this.cosmosToEvm[signerAddress];
    return this.signEip191(ethAddress, signDoc);
  }

  async signEip191(ethAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
    const rawMsg = serializeSignDoc(signDoc);
    const msgToSign = `0x${toHex(rawMsg)}`;
    const sigResult = (await this.ethProvider.request({
      method: 'personal_sign',
      params: [msgToSign, ethAddress]
    })) as string;

    // strip leading 0x and trailing recovery id
    const sig = fromHex(sigResult.slice(2, -2));
    const pubkey = getPubkeyFromEthSignatures(rawMsg, sigResult);

    return {
      signed: signDoc,
      signature: encodeSecp256k1Signature(pubkey, sig)
    };
  }

  private async getPubkeyFromEthSignature(): Promise<Uint8Array> {
    if (!this.ethProvider) {
      throw new Error('No ethProvider');
    }
    const rawMsg = toUtf8(GET_COSMOS_ADDRESS_MESSAGE);
    const msgToSign = `0x${toHex(rawMsg)}`;
    const sigResult = (await this.ethProvider.request({
      method: 'personal_sign',
      params: [msgToSign, this.ethAddress]
    })) as string;
    return getPubkeyFromEthSignatures(rawMsg, sigResult);
  }
}
