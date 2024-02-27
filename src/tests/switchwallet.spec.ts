import { checkVersionWallet, keplrCheck, owalletCheck, switchWallet } from 'helper';

describe('switch-wallet', () => {
  let windowSpy: jest.SpyInstance;
  beforeAll(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });
  xit('test-version-owallet-and-check-switch-wallet', async () => {
    windowSpy.mockImplementation(() => ({
      keplr: {
        version: '0.9'
      },
      owallet: {
        version: '0.9'
      }
    }));
    const versionWallet = await checkVersionWallet();
    expect(versionWallet).toBe(true);

    const Keplr = await keplrCheck('keplr');
    const KeplrCheckOwallet = await keplrCheck('owallet');
    expect(Keplr).toBe(false);
    expect(KeplrCheckOwallet).toBe(false);

    const Owallet = await owalletCheck('owallet');
    const OwalletCheckKeplr = await owalletCheck('keplr');
    expect(Owallet).toBe(true);
    expect(OwalletCheckKeplr).toBe(true);

    const owallet = await switchWallet('owallet');
    expect(owallet).toBe(true);

    const keplr = await switchWallet('keplr');
    expect(keplr).toBe(false);
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

    const versionWallet = await checkVersionWallet();
    expect(versionWallet).toBe(false);

    const Keplr = await keplrCheck('keplr');
    const KeplrCheckOwallet = await keplrCheck('owallet');
    expect(Keplr).toBe(true);
    expect(KeplrCheckOwallet).toBe(false);

    const Owallet = await owalletCheck('owallet');
    const OwalletCheckKeplr = await owalletCheck('keplr');
    expect(Owallet).toBe(true);
    expect(OwalletCheckKeplr).toBe(false);

    const owallet = await switchWallet('owallet');
    expect(owallet).toBe(true);

    const keplr = await switchWallet('keplr');
    expect(keplr).toBe(false);
  });

  xit('test-only-keplr', async () => {
    windowSpy.mockImplementation(() => ({
      keplr: {
        version: '0.12'
      }
    }));

    const Keplr = await keplrCheck('keplr');
    const KeplrCheckOwallet = await keplrCheck('owallet');
    expect(Keplr).toBe(true);
    expect(KeplrCheckOwallet).toBe(true);

    const Owallet = await owalletCheck('owallet');
    const OwalletCheckKeplr = await owalletCheck('keplr');
    expect(Owallet).toBe(false);
    expect(OwalletCheckKeplr).toBe(false);

    const owallet = await switchWallet('owallet');
    expect(owallet).toBe(false);
    const keplr = await switchWallet('keplr');
    expect(keplr).toBe(false);
  });
});
