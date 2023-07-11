import { TokenItemType, cosmosTokens, flattenTokens } from 'config/bridgeTokens';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { formateNumberDecimalsAuto, parseBep20Erc20Name, toSubAmount, toSumDisplay } from 'libs/utils';
import { getSubAmountDetails, getTotalUsd, reduceString, toSubDisplay, toTotalDisplay } from './../libs/utils';
import { getTokenOnOraichain, parseTokenInfoRawDenom } from 'rest/api';
import { CoinGeckoId } from 'config/chainInfos';
import { ORAI } from 'config/constants';
import { isFactoryV1, parseAssetInfo } from 'helper';
import { AssetInfo } from '@oraichain/common-contracts-sdk';

describe('should utils functions in libs/utils run exactly', () => {
  const amounts: AmountDetails = {
    usdt: '1000000', // 1
    orai: '1000000', // 1
    milky: '1000000', // 1
    [process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM]: '1000000000000000000' // 1
  };

  const prices: CoinGeckoPrices<string> = {
    'milky-token': 1,
    'oraichain-token': 4,
    tether: 1
  };

  it('should get total usd correctly', () => {
    const usd = getTotalUsd(amounts, prices);
    expect(usd).toEqual(7);
  });

  it('should get sumn display correctly', () => {
    const subDisplay = toSumDisplay(amounts);
    expect(subDisplay).toEqual(4);
  });

  it('should get sub amount of evm token correctly and to sum display, to total display correctly', () => {
    // test for milky token that have evm denom => have sub amount.
    const tokenInfo = flattenTokens.find((t) => t.evmDenoms && t.coinGeckoId === 'milky-token');
    const subAmounts = getSubAmountDetails(amounts, tokenInfo);
    expect(subAmounts).toEqual({
      [process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM]: '1000000000000000000'
    });
    const subDisplay = toSubDisplay(subAmounts, tokenInfo);
    expect(subDisplay).toEqual(1);

    const subAmount = toSubAmount(amounts, tokenInfo);
    expect(subAmount).toEqual(BigInt(1000000));

    const totalDisplay = toTotalDisplay(amounts, tokenInfo);
    expect(totalDisplay).toEqual(2);
  });

  it.each([
    [4.1, '4.1'],
    [4.033333333, '4.03'],
    [0.033333333, '0.0333'],
    [0.0000066, '0.000007'],
    [0.0000064, '0.000006']
  ])('should formate number decimals auto run correctly', (price: number, expectedFormat: string) => {
    const priceFormated = formateNumberDecimalsAuto({
      price: price,
      maxDecimal: 6,
      minDecimal: 2,
      unit: '',
      minPrice: 1
    });
    expect(priceFormated).toEqual(expectedFormat);
  });

  it.each([
    ['BEP20 AIRI', 'AIRI'],
    ['ERC20 AIRI', 'AIRI']
  ])('should parse bep20 rrc20 name correctly', (evmName: string, expectedParse: string) => {
    const name = parseBep20Erc20Name(evmName);
    expect(name).toBe(expectedParse);
  });

  describe('reduceString function', () => {
    it.each([
      ['Hello world!', 5, 5, 'Hello...orld!'],
      ['orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g', 10, 7, 'orai1g4h64...jvfgs7g'],
      ['A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', 2, 3, 'A ...Y Z']
    ])('should return a shortened string with "..." in between', (str, from, end, expected) => {
      expect(reduceString(str, from, end)).toEqual(expected);
    });

    it('should return "-" if the input string is null', () => {
      expect(reduceString(null, 5, 6)).toEqual('-');
    });
  });

  it.each<[TokenItemType, string]>([
    [
      flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === 'Oraichain'),
      flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === 'Oraichain').contractAddress
    ],
    [
      flattenTokens.find((item) => item.coinGeckoId === 'cosmos' && item.chainId === 'Oraichain'),
      flattenTokens.find((item) => item.coinGeckoId === 'cosmos' && item.chainId === 'Oraichain').denom
    ]
  ])('test-parseTokenInfoRawDenom-given-%j-should-receive-%s', (token, expectedDenom) => {
    expect(parseTokenInfoRawDenom(token)).toEqual(expectedDenom);
  });

  it.each<[CoinGeckoId, TokenItemType, string]>([
    ['airight', cosmosTokens.find((token) => token.coinGeckoId === 'airight' && token.chainId === 'Oraichain'), ''],
    ['tether', cosmosTokens.find((token) => token.coinGeckoId === 'tether' && token.chainId === 'Oraichain'), ''],
    ['tron', cosmosTokens.find((token) => token.coinGeckoId === 'tron' && token.chainId === 'Oraichain'), ''],
    [
      'kawaii-islands',
      cosmosTokens.find((token) => token.coinGeckoId === 'kawaii-islands' && token.chainId === 'Oraichain'),
      'KWT and MILKY not supported in this function'
    ]
  ])('test-getTokenOnOraichain-given-%s-should-receive-%j', (coingeckoId, expectedToken, err) => {
    try {
      expect(getTokenOnOraichain(coingeckoId)).toEqual(expectedToken);
    } catch (error) {
      expect(error).toEqual(new Error(err));
    }
  });

  it.each<[AssetInfo, string]>([
    [{ native_token: { denom: ORAI } }, ORAI],
    [{ token: { contract_addr: 'foobar' } }, 'foobar']
  ])('test-parseAssetInfo-given-%j-should-receive-%s', (assetInfo, expectedResult) => {
    expect(parseAssetInfo(assetInfo)).toEqual(expectedResult);
  });

  it('test-isFactoryV1-true', () => {
    const data = isFactoryV1([
      { native_token: { denom: 'orai' } },
      { token: { contract_addr: 'orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg' } }
    ]);
    expect(data).toEqual(true);
  });

  it('test-isFactoryV1-false', () => {
    const data = isFactoryV1([
      { native_token: { denom: 'orai' } },
      { token: { contract_addr: 'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd' } }
    ]);
    expect(data).toEqual(false);
  });
});
