/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Duration } from "../../../../google/protobuf/duration";
import { Timestamp } from "../../../../google/protobuf/timestamp";
import { ProofSpec } from "../../../../proofs";
import { SignedHeader } from "../../../../tendermint/types/types";
import { ValidatorSet } from "../../../../tendermint/types/validator";
import { Height } from "../../../core/client/v1/client";
import { MerkleRoot } from "../../../core/commitment/v1/commitment";

export const protobufPackage = "ibc.lightclients.tendermint.v1";

/**
 * ClientState from Tendermint tracks the current validator set, latest height,
 * and a possible frozen height.
 */
export interface ClientState {
  chainId: string;
  trustLevel:
    | Fraction
    | undefined;
  /**
   * duration of the period since the LastestTimestamp during which the
   * submitted headers are valid for upgrade
   */
  trustingPeriod:
    | Duration
    | undefined;
  /** duration of the staking unbonding period */
  unbondingPeriod:
    | Duration
    | undefined;
  /** defines how much new (untrusted) header's Time can drift into the future. */
  maxClockDrift:
    | Duration
    | undefined;
  /** Block height when the client was frozen due to a misbehaviour */
  frozenHeight:
    | Height
    | undefined;
  /** Latest height the client was updated to */
  latestHeight:
    | Height
    | undefined;
  /** Proof specifications used in verifying counterparty state */
  proofSpecs: ProofSpec[];
  /**
   * Path at which next upgraded client will be committed.
   * Each element corresponds to the key for a single CommitmentProof in the
   * chained proof. NOTE: ClientState must stored under
   * `{upgradePath}/{upgradeHeight}/clientState` ConsensusState must be stored
   * under `{upgradepath}/{upgradeHeight}/consensusState` For SDK chains using
   * the default upgrade module, upgrade_path should be []string{"upgrade",
   * "upgradedIBCState"}`
   */
  upgradePath: string[];
  /**
   * allow_update_after_expiry is deprecated
   *
   * @deprecated
   */
  allowUpdateAfterExpiry: boolean;
  /**
   * allow_update_after_misbehaviour is deprecated
   *
   * @deprecated
   */
  allowUpdateAfterMisbehaviour: boolean;
}

/** ConsensusState defines the consensus state from Tendermint. */
export interface ConsensusState {
  /**
   * timestamp that corresponds to the block height in which the ConsensusState
   * was stored.
   */
  timestamp:
    | Date
    | undefined;
  /** commitment root (i.e app hash) */
  root: MerkleRoot | undefined;
  nextValidatorsHash: Uint8Array;
}

/**
 * Misbehaviour is a wrapper over two conflicting Headers
 * that implements Misbehaviour interface expected by ICS-02
 */
export interface Misbehaviour {
  clientId: string;
  header1: Header | undefined;
  header2: Header | undefined;
}

/**
 * Header defines the Tendermint client consensus Header.
 * It encapsulates all the information necessary to update from a trusted
 * Tendermint ConsensusState. The inclusion of TrustedHeight and
 * TrustedValidators allows this update to process correctly, so long as the
 * ConsensusState for the TrustedHeight exists, this removes race conditions
 * among relayers The SignedHeader and ValidatorSet are the new untrusted update
 * fields for the client. The TrustedHeight is the height of a stored
 * ConsensusState on the client that will be used to verify the new untrusted
 * header. The Trusted ConsensusState must be within the unbonding period of
 * current time in order to correctly verify, and the TrustedValidators must
 * hash to TrustedConsensusState.NextValidatorsHash since that is the last
 * trusted validator set at the TrustedHeight.
 */
export interface Header {
  signedHeader: SignedHeader | undefined;
  validatorSet: ValidatorSet | undefined;
  trustedHeight: Height | undefined;
  trustedValidators: ValidatorSet | undefined;
}

/**
 * Fraction defines the protobuf message type for tmmath.Fraction that only
 * supports positive values.
 */
export interface Fraction {
  numerator: string;
  denominator: string;
}

