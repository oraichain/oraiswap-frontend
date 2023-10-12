import { CoinGeckoId, NetworkChainId } from '@oraichain/oraidex-common';
import { SwapDirection, checkEvmAddress, filterNonPoolEvmTokens } from 'pages/UniversalSwap/helpers';

describe('universal-swap', () => {
  it.each<[string, CoinGeckoId, string, string, SwapDirection, number]>([
    ['0x38', 'wbnb', 'bep20_bnb', '', SwapDirection.From, 5],
    ['Oraichain', 'tether', 'usdt', '', SwapDirection.From, 18],
    ['Oraichain', 'oraichain-token', 'orai', '', SwapDirection.To, 18],
    ['0x38', 'oraichain-token', 'bep20_orai', '', SwapDirection.To, 20],
    ['0x38', 'wbnb', 'bep20_bnb', '', SwapDirection.To, 8],
    ['0x38', 'oraichain-token', 'oraichain-token', 'AIRI', SwapDirection.From, 2]
  ])('test-filterNonPoolEvmTokens', (chainId, coinGeckoId, denom, searchTokenName, direction, expectedLength) => {
    const tokens = filterNonPoolEvmTokens(chainId, coinGeckoId, denom, searchTokenName, direction);
    expect(tokens.length).toEqual(expectedLength);
  });

  describe('checkEvmAddress', () => {
    const testCases = [
      ['0x01', '', undefined],
      ['0x38', '', undefined],
      ['0x2b6653dc', undefined, '']
    ];
    it.each(testCases)(
      'throws an error when not logged in to wallet (%s)',
      (chainId: NetworkChainId, metamaskAddress?: string, tronAddress?: string | boolean) => {
        expect(() => {
          checkEvmAddress(chainId, metamaskAddress, tronAddress);
        }).toThrow();
      }
    );
    it('does not throw an error when logged in to Metamask on Ethereum', () => {
      expect(() => {
        checkEvmAddress('0x01', '0x1234abcd');
      }).not.toThrow();
    });
    it('does not throw an error when logged in to Metamask on BSC', () => {
      expect(() => {
        checkEvmAddress('0x38', '0x5678efgh');
      }).not.toThrow();
    });
    it('does not throw an error when logged in to Tron wallet', () => {
      expect(() => {
        checkEvmAddress('0x2b6653dc', '', 'TRON_ADDRESS');
      }).not.toThrow();
    });
  });
});
