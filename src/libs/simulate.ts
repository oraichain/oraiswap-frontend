import {
  CosmWasmClient,
  ExecuteResult,
  InstantiateOptions,
  InstantiateResult,
  JsonObject,
  UploadResult
} from '@cosmjs/cosmwasm-stargate';
import { CWSimulateApp, CWSimulateAppOptions, AppResponse } from '@terran-one/cw-simulate';
import { sha256 } from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import { Coin, StdFee } from '@cosmjs/stargate';

export class SimulateCosmWasmClient extends CosmWasmClient {
  private readonly app: CWSimulateApp;

  public constructor(option: CWSimulateAppOptions) {
    super(null);
    this.app = new CWSimulateApp(option);
  }

  public upload(senderAddress: string, wasmCode: Uint8Array): UploadResult {
    // import the wasm bytecode
    const originalChecksum = toHex(sha256(wasmCode));
    const codeId = this.app.wasm.create(senderAddress, wasmCode);
    return {
      originalSize: wasmCode.length,
      originalChecksum: toHex(sha256(wasmCode)),
      compressedSize: wasmCode.length,
      compressedChecksum: originalChecksum,
      codeId,
      logs: [],
      height: this.app.height,
      transactionHash: '',
      events: [],
      gasWanted: 0,
      gasUsed: 0
    };
  }

  public async instantiate(
    senderAddress: string,
    codeId: number,
    msg: JsonObject,
    label: string,
    _fee: StdFee | 'auto' | number,
    options?: InstantiateOptions
  ): Promise<InstantiateResult> {
    // instantiate the contract
    const result = await this.app.wasm.instantiateContract(
      senderAddress,
      (options?.funds as Coin[]) ?? [],
      codeId,
      msg,
      label
    );
    const response = result.val as AppResponse;
    // pull out the contract address
    const contractAddress = response.events[0].attributes[0].value;
    return {
      contractAddress,
      logs: [],
      height: this.app.height,
      transactionHash: '',
      events: response.events,
      gasWanted: 0,
      gasUsed: 0
    };
  }

  public async execute(
    senderAddress: string,
    contractAddress: string,
    msg: JsonObject,
    _fee: StdFee | 'auto' | number,
    _memo?: string,
    funds?: readonly Coin[]
  ): Promise<ExecuteResult> {
    const result = await this.app.wasm.executeContract(senderAddress, (funds as Coin[]) ?? [], contractAddress, msg);
    const response = result.val as AppResponse;
    return {
      logs: [],
      height: this.app.height,
      transactionHash: '',
      events: response.events,
      gasWanted: 0,
      gasUsed: 0
    };
  }

  public async queryContractSmart(contractAddress: string, queryMsg: JsonObject): Promise<JsonObject> {
    const result = this.app.wasm.query(contractAddress, queryMsg);
    return result.val;
  }
}
