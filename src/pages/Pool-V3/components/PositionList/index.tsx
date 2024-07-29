import { useState } from 'react';
import styles from './index.module.scss';
import PositionItem from '../PositionItem';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import useTheme from 'hooks/useTheme';
import { useEffect } from 'react';
import { getCosmWasmClient } from 'libs/cosmjs';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import { oraichainTokens } from 'config/bridgeTokens';
import { toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { oraichainTokensWithIcon } from 'config/chainInfos';
import { PERCENTAGE_SCALE, calcYPerXPriceByTickIndex } from 'pages/Pool-V3/helper';
import { printBigint } from '../PriceRangePlot/utils';

const PositionList = () => {
  const theme = useTheme();
  const [dataPosition, setDataPosition] = useState<any[]>([]);
  const [address] = useConfigReducer('address');
  const isLight = theme === 'light';

  useEffect(() => {
    (async () => {
      // TODO: AMM V3 Pool
      const { client } = await getCosmWasmClient({ chainId: network.chainId });
      const positions = await client.queryContractSmart(network.pool_v3, {
        positions: {
          owner_id: address
        }
      });

      const positionsMap = positions.map((position: any, index) => {
        console.log({ position });

        const [tokenX, tokenY] = [position?.pool_key.token_x, position?.pool_key.token_y];
        let [tokenXIcon, tokenYIcon] = [DefaultIcon, DefaultIcon];
        const tokenXinfo =
          tokenX && oraichainTokens.find((token) => token.denom === tokenX || token.contractAddress === tokenX);
        const tokenYinfo =
          tokenY && oraichainTokens.find((token) => token.denom === tokenY || token.contractAddress === tokenY);

        if (tokenXinfo) {
          const findFromToken = oraichainTokensWithIcon.find(
            (tokenIcon) =>
              tokenIcon.denom === tokenXinfo.denom || tokenIcon.contractAddress === tokenXinfo.contractAddress
          );
          const findToToken = oraichainTokensWithIcon.find(
            (tokenIcon) =>
              tokenIcon.denom === tokenYinfo.denom || tokenIcon.contractAddress === tokenYinfo.contractAddress
          );
          tokenXIcon = isLight ? findFromToken.IconLight : findFromToken.Icon;
          tokenYIcon = isLight ? findToToken.IconLight : findToToken.Icon;
        }
        const lowerPrice = Number(
          calcYPerXPriceByTickIndex(position.lower_tick_index, tokenXinfo.decimals, tokenYinfo.decimals)
        );

        const upperPrice = calcYPerXPriceByTickIndex(
          position.upper_tick_index,
          tokenXinfo.decimals,
          tokenYinfo.decimals
        );

        const min = Math.min(lowerPrice, upperPrice);
        const max = Math.max(lowerPrice, upperPrice);

        let tokenXLiq: any, tokenYLiq: any;

        const x = 0n;
        const y = 0n;

        if (position.poolData) {
          // ;[x, y] = calculateTokenAmounts(position.poolData, position)
        }

        try {
          tokenXLiq = +printBigint(x, tokenXinfo.decimals);
        } catch (error) {
          tokenXLiq = 0;
        }

        try {
          tokenYLiq = +printBigint(y, tokenYinfo.decimals);
        } catch (error) {
          tokenYLiq = 0;
        }

        const currentPrice = calcYPerXPriceByTickIndex(
          position.poolData?.pool?.current_tick_index ?? 0,
          tokenXinfo.decimals,
          tokenYinfo.decimals
        );

        const valueX = tokenXLiq + tokenYLiq / currentPrice;
        const valueY = tokenYLiq + tokenXLiq * currentPrice;

        return {
          ...position,
          tokenX: tokenXinfo,
          tokenY: tokenYinfo,
          tokenXName: tokenXinfo.name,
          tokenYName: tokenYinfo.name,
          tokenXIcon: tokenXIcon,
          tokenYIcon: tokenYIcon,
          fee: +printBigint(BigInt(position.pool_key.fee_tier.fee), PERCENTAGE_SCALE - 2),
          min,
          max,
          tokenXLiq,
          tokenYLiq,
          valueX,
          valueY,
          address,
          id: index,
          isActive: currentPrice >= min && currentPrice <= max,
          tokenXId: tokenXinfo.coinGeckoId
        };
      });

      setDataPosition(positionsMap);
    })();

    return () => {};
  }, []);

  return (
    <div className={styles.positionList}>
      {dataPosition.length ? (
        dataPosition.map((position, key) => {
          return (
            <div className={styles.item} key={`position-list-item-${key}`}>
              <PositionItem position={position} />
            </div>
          );
        })
      ) : (
        <div className={styles.nodata}>
          {theme === 'light' ? <NoData /> : <NoDataDark />}
          <span>No Positions!</span>
        </div>
      )}
    </div>
  );
};

export default PositionList;
