export type AssetInfoResponse = {
  asset: string;
  chain?: string;
  price: number;
  balance: number;
  denom?: string;
  value: number;
  coeff?: number;
  coeffType?: string;
};
