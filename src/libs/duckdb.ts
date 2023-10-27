import * as duckdb from '@duckdb/duckdb-wasm';
import { get, set } from 'idb-keyval';
//@ts-ignore
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm';
//@ts-ignore
import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm';
const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js', import.meta.url).toString()
  },
  eh: {
    mainModule: duckdb_wasm_next,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js', import.meta.url).toString()
  }
};

export type TransactionHistory = {
  initialTxHash: string;
  fromCoingeckoId: string;
  toCoingeckoId: string;
  fromChainId: string;
  toChainId: string;
  fromAmount: string;
  toAmount: string;
  fromAmountInUsdt: string;
  toAmountInUsdt: string;
  status: string;
  type: 'Swap' | 'Bridge' | 'Universal Swap';
  timestamp: number;
  userAddress: string;
};

const compress = async (buf: Uint8Array) => {
  try {
    return new Uint8Array(
      await new Response(new Blob([buf]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer()
    );
  } catch {
    return buf;
  }
};

const decompress = async (buf: Uint8Array) => {
  try {
    return new Uint8Array(
      await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()
    );
  } catch {
    return buf;
  }
};

export class DuckDb {
  static instance: DuckDb;

  protected constructor(public readonly conn: duckdb.AsyncDuckDBConnection, public readonly db: duckdb.AsyncDuckDB) {}

  static async create() {
    // Select a bundle based on browser checks
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    // Instantiate the asynchronus version of DuckDB-Wasm
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    const conn = await db.connect();
    DuckDb.instance = new DuckDb(conn, db);
  }

  async createTableTransHistory(userAddress: string): Promise<boolean> {
    // Import Parquet
    /**
     * @type {Uint8Array} buf
     */
    const buf = await get(`trans_history_${userAddress}`);
    if (buf) {
      await this.db.registerFileBuffer(`trans_history_${userAddress}.parquet`, await decompress(buf));
      this.conn.send(`create table trans_history as select * from 'trans_history_${userAddress}.parquet'`);
    } else {
      this.conn.send(`create table trans_history
      (
        initialTxHash varchar primary key, 
        fromCoingeckoId varchar, 
        toCoingeckoId varchar, 
        fromChainId varchar, 
        toChainId varchar, 
        fromAmount varchar, 
        toAmount varchar, 
        fromAmountInUsdt varchar,
        toAmountInUsdt varchar,
        status varchar,
        type varchar,
        timestamp ubigint,
        userAddress varchar
      )
      `);
    }
    return Boolean(buf);
  }

  async save(userAddress: string) {
    // Export Parquet
    await this.conn.send(`copy (select * from trans_history) to 'trans_history_${userAddress}.parquet'`);
    const buf = await compress(await this.conn.bindings.copyFileToBuffer(`trans_history_${userAddress}.parquet`));
    await set(`trans_history_${userAddress}`, buf);
  }

  async addTransHistory(transHistory: TransactionHistory) {
    await this.conn.send(
      `insert into trans_history
        (initialTxHash,fromCoingeckoId,toCoingeckoId,fromChainId,toChainId,fromAmount,toAmount,fromAmountInUsdt,toAmountInUsdt,status,type,timestamp,userAddress) 
        values
        (
          '${transHistory.initialTxHash}',
          '${transHistory.fromCoingeckoId}', 
          '${transHistory.toCoingeckoId}',
          '${transHistory.fromChainId}',
          '${transHistory.toChainId}',
          '${transHistory.fromAmount}',
          '${transHistory.toAmount}',
          '${transHistory.fromAmountInUsdt}',
          '${transHistory.toAmountInUsdt}',
          '${transHistory.status}',
          '${transHistory.type}',
          ${transHistory.timestamp},
          '${transHistory.userAddress}',
        )
      `
    );
    console.log({ transHistory });
    await this.save(transHistory.userAddress);
  }

  async getTransHistory(userAddress: string): Promise<TransactionHistory[]> {
    if (!userAddress) return [];

    const isTableExist = await this.createTableTransHistory(userAddress);
    if (!isTableExist) return [];

    // get data from parquet
    await this.conn.send(`copy (select * from trans_history_${userAddress}.parquet) to 'trans_history'`);

    // TODO: need to update limit later for pagination
    const DEFAULT_LIMIT = 20;
    const histories = await this.conn.query(
      `SELECT * FROM trans_history ORDER BY timestamp DESC LIMIT ${DEFAULT_LIMIT}`
    );
    return histories.toArray();
  }
}
