import { PoolWithPoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { oraichainTokens } from 'config/bridgeTokens';
import { oraichainTokensWithIcon } from 'config/chainInfos';
import { poolKeyToString } from 'libs/contractSingleton';
import { TokenItemType } from '@oraichain/oraidex-common';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';

export type PoolWithTokenInfo = PoolWithPoolKey & {
  FromTokenIcon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  ToTokenIcon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  feeTier: number;
  spread: number;
  tokenXinfo: TokenItemType;
  tokenYinfo: TokenItemType;
  poolKey: string;
};

export const getIconPoolData = (tokenX, tokenY, isLight) => {
  let [FromTokenIcon, ToTokenIcon] = [DefaultIcon, DefaultIcon];
  const tokenXinfo =
    tokenX && oraichainTokens.find((token) => token.denom === tokenX || token.contractAddress === tokenX);
  const tokenYinfo =
    tokenY && oraichainTokens.find((token) => token.denom === tokenY || token.contractAddress === tokenY);

  if (tokenXinfo && tokenYinfo) {
    const findFromToken = oraichainTokensWithIcon.find(
      (tokenIcon) => tokenIcon.denom === tokenXinfo.denom || tokenIcon.contractAddress === tokenXinfo.contractAddress
    );
    const findToToken = oraichainTokensWithIcon.find(
      (tokenIcon) => tokenIcon.denom === tokenYinfo.denom || tokenIcon.contractAddress === tokenYinfo.contractAddress
    );
    FromTokenIcon = isLight ? findFromToken.IconLight : findFromToken.Icon;
    ToTokenIcon = isLight ? findToToken.IconLight : findToToken.Icon;
  }
  return { FromTokenIcon, ToTokenIcon, tokenXinfo, tokenYinfo };
};

export const formatPoolData = (p: PoolWithPoolKey, isLight: boolean = false) => {
  const [tokenX, tokenY] = [p?.pool_key.token_x, p?.pool_key.token_y];

  let [FromTokenIcon, ToTokenIcon] = [DefaultIcon, DefaultIcon];
  const feeTier = p?.pool_key.fee_tier.fee || 0;
  const spread = p?.pool_key.fee_tier.tick_spacing || 100;
  const tokenXinfo =
    tokenX && oraichainTokens.find((token) => token.denom === tokenX || token.contractAddress === tokenX);
  const tokenYinfo =
    tokenY && oraichainTokens.find((token) => token.denom === tokenY || token.contractAddress === tokenY);

  if (tokenXinfo) {
    const findFromToken = oraichainTokensWithIcon.find(
      (tokenIcon) => tokenIcon.denom === tokenXinfo.denom || tokenIcon.contractAddress === tokenXinfo.contractAddress
    );
    const findToToken = oraichainTokensWithIcon.find(
      (tokenIcon) => tokenIcon.denom === tokenYinfo.denom || tokenIcon.contractAddress === tokenYinfo.contractAddress
    );
    FromTokenIcon = isLight ? findFromToken.IconLight : findFromToken.Icon;
    ToTokenIcon = isLight ? findToToken.IconLight : findToToken.Icon;
  }

  return {
    ...p,
    FromTokenIcon,
    ToTokenIcon,
    feeTier,
    spread,
    tokenXinfo,
    tokenYinfo,
    poolKey: poolKeyToString(p.pool_key)
  };
};
