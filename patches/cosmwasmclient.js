'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CosmWasmClient = void 0;
const crypto_1 = require('@cosmjs/crypto');
const encoding_1 = require('@cosmjs/encoding');
const launchpad_1 = require('@cosmjs/launchpad');
const math_1 = require('@cosmjs/math');
const wasm_1 = require('./lcdapi/wasm');
function isSearchByHeightQuery(query) {
  return query.height !== undefined;
}
function isSearchBySentFromOrToQuery(query) {
  return query.sentFromOrTo !== undefined;
}
function isSearchByTagsQuery(query) {
  return query.tags !== undefined;
}
class CosmWasmClient {
  /**
   * Creates a new client to interact with a CosmWasm blockchain.
   *
   * This instance does a lot of caching. In order to benefit from that you should try to use one instance
   * for the lifetime of your application. When switching backends, a new instance must be created.
   *
   * @param apiUrl The URL of a Cosmos SDK light client daemon API (sometimes called REST server or REST API)
   * @param broadcastMode Defines at which point of the transaction processing the broadcastTx method returns
   */
  constructor(apiUrl, broadcastMode = launchpad_1.BroadcastMode.Block) {
    this.codesCache = new Map();
    this.lcdClient = launchpad_1.LcdClient.withExtensions(
      { apiUrl: apiUrl, broadcastMode: broadcastMode },
      launchpad_1.setupAuthExtension,
      wasm_1.setupWasmExtension
    );
  }
  async getChainId() {
    if (!this.chainId) {
      const response = await this.lcdClient.nodeInfo();
      const chainId = response.node_info.network;
      if (!chainId) throw new Error('Chain ID must not be empty');
      this.chainId = chainId;
    }
    return this.chainId;
  }
  async getHeight() {
    if (this.anyValidAddress) {
      const { height } = await this.lcdClient.auth.account(
        this.anyValidAddress
      );
      return parseInt(height, 10);
    } else {
      // Note: this gets inefficient when blocks contain a lot of transactions since it
      // requires downloading and deserializing all transactions in the block.
      const latest = await this.lcdClient.blocksLatest();
      return parseInt(latest.block.header.height, 10);
    }
  }
  /**
   * Returns a 32 byte upper-case hex transaction hash (typically used as the transaction ID)
   */
  async getIdentifier(tx) {
    // We consult the REST API because we don't have a local amino encoder
    const response = await this.lcdClient.encodeTx(tx);
    const hash = crypto_1.sha256(encoding_1.fromBase64(response.tx));
    return encoding_1.toHex(hash).toUpperCase();
  }
  /**
   * Returns account number and sequence.
   *
   * Throws if the account does not exist on chain.
   *
   * @param address returns data for this address. When unset, the client's sender adddress is used.
   */
  async getSequence(address) {
    const account = await this.getAccount(address);
    if (!account) {
      throw new Error(
        'Account does not exist on chain. Send some tokens there before trying to query sequence.'
      );
    }
    return {
      accountNumber: account.accountNumber,
      sequence: account.sequence
    };
  }
  async getAccount(address) {
    const {
      result: { value }
    } = await this.lcdClient.get(`auth/accounts/${address}`);
    if (value.address === '') {
      return undefined;
    } else {
      this.anyValidAddress = value.address;
      return {
        address: value.address,
        balance: value.coins,
        pubkey: launchpad_1.normalizePubkey(value.public_key) || undefined,
        accountNumber: launchpad_1.uint64ToNumber(value.account_number || 0),
        sequence: launchpad_1.uint64ToNumber(value.sequence || 0)
      };
    }
  }
  /**
   * Gets block header and meta
   *
   * @param height The height of the block. If undefined, the latest height is used.
   */
  async getBlock(height) {
    const response =
      height !== undefined
        ? await this.lcdClient.blocks(height)
        : await this.lcdClient.blocksLatest();
    return {
      id: response.block_id.hash,
      header: {
        version: response.block.header.version,
        time: response.block.header.time,
        height: parseInt(response.block.header.height, 10),
        chainId: response.block.header.chain_id
      },
      txs: (response.block.data.txs || []).map(encoding_1.fromBase64)
    };
  }
  async getTx(id) {
    var _a;
    const results = await this.txsQuery(`tx.hash=${id}`);
    return (_a = results[0]) !== null && _a !== void 0 ? _a : null;
  }
  async searchTx(query, filter = {}) {
    const minHeight = filter.minHeight || 0;
    const maxHeight = filter.maxHeight || Number.MAX_SAFE_INTEGER;
    if (maxHeight < minHeight) return []; // optional optimization
    function withFilters(originalQuery) {
      return `${originalQuery}&tx.minheight=${minHeight}&tx.maxheight=${maxHeight}`;
    }
    let txs;
    if (isSearchByHeightQuery(query)) {
      // optional optimization to avoid network request
      if (query.height < minHeight || query.height > maxHeight) {
        txs = [];
      } else {
        txs = await this.txsQuery(`tx.height=${query.height}`);
      }
    } else if (isSearchBySentFromOrToQuery(query)) {
      // We cannot get both in one request (see https://github.com/cosmos/gaia/issues/75)
      const sentQuery = withFilters(
        `message.module=bank&message.sender=${query.sentFromOrTo}`
      );
      const receivedQuery = withFilters(
        `message.module=bank&transfer.recipient=${query.sentFromOrTo}`
      );
      const [sent, received] = await Promise.all([
        this.txsQuery(sentQuery),
        this.txsQuery(receivedQuery)
      ]);
      let mergedTxs = [];
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      // sent/received are presorted
      while (sent.length && received.length) {
        const next =
          sent[0].hash === received[0].hash
            ? sent.shift() && received.shift()
            : sent[0].height <= received[0].height
              ? sent.shift()
              : received.shift();
        mergedTxs = [...mergedTxs, next];
      }
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
      // At least one of sent/received is empty by now
      txs = [...mergedTxs, ...sent, ...received];
    } else if (isSearchByTagsQuery(query)) {
      const rawQuery = withFilters(
        query.tags.map((t) => `${t.key}=${t.value}`).join('&')
      );
      txs = await this.txsQuery(rawQuery);
    } else {
      throw new Error('Unknown query type');
    }
    // backend sometimes messes up with min/max height filtering
    const filtered = txs.filter(
      (tx) => tx.height >= minHeight && tx.height <= maxHeight
    );
    return filtered;
  }
  async broadcastTx(tx) {
    const result = await this.lcdClient.broadcastTx(tx);
    if (!result.txhash.match(/^([0-9A-F][0-9A-F])+$/)) {
      throw new Error(
        'Received ill-formatted txhash. Must be non-empty upper-case hex'
      );
    }
    return result.code !== undefined
      ? {
        height: math_1.Uint53.fromString(result.height).toNumber(),
        transactionHash: result.txhash,
        code: result.code,
        rawLog: result.raw_log || ''
      }
      : {
        logs: result.logs || [],
        rawLog: result.raw_log || '',
        transactionHash: result.txhash,
        data: result.data ? encoding_1.fromHex(result.data) : undefined
      };
  }
  async getCodes() {
    const result = await this.lcdClient.wasm.listCodeInfo();
    return result.map((entry) => {
      this.anyValidAddress = entry.creator;
      return {
        id: entry.id,
        creator: entry.creator,
        checksum: encoding_1.toHex(encoding_1.fromHex(entry.data_hash)),
        source: entry.source || undefined,
        builder: entry.builder || undefined
      };
    });
  }
  async getCodeDetails(codeId) {
    const cached = this.codesCache.get(codeId);
    if (cached) return cached;
    const getCodeResult = await this.lcdClient.wasm.getCode(codeId);
    const codeDetails = {
      id: getCodeResult.id,
      creator: getCodeResult.creator,
      checksum: encoding_1.toHex(encoding_1.fromHex(getCodeResult.data_hash)),
      source: getCodeResult.source || undefined,
      builder: getCodeResult.builder || undefined,
      data: encoding_1.fromBase64(getCodeResult.data)
    };
    this.codesCache.set(codeId, codeDetails);
    return codeDetails;
  }
  async getContracts(codeId) {
    const result = await this.lcdClient.wasm.listContractsByCodeId(codeId);
    return result.map((entry) => ({
      address: entry.address,
      codeId: entry.code_id,
      creator: entry.creator,
      admin: entry.admin,
      label: entry.label
    }));
  }
  /**
   * Throws an error if no contract was found at the address
   */
  async getContract(address) {
    const result = await this.lcdClient.wasm.getContractInfo(address);
    if (!result) throw new Error(`No contract found at address "${address}"`);
    return {
      address: result.address,
      codeId: result.code_id,
      creator: result.creator,
      admin: result.admin,
      label: result.label
    };
  }
  /**
   * Throws an error if no contract was found at the address
   */
  async getContractCodeHistory(address) {
    const result = await this.lcdClient.wasm.getContractCodeHistory(address);
    if (!result)
      throw new Error(`No contract history found for address "${address}"`);
    return result.map((entry) => ({
      operation: entry.operation,
      codeId: entry.code_id,
      msg: entry.msg
    }));
  }
  /**
   * Returns the data at the key if present (raw contract dependent storage data)
   * or null if no data at this key.
   *
   * Promise is rejected when contract does not exist.
   */
  async queryContractRaw(address, key) {
    // just test contract existence
    const _info = await this.getContract(address);
    return this.lcdClient.wasm.queryContractRaw(address, key);
  }
  /**
   * Makes a smart query on the contract, returns the parsed JSON document.
   *
   * Promise is rejected when contract does not exist.
   * Promise is rejected for invalid query format.
   * Promise is rejected for invalid response format.
   */
  async queryContractSmart(address, queryMsg) {
    try {
      return await this.lcdClient.wasm.queryContractSmart(address, queryMsg);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith('not found: contract')) {
          throw new Error(`No contract found at address "${address}"`);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
  async txsQuery(query) {
    // TODO: we need proper pagination support
    const limit = 100;
    const result = await this.lcdClient.txsQuery(`${query}&limit=${limit}`);
    const pages = parseInt(result.page_total, 10);
    if (pages > 1) {
      throw new Error(
        `Found more results on the backend than we can process currently. Results: ${result.total_count}, supported: ${limit}`
      );
    }
    return result.txs.map((restItem) => ({
      height: parseInt(restItem.height, 10),
      hash: restItem.txhash,
      code: restItem.code || 0,
      rawLog: restItem.raw_log,
      logs: restItem.logs || [],
      tx: restItem.tx,
      timestamp: restItem.timestamp
    }));
  }
}
exports.CosmWasmClient = CosmWasmClient;
//# sourceMappingURL=cosmwasmclient.js.map