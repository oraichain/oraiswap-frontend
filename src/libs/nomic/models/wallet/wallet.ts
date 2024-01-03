import { StdTx } from "@cosmjs/amino";
import { IbcChain } from "../ibc-chain";
import { config } from "../../config";
import { toUtf8 } from "@cosmjs/encoding";
import { BroadcastTxCommitResponse, Tendermint34Client } from "@cosmjs/tendermint-rpc";

export abstract class Wallet {
  address?: string;
  connected: boolean;
  name?: string;
  logo: string;
  queryableBalances: string[]

  abstract isPresent(): Promise<boolean>;
  abstract connect(): Promise<void>;
  abstract sign(data: string): Promise<void>;

  static async broadcast(tx: StdTx): Promise<BroadcastTxCommitResponse> {
    const tmClient = await Tendermint34Client.connect(config.rpcUrl);
    return tmClient.broadcastTxCommit({ tx: toUtf8(JSON.stringify(tx)) });
  }
}
