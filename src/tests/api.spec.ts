import { CoinGeckoId, NetworkChainId } from 'config/chainInfos';
import { USDT_BSC_CONTRACT, USDT_TRON_CONTRACT, WRAP_BNB_CONTRACT } from 'config/constants';
import { buildSwapRouterKey, getSwapRoute, getTokenOnSpecificChainId } from 'rest/api';

describe('test-api', () => {
  it.each<[CoinGeckoId, NetworkChainId, boolean]>([
    ['wbnb', '0x38', false],
    ['wbnb', 'Oraichain', true]
  ])('test-getTokenOnSpecificChainId', (coingeckoId, chainId, expectedResult) => {
    const result = getTokenOnSpecificChainId(coingeckoId, chainId);
    expect(result === undefined).toEqual(expectedResult);
  });
  // it('test-simulateSwapEvm', () => {
  //   throw 'simulateSwapEvm error';
  // });
  it('test-buildSwapRouterKey', () => {
    expect(buildSwapRouterKey('foo', 'bar')).toEqual('foo-bar');
  });
  it.each<[string, string, string, string[]]>([
    ['0x38', USDT_BSC_CONTRACT, WRAP_BNB_CONTRACT, [USDT_BSC_CONTRACT, WRAP_BNB_CONTRACT]],
    ['0x38', WRAP_BNB_CONTRACT, USDT_BSC_CONTRACT, [WRAP_BNB_CONTRACT, USDT_BSC_CONTRACT]],
    ['0x38', WRAP_BNB_CONTRACT, USDT_TRON_CONTRACT, undefined]
  ])('test-getSwapRoute', (chainId, fromContractAddr, toContractAddr, expectedRoute) => {
    const result = getSwapRoute(chainId, fromContractAddr, toContractAddr);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedRoute));
    // throw 'getSwapRoute error';
  });
});
