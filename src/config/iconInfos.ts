import { ReactComponent as AiriIcon } from 'assets/icons/airi.svg';
import { ReactComponent as AtomIcon } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as BnbIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as KwtIcon } from 'assets/icons/kwt.svg';
import { ReactComponent as MilkyIcon } from 'assets/icons/milky-token.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';

import { ReactComponent as BTCIcon } from 'assets/icons/btc-icon.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as OraixIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraixLightIcon } from 'assets/icons/oraix_light.svg';
import { ReactComponent as OsmoIcon } from 'assets/icons/osmosis_light.svg';
import { ReactComponent as ScOraiIcon } from 'assets/icons/orchai.svg';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';
import { ReactComponent as TronIcon } from 'assets/icons/tron.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { ReactComponent as ScAtomIcon } from 'assets/icons/scatom.svg';
import { ReactComponent as InjIcon } from 'assets/icons/inj.svg';
import { ReactComponent as NobleIcon } from 'assets/icons/noble.svg';
import { ReactComponent as NobleLightIcon } from 'assets/icons/ic_noble_light.svg';
import { ReactComponent as TimpiIcon } from 'assets/icons/timpiIcon.svg';
import { ReactComponent as NeutaroIcon } from 'assets/icons/neutaro.svg';
import { ReactComponent as OrchaiIcon } from 'assets/icons/orchaiIcon.svg';
import { ReactComponent as BitcoinIcon } from 'assets/icons/bitcoin.svg';
import { ReactComponent as CelestiaIcon } from 'assets/icons/celestia.svg';
import { ReactComponent as TonIcon } from 'assets/icons/ton.svg';
import { ReactComponent as PepeIcon } from 'assets/icons/pepe.svg';
import { ReactComponent as CatIcon } from 'assets/icons/icon-simoncat.svg';

import { CustomChainInfo, TokenItemType } from '@oraichain/oraidex-common';
import { bitcoinChainId } from 'helper/constants';

export type TokenIcon = Pick<TokenItemType, 'coinGeckoId' | 'Icon' | 'IconLight'>;
export type ChainIcon = Pick<CustomChainInfo, 'chainId' | 'Icon' | 'IconLight'>;

export const tokensIconInfos: TokenIcon[] = [
  {
    coinGeckoId: 'oraichain-token',
    Icon: OraiIcon,
    IconLight: OraiLightIcon
  },
  {
    coinGeckoId: 'usd-coin',
    Icon: UsdcIcon,
    IconLight: UsdcIcon
  },
  {
    coinGeckoId: 'bitcoin',
    Icon: BTCIcon,
    IconLight: BTCIcon
  },
  {
    coinGeckoId: 'airight',
    Icon: AiriIcon,
    IconLight: AiriIcon
  },
  {
    coinGeckoId: 'tether',
    Icon: UsdtIcon,
    IconLight: UsdtIcon
  },
  {
    coinGeckoId: 'tron',
    Icon: TronIcon,
    IconLight: TronIcon
  },
  {
    coinGeckoId: 'kawaii-islands',
    Icon: KwtIcon,
    IconLight: KwtIcon
  },
  {
    coinGeckoId: 'milky-token',
    Icon: MilkyIcon,
    IconLight: MilkyIcon
  },
  {
    coinGeckoId: 'osmosis',
    Icon: OsmoIcon,
    IconLight: OsmoIcon
  },
  {
    coinGeckoId: 'injective-protocol',
    Icon: InjIcon,
    IconLight: InjIcon
  },
  {
    coinGeckoId: 'cosmos',
    Icon: AtomIcon,
    IconLight: AtomIcon
  },
  {
    coinGeckoId: 'weth',
    Icon: EthIcon,
    IconLight: EthIcon
  },
  {
    coinGeckoId: 'ethereum',
    Icon: EthIcon,
    IconLight: EthIcon
  },
  {
    coinGeckoId: 'wbnb',
    Icon: BnbIcon,
    IconLight: BnbIcon
  },
  {
    coinGeckoId: 'binancecoin',
    Icon: BnbIcon,
    IconLight: BnbIcon
  },
  {
    coinGeckoId: 'oraidex',
    Icon: OraixIcon,
    IconLight: OraixLightIcon
  },
  {
    coinGeckoId: 'scorai',
    Icon: ScOraiIcon,
    IconLight: ScOraiIcon
  },
  {
    coinGeckoId: 'scatom',
    Icon: ScAtomIcon,
    IconLight: ScAtomIcon
  },
  {
    coinGeckoId: 'neutaro',
    Icon: TimpiIcon,
    IconLight: TimpiIcon
  },
  {
    coinGeckoId: 'och',
    Icon: OrchaiIcon,
    IconLight: OrchaiIcon
  },
  {
    coinGeckoId: 'bitcoin',
    Icon: BitcoinIcon,
    IconLight: BitcoinIcon
  },
  {
    coinGeckoId: 'celestia',
    Icon: CelestiaIcon,
    IconLight: CelestiaIcon
  },
  {
    coinGeckoId: 'the-open-network',
    Icon: TonIcon,
    IconLight: TonIcon
  },
  {
    coinGeckoId: 'pepe',
    Icon: PepeIcon,
    IconLight: PepeIcon
  },
  {
    coinGeckoId: 'simon-s-cat',
    Icon: CatIcon,
    IconLight: CatIcon
  }
];

export const chainIconsInfos: ChainIcon[] = [
  {
    chainId: 'Oraichain',
    Icon: OraiIcon,
    IconLight: OraiLightIcon
  },
  {
    chainId: bitcoinChainId,
    Icon: BTCIcon,
    IconLight: BTCIcon
  },
  {
    chainId: 'kawaii_6886-1',
    Icon: KwtIcon,
    IconLight: KwtIcon
  },
  {
    chainId: 'osmosis-1',
    Icon: OsmoIcon,
    IconLight: OsmoIcon
  },
  {
    chainId: 'injective-1',
    Icon: InjIcon,
    IconLight: InjIcon
  },
  {
    chainId: 'cosmoshub-4',
    Icon: AtomIcon,
    IconLight: AtomIcon
  },
  {
    chainId: '0x01',
    Icon: EthIcon,
    IconLight: EthIcon
  },
  {
    chainId: '0x2b6653dc',
    Icon: TronIcon,
    IconLight: TronIcon
  },
  {
    chainId: '0x38',
    Icon: BnbIcon,
    IconLight: BnbIcon
  },
  {
    chainId: '0x1ae6',
    Icon: KwtIcon,
    IconLight: KwtIcon
  },
  {
    chainId: 'noble-1',
    Icon: NobleIcon,
    IconLight: NobleLightIcon
  },
  {
    chainId: 'Neutaro-1',
    Icon: NeutaroIcon,
    IconLight: NeutaroIcon
  },
  {
    chainId: 'oraibtc-mainnet-1',
    Icon: BitcoinIcon,
    IconLight: BitcoinIcon
  }
];

export const mapListWithIcon = (list: any[], listIcon: ChainIcon[] | TokenIcon[], key: 'chainId' | 'coinGeckoId') => {
  return list.map((item) => {
    let Icon = OraiIcon;
    let IconLight = OraiLightIcon;

    const findedItem = listIcon.find((icon) => icon[key] === item[key]);
    if (findedItem) {
      Icon = findedItem.Icon;
      IconLight = findedItem.IconLight;
    }

    return {
      ...item,
      Icon,
      IconLight
    };
  });
};
