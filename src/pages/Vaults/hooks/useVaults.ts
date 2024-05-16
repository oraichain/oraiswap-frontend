import { BigDecimal, CoinGeckoId, TokenItemType } from '@oraichain/oraidex-common';
import { useQuery } from '@tanstack/react-query';
import { flattenTokensWithIcon } from 'config/chainInfos';
import { CoinGeckoPrices, useCoinGeckoPrices } from 'hooks/useCoingecko';
import axios from 'rest/request';
import { getVaultInfosFromContract } from '../helpers/vault-query';
import { VaultInfo, VaultInfoBackend, VaultInfoContract } from '../type';

export const calculateTvlUsd = (
  tvlByToken: string,
  token: TokenItemType,
  prices: CoinGeckoPrices<CoinGeckoId>
): string => {
  const tokenPrice = prices[token.coinGeckoId];
  if (!tokenPrice) return '0';
  return new BigDecimal(tvlByToken).mul(tokenPrice).toString();
};

export const calculateSharePrice = (totalSupply: string, tvl: string): number => {
  let sharePrice = 0;
  if (new BigDecimal(totalSupply).toNumber() !== 0) {
    sharePrice = new BigDecimal(tvl).div(totalSupply).toNumber();
  }
  return sharePrice;
};

export const useGetVaults = () => {
  const {
    data: vaultInfosBackend,
    refetch: refetchVaults,
    isLoading
  } = useQuery(['vaults-backend'], getVaultsInfoFromBackend);

  const {
    data: vaultInfosContract,
    refetch: refetchVaultInfos,
    isLoading: isLoadingVaultInfos
  } = useQuery<VaultInfoContract[]>(
    ['vaults-contract'],
    () => getVaultInfosFromContract(vaultInfosBackend?.map((vault) => vault.vaultAddr)),
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      enabled: vaultInfosBackend?.length > 0,
      placeholderData: []
    }
  );

  const { data: prices } = useCoinGeckoPrices();

  // combine data from vault backend & vault contract
  const totalVaultInfos: VaultInfo[] = vaultInfosContract
    ? vaultInfosContract
        .map((vaultInfoContract, index) => {
          const vaultInfoBackend = vaultInfosBackend[index];
          if (!vaultInfoBackend) return null;

          const tokenInfo1 = flattenTokensWithIcon.find(
            (token) => token.name === JSON.parse(vaultInfoBackend.token1).symbol
          );

          const tvl = calculateTvlUsd(vaultInfoContract.tvlByToken1, tokenInfo1, prices);
          const sharePrice = calculateSharePrice(vaultInfoContract.totalSupply, tvl);

          return {
            ...vaultInfoContract,
            ...vaultInfoBackend,
            token0: JSON.parse(vaultInfoBackend.token0),
            token1: JSON.parse(vaultInfoBackend.token1),
            lpToken: JSON.parse(vaultInfoBackend.lpToken),
            tokenInfo0: flattenTokensWithIcon.find(
              (token) => token.name === JSON.parse(vaultInfoBackend.token0).symbol
            ),
            tokenInfo1,
            sharePrice,
            tvl
          };
        })
        .filter(Boolean)
    : [];

  return {
    vaultInfosBackend,
    vaultInfosContract,
    totalVaultInfos,
    refetchVaults,
    isLoading,
    refetchVaultInfos,
    isLoadingVaultInfos
  };
};

export const getVaultsInfoFromBackend = async (): Promise<VaultInfoBackend[]> => {
  try {
    const res = await axios.get('/v1/vaults/', { baseURL: process.env.REACT_APP_VAULT_API_URL });
    return res.data;
  } catch (error) {
    console.error('Error getVaultsInfoFromBackend: ', error);
    return [];
  }
};
