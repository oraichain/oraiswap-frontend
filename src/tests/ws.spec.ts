import { AIRI_BSC_CONTRACT, ORAI_BRIDGE_EVM_DENOM_PREFIX, ORAI_BSC_CONTRACT } from '@oraichain/oraidex-common';
import { processWsResponseMsg } from 'libs/utils';

describe('bigint', () => {
  it('websocket-null-message-or-result-not-found-should-return-null', async () => {
    let msg = null;
    let result = processWsResponseMsg(msg);
    expect(result).toBe(null);

    msg = {
      foobar: 'abc'
    };
    result = processWsResponseMsg(msg);
    expect(result).toBe(null);
  });

  it('websocket-message-empty-result-should-return-null', async () => {
    const msg = {
      result: {}
    };
    const result = processWsResponseMsg(msg);
    expect(result).toBe(null);
  });

  it('websocket-message-result-not-object-should-return-null', async () => {
    const msg = {
      result: 'abc'
    };
    const result = processWsResponseMsg(msg);
    expect(result).toBe(null);
  });

  it('websocket-message-result-does-not-have-events-should-return-null', async () => {
    const msg = {
      result: {
        foobar: 'abc'
      }
    };
    const result = processWsResponseMsg(msg);
    expect(result).toBe(null);
  });

  it('websocket-message-packets-data-undefined-should-return-null', async () => {
    const msg = {
      result: {
        events: []
      }
    };
    const result = processWsResponseMsg(msg);
    expect(result).toBe(null);
  });

  it('websocket-message-packets-happy-path-should-return-correct-tokens', async () => {
    const msg = {
      result: {
        events: {
          'recv_packet.packet_data': [
            `{"amount":"100000000000000","denom":"${ORAI_BRIDGE_EVM_DENOM_PREFIX}${ORAI_BSC_CONTRACT}","receiver":"orai...","sender":"oraib..."}`,
            `{"amount":"1000000000000000000","denom":"${ORAI_BRIDGE_EVM_DENOM_PREFIX}${AIRI_BSC_CONTRACT}","receiver":"orai...","sender":"oraib..."}`
          ]
        }
      }
    };
    const result = processWsResponseMsg(msg);
    expect(result).toBe('0.0001 ORAI, 1 AIRI');
  });
});
