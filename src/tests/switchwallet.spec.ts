import { checkVersionWallet, keplrCheck, owalletCheck } from 'helper';

describe('switch-wallet', () => {
  let windowSpy: jest.SpyInstance;
  beforeAll(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });
  xit('test-version-owallet-and-check-switch-wallet', async () => {
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

    const Owallet = owalletCheck('owallet');
    const OwalletCheckKeplr = owalletCheck('keplr');
    expect(Owallet).toBe(true);
    expect(OwalletCheckKeplr).toBe(true);
  });

  xit('test-version-keplr-and-check-switch-wallet', async () => {
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

    const Owallet = owalletCheck('owallet');
    const OwalletCheckKeplr = owalletCheck('keplr');
    expect(Owallet).toBe(true);
    expect(OwalletCheckKeplr).toBe(false);
  });

  xit('test-only-keplr', async () => {
    windowSpy.mockImplementation(() => ({
      keplr: {
        version: '0.12'
      }
    }));

    const Keplr = keplrCheck('keplr');
    const KeplrCheckOwallet = keplrCheck('owallet');
    expect(Keplr).toBe(true);
    expect(KeplrCheckOwallet).toBe(false);

    const Owallet = owalletCheck('owallet');
    const OwalletCheckKeplr = owalletCheck('keplr');
    expect(Owallet).toBe(false);
    expect(OwalletCheckKeplr).toBe(false);
  });
});