function createBaseClientState(): ClientState {
  return {
    chainId: "",
    trustLevel: undefined,
    trustingPeriod: undefined,
    unbondingPeriod: undefined,
    maxClockDrift: undefined,
    frozenHeight: undefined,
    latestHeight: undefined,
    proofSpecs: [],
    upgradePath: [],
    allowUpdateAfterExpiry: false,
    allowUpdateAfterMisbehaviour: false,
  };
}

export const ClientState = {
  encode(message: ClientState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chainId !== "") {
      writer.uint32(10).string(message.chainId);
    }
    if (message.trustLevel !== undefined) {
      Fraction.encode(message.trustLevel, writer.uint32(18).fork()).ldelim();
    }
    if (message.trustingPeriod !== undefined) {
      Duration.encode(message.trustingPeriod, writer.uint32(26).fork()).ldelim();
    }
    if (message.unbondingPeriod !== undefined) {
      Duration.encode(message.unbondingPeriod, writer.uint32(34).fork()).ldelim();
    }
    if (message.maxClockDrift !== undefined) {
      Duration.encode(message.maxClockDrift, writer.uint32(42).fork()).ldelim();
    }
    if (message.frozenHeight !== undefined) {
      Height.encode(message.frozenHeight, writer.uint32(50).fork()).ldelim();
    }
    if (message.latestHeight !== undefined) {
      Height.encode(message.latestHeight, writer.uint32(58).fork()).ldelim();
    }
    for (const v of message.proofSpecs) {
      ProofSpec.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.upgradePath) {
      writer.uint32(74).string(v!);
    }
    if (message.allowUpdateAfterExpiry === true) {
      writer.uint32(80).bool(message.allowUpdateAfterExpiry);
    }
    if (message.allowUpdateAfterMisbehaviour === true) {
      writer.uint32(88).bool(message.allowUpdateAfterMisbehaviour);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClientState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClientState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chainId = reader.string();
          break;
        case 2:
          message.trustLevel = Fraction.decode(reader, reader.uint32());
          break;
        case 3:
          message.trustingPeriod = Duration.decode(reader, reader.uint32());
          break;
        case 4:
          message.unbondingPeriod = Duration.decode(reader, reader.uint32());
          break;
        case 5:
          message.maxClockDrift = Duration.decode(reader, reader.uint32());
          break;
        case 6:
          message.frozenHeight = Height.decode(reader, reader.uint32());
          break;
        case 7:
          message.latestHeight = Height.decode(reader, reader.uint32());
          break;
        case 8:
          message.proofSpecs.push(ProofSpec.decode(reader, reader.uint32()));
          break;
        case 9:
          message.upgradePath.push(reader.string());
          break;
        case 10:
          message.allowUpdateAfterExpiry = reader.bool();
          break;
        case 11:
          message.allowUpdateAfterMisbehaviour = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClientState {
    return {
      chainId: isSet(object.chainId) ? String(object.chainId) : "",
      trustLevel: isSet(object.trustLevel) ? Fraction.fromJSON(object.trustLevel) : undefined,
      trustingPeriod: isSet(object.trustingPeriod) ? Duration.fromJSON(object.trustingPeriod) : undefined,
      unbondingPeriod: isSet(object.unbondingPeriod) ? Duration.fromJSON(object.unbondingPeriod) : undefined,
      maxClockDrift: isSet(object.maxClockDrift) ? Duration.fromJSON(object.maxClockDrift) : undefined,
      frozenHeight: isSet(object.frozenHeight) ? Height.fromJSON(object.frozenHeight) : undefined,
      latestHeight: isSet(object.latestHeight) ? Height.fromJSON(object.latestHeight) : undefined,
      proofSpecs: Array.isArray(object?.proofSpecs) ? object.proofSpecs.map((e: any) => ProofSpec.fromJSON(e)) : [],
      upgradePath: Array.isArray(object?.upgradePath) ? object.upgradePath.map((e: any) => String(e)) : [],
      allowUpdateAfterExpiry: isSet(object.allowUpdateAfterExpiry) ? Boolean(object.allowUpdateAfterExpiry) : false,
      allowUpdateAfterMisbehaviour: isSet(object.allowUpdateAfterMisbehaviour)
        ? Boolean(object.allowUpdateAfterMisbehaviour)
        : false,
    };
  },

  toJSON(message: ClientState): unknown {
    const obj: any = {};
    message.chainId !== undefined && (obj.chainId = message.chainId);
    message.trustLevel !== undefined &&
      (obj.trustLevel = message.trustLevel ? Fraction.toJSON(message.trustLevel) : undefined);
    message.trustingPeriod !== undefined &&
      (obj.trustingPeriod = message.trustingPeriod ? Duration.toJSON(message.trustingPeriod) : undefined);
    message.unbondingPeriod !== undefined &&
      (obj.unbondingPeriod = message.unbondingPeriod ? Duration.toJSON(message.unbondingPeriod) : undefined);
    message.maxClockDrift !== undefined &&
      (obj.maxClockDrift = message.maxClockDrift ? Duration.toJSON(message.maxClockDrift) : undefined);
    message.frozenHeight !== undefined &&
      (obj.frozenHeight = message.frozenHeight ? Height.toJSON(message.frozenHeight) : undefined);
    message.latestHeight !== undefined &&
      (obj.latestHeight = message.latestHeight ? Height.toJSON(message.latestHeight) : undefined);
    if (message.proofSpecs) {
      obj.proofSpecs = message.proofSpecs.map((e) => e ? ProofSpec.toJSON(e) : undefined);
    } else {
      obj.proofSpecs = [];
    }
    if (message.upgradePath) {
      obj.upgradePath = message.upgradePath.map((e) => e);
    } else {
      obj.upgradePath = [];
    }
    message.allowUpdateAfterExpiry !== undefined && (obj.allowUpdateAfterExpiry = message.allowUpdateAfterExpiry);
    message.allowUpdateAfterMisbehaviour !== undefined &&
      (obj.allowUpdateAfterMisbehaviour = message.allowUpdateAfterMisbehaviour);
    return obj;
  },

  create<I extends Exact<DeepPartial<ClientState>, I>>(base?: I): ClientState {
    return ClientState.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ClientState>, I>>(object: I): ClientState {
    const message = createBaseClientState();
    message.chainId = object.chainId ?? "";
    message.trustLevel = (object.trustLevel !== undefined && object.trustLevel !== null)
      ? Fraction.fromPartial(object.trustLevel)
      : undefined;
    message.trustingPeriod = (object.trustingPeriod !== undefined && object.trustingPeriod !== null)
      ? Duration.fromPartial(object.trustingPeriod)
      : undefined;
    message.unbondingPeriod = (object.unbondingPeriod !== undefined && object.unbondingPeriod !== null)
      ? Duration.fromPartial(object.unbondingPeriod)
      : undefined;
    message.maxClockDrift = (object.maxClockDrift !== undefined && object.maxClockDrift !== null)
      ? Duration.fromPartial(object.maxClockDrift)
      : undefined;
    message.frozenHeight = (object.frozenHeight !== undefined && object.frozenHeight !== null)
      ? Height.fromPartial(object.frozenHeight)
      : undefined;
    message.latestHeight = (object.latestHeight !== undefined && object.latestHeight !== null)
      ? Height.fromPartial(object.latestHeight)
      : undefined;
    message.proofSpecs = object.proofSpecs?.map((e) => ProofSpec.fromPartial(e)) || [];
    message.upgradePath = object.upgradePath?.map((e) => e) || [];
    message.allowUpdateAfterExpiry = object.allowUpdateAfterExpiry ?? false;
    message.allowUpdateAfterMisbehaviour = object.allowUpdateAfterMisbehaviour ?? false;
    return message;
  },
};

function createBaseConsensusState(): ConsensusState {
  return { timestamp: undefined, root: undefined, nextValidatorsHash: new Uint8Array() };
}

export const ConsensusState = {
  encode(message: ConsensusState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(10).fork()).ldelim();
    }
    if (message.root !== undefined) {
      MerkleRoot.encode(message.root, writer.uint32(18).fork()).ldelim();
    }
    if (message.nextValidatorsHash.length !== 0) {
      writer.uint32(26).bytes(message.nextValidatorsHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConsensusState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsensusState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 2:
          message.root = MerkleRoot.decode(reader, reader.uint32());
          break;
        case 3:
          message.nextValidatorsHash = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConsensusState {
    return {
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
      root: isSet(object.root) ? MerkleRoot.fromJSON(object.root) : undefined,
      nextValidatorsHash: isSet(object.nextValidatorsHash)
        ? bytesFromBase64(object.nextValidatorsHash)
        : new Uint8Array(),
    };
  },

  toJSON(message: ConsensusState): unknown {
    const obj: any = {};
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    message.root !== undefined && (obj.root = message.root ? MerkleRoot.toJSON(message.root) : undefined);
    message.nextValidatorsHash !== undefined &&
      (obj.nextValidatorsHash = base64FromBytes(
        message.nextValidatorsHash !== undefined ? message.nextValidatorsHash : new Uint8Array(),
      ));
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsensusState>, I>>(base?: I): ConsensusState {
    return ConsensusState.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConsensusState>, I>>(object: I): ConsensusState {
    const message = createBaseConsensusState();
    message.timestamp = object.timestamp ?? undefined;
    message.root = (object.root !== undefined && object.root !== null)
      ? MerkleRoot.fromPartial(object.root)
      : undefined;
    message.nextValidatorsHash = object.nextValidatorsHash ?? new Uint8Array();
    return message;
  },
};

function createBaseMisbehaviour(): Misbehaviour {
  return { clientId: "", header1: undefined, header2: undefined };
}

export const Misbehaviour = {
  encode(message: Misbehaviour, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.header1 !== undefined) {
      Header.encode(message.header1, writer.uint32(18).fork()).ldelim();
    }
    if (message.header2 !== undefined) {
      Header.encode(message.header2, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Misbehaviour {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMisbehaviour();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 2:
          message.header1 = Header.decode(reader, reader.uint32());
          break;
        case 3:
          message.header2 = Header.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Misbehaviour {
    return {
      clientId: isSet(object.clientId) ? String(object.clientId) : "",
      header1: isSet(object.header1) ? Header.fromJSON(object.header1) : undefined,
      header2: isSet(object.header2) ? Header.fromJSON(object.header2) : undefined,
    };
  },

  toJSON(message: Misbehaviour): unknown {
    const obj: any = {};
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.header1 !== undefined && (obj.header1 = message.header1 ? Header.toJSON(message.header1) : undefined);
    message.header2 !== undefined && (obj.header2 = message.header2 ? Header.toJSON(message.header2) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Misbehaviour>, I>>(base?: I): Misbehaviour {
    return Misbehaviour.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Misbehaviour>, I>>(object: I): Misbehaviour {
    const message = createBaseMisbehaviour();
    message.clientId = object.clientId ?? "";
    message.header1 = (object.header1 !== undefined && object.header1 !== null)
      ? Header.fromPartial(object.header1)
      : undefined;
    message.header2 = (object.header2 !== undefined && object.header2 !== null)
      ? Header.fromPartial(object.header2)
      : undefined;
    return message;
  },
};

function createBaseHeader(): Header {
  return { signedHeader: undefined, validatorSet: undefined, trustedHeight: undefined, trustedValidators: undefined };
}

export const Header = {
  encode(message: Header, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.signedHeader !== undefined) {
      SignedHeader.encode(message.signedHeader, writer.uint32(10).fork()).ldelim();
    }
    if (message.validatorSet !== undefined) {
      ValidatorSet.encode(message.validatorSet, writer.uint32(18).fork()).ldelim();
    }
    if (message.trustedHeight !== undefined) {
      Height.encode(message.trustedHeight, writer.uint32(26).fork()).ldelim();
    }
    if (message.trustedValidators !== undefined) {
      ValidatorSet.encode(message.trustedValidators, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Header {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeader();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signedHeader = SignedHeader.decode(reader, reader.uint32());
          break;
        case 2:
          message.validatorSet = ValidatorSet.decode(reader, reader.uint32());
          break;
        case 3:
          message.trustedHeight = Height.decode(reader, reader.uint32());
          break;
        case 4:
          message.trustedValidators = ValidatorSet.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Header {
    return {
      signedHeader: isSet(object.signedHeader) ? SignedHeader.fromJSON(object.signedHeader) : undefined,
      validatorSet: isSet(object.validatorSet) ? ValidatorSet.fromJSON(object.validatorSet) : undefined,
      trustedHeight: isSet(object.trustedHeight) ? Height.fromJSON(object.trustedHeight) : undefined,
      trustedValidators: isSet(object.trustedValidators) ? ValidatorSet.fromJSON(object.trustedValidators) : undefined,
    };
  },

  toJSON(message: Header): unknown {
    const obj: any = {};
    message.signedHeader !== undefined &&
      (obj.signedHeader = message.signedHeader ? SignedHeader.toJSON(message.signedHeader) : undefined);
    message.validatorSet !== undefined &&
      (obj.validatorSet = message.validatorSet ? ValidatorSet.toJSON(message.validatorSet) : undefined);
    message.trustedHeight !== undefined &&
      (obj.trustedHeight = message.trustedHeight ? Height.toJSON(message.trustedHeight) : undefined);
    message.trustedValidators !== undefined &&
      (obj.trustedValidators = message.trustedValidators ? ValidatorSet.toJSON(message.trustedValidators) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Header>, I>>(base?: I): Header {
    return Header.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Header>, I>>(object: I): Header {
    const message = createBaseHeader();
    message.signedHeader = (object.signedHeader !== undefined && object.signedHeader !== null)
      ? SignedHeader.fromPartial(object.signedHeader)
      : undefined;
    message.validatorSet = (object.validatorSet !== undefined && object.validatorSet !== null)
      ? ValidatorSet.fromPartial(object.validatorSet)
      : undefined;
    message.trustedHeight = (object.trustedHeight !== undefined && object.trustedHeight !== null)
      ? Height.fromPartial(object.trustedHeight)
      : undefined;
    message.trustedValidators = (object.trustedValidators !== undefined && object.trustedValidators !== null)
      ? ValidatorSet.fromPartial(object.trustedValidators)
      : undefined;
    return message;
  },
};

function createBaseFraction(): Fraction {
  return { numerator: "0", denominator: "0" };
}

export const Fraction = {
  encode(message: Fraction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.numerator !== "0") {
      writer.uint32(8).uint64(message.numerator);
    }
    if (message.denominator !== "0") {
      writer.uint32(16).uint64(message.denominator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Fraction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFraction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.numerator = longToString(reader.uint64() as Long);
          break;
        case 2:
          message.denominator = longToString(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Fraction {
    return {
      numerator: isSet(object.numerator) ? String(object.numerator) : "0",
      denominator: isSet(object.denominator) ? String(object.denominator) : "0",
    };
  },

  toJSON(message: Fraction): unknown {
    const obj: any = {};
    message.numerator !== undefined && (obj.numerator = message.numerator);
    message.denominator !== undefined && (obj.denominator = message.denominator);
    return obj;
  },

  create<I extends Exact<DeepPartial<Fraction>, I>>(base?: I): Fraction {
    return Fraction.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Fraction>, I>>(object: I): Fraction {
    const message = createBaseFraction();
    message.numerator = object.numerator ?? "0";
    message.denominator = object.denominator ?? "0";
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000).toString();
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = Number(t.seconds) * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function longToString(long: Long) {
  return long.toString();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
