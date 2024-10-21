import { checkVersionWallet, keplrCheck } from 'helper';
import { beforeAll, describe, expect, vi, it } from 'vitest';

describe('switch-wallet', () => {
  let windowSpy;
  beforeAll(() => {
    windowSpy = vi.spyOn(window, 'window', 'get');
  });
  it.skip('test-version-owallet-and-check-switch-wallet', async () => {
    windowSpy.mockImplementation(() => ({
      keplr: {
        version: '0.9',
        mode: 'extension'
      },
      owallet: {
        version: '0.9',
        mode: 'extension',
        isOwallet: true
      }
    }));
    const versionWallet = checkVersionWallet();
    expect(versionWallet).toBe(true);
    const Keplr = keplrCheck('keplr');
    const KeplrCheckOwallet = keplrCheck('owallet');
    expect(Keplr).toBe(false);
    expect(KeplrCheckOwallet).toBe(false);
  });
  it.skip('test-version-keplr-and-check-switch-wallet', async () => {
    windowSpy.mockImplementation(() => ({
      keplr: {
        version: '0.12',
        mode: 'extension'
      },
      owallet: {
        version: '0.9',
        mode: 'extension',
        isOwallet: true
      }
    }));
    const versionWallet = checkVersionWallet();
    expect(versionWallet).toBe(false);
    const Keplr = keplrCheck('keplr');
    const KeplrCheckOwallet = keplrCheck('owallet');
    expect(Keplr).toBe(true);
    expect(KeplrCheckOwallet).toBe(false);
  });

  it.skip('test-only-keplr', async () => {
    windowSpy.mockImplementation(() => ({
      keplr: {
        version: '0.12'
      }
    }));
    const Keplr = keplrCheck('keplr');
    const KeplrCheckOwallet = keplrCheck('owallet');
    expect(Keplr).toBe(true);
    expect(KeplrCheckOwallet).toBe(false);
  });
});
