/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "tendermint.libs.bits";

export interface BitArray {
  bits: string;
  elems: string[];
}

function createBaseBitArray(): BitArray {
  return { bits: "0", elems: [] };
}

export const BitArray = {
  encode(message: BitArray, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bits !== "0") {
      writer.uint32(8).int64(message.bits);
    }
    writer.uint32(18).fork();
    for (const v of message.elems) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BitArray {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBitArray();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bits = longToString(reader.int64() as Long);
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.elems.push(longToString(reader.uint64() as Long));
            }
          } else {
            message.elems.push(longToString(reader.uint64() as Long));
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BitArray {
    return {
      bits: isSet(object.bits) ? String(object.bits) : "0",
      elems: Array.isArray(object?.elems) ? object.elems.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: BitArray): unknown {
    const obj: any = {};
    message.bits !== undefined && (obj.bits = message.bits);
    if (message.elems) {
      obj.elems = message.elems.map((e) => e);
    } else {
      obj.elems = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BitArray>, I>>(base?: I): BitArray {
    return BitArray.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BitArray>, I>>(object: I): BitArray {
    const message = createBaseBitArray();
    message.bits = object.bits ?? "0";
    message.elems = object.elems?.map((e) => e) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

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
