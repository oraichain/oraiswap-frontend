import utils from './utils';

export default class TronWeb {
  static providers: any;
  static BigNumber: typeof BigNumber;
  static TransactionBuilder: any;
  static Trx: any;
  static Contract: any;
  static Plugin: any;
  static Event: any;
  static version: any;
  static utils: typeof utils;
  static get address(): {
    fromHex(address: any): any;
    toHex(address: any): any;
    fromPrivateKey(privateKey: any, strict?: boolean): any;
  };
  static sha3(string: any, prefix?: boolean): string;
  static toHex(val: any): any;
  static toUtf8(hex: any): string;
  static fromUtf8(string: any): string;
  static toAscii(hex: any): string;
  static fromAscii(string: any, padding: any): string;
  static toDecimal(value: any): any;
  static fromDecimal(value: any): string;
  static fromSun(sun: any): any;
  static toSun(trx: any): any;
  static toBigNumber(amount?: number): number | BigNumber;
  static isAddress(address?: boolean): any;
  static createAccount(): Promise<any>;
  static createRandom(options: any): any;
  static fromMnemonic(mnemonic: any, path?: any, wordlist?: string): any;
  constructor(
    options?: boolean,
    solidityNode?: boolean,
    eventServer?: boolean,
    sideOptions?: boolean,
    privateKey?: boolean
  );
  event: any;
  transactionBuilder: any;
  trx: any;
  plugin: any;
  utils: any;
  providers: any;
  BigNumber: typeof BigNumber;
  defaultBlock: boolean;
  defaultPrivateKey: boolean;
  defaultAddress: {
    hex: boolean;
    base58: boolean;
  };
  sidechain: any;
  fullnodeVersion: string;
  feeLimit: number;
  injectPromise: any;
  getFullnodeVersion(): Promise<void>;
  setDefaultBlock(blockID?: boolean): boolean;
  setPrivateKey(privateKey: any): void;
  setAddress(address: any): void;
  fullnodeSatisfies(version: any): any;
  isValidProvider(provider: any): boolean;
  setFullNode(fullNode: any): void;
  fullNode: any;
  setSolidityNode(solidityNode: any): void;
  solidityNode: any;
  setEventServer(...params: any[]): void;
  setHeader(headers?: {}): void;
  setFullNodeHeader(headers?: {}): void;
  setEventHeader(headers?: {}): void;
  currentProviders(): {
    fullNode: any;
    solidityNode: any;
    eventServer: any;
  };
  currentProvider(): {
    fullNode: any;
    solidityNode: any;
    eventServer: any;
  };
  getEventResult(...params: any[]): any;
  getEventByTransactionID(...params: any[]): any;
  contract(abi?: any[], address?: boolean): any;
  isConnected(callback?: boolean): Promise<any>;
}
import BigNumber from 'bignumber.js';
