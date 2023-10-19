import { TokenItemType } from '@oraichain/oraidex-common';
import NoDataSvg from 'assets/images/NoDataPool.svg';
import NoDataLightSvg from 'assets/images/NoDataPoolLight.svg';
import useTheme from 'hooks/useTheme';
import { PoolTableData } from 'pages/Pools/indexV3';
import { useState } from 'react';
import { AddLiquidityModal } from '../AddLiquidityModal';
import styles from './ListPoolModule.module.scss';
import { PoolMobileItem } from '../ItemPoolMobile';

type ListPoolProps = {
  poolTableData: PoolTableData[];
  generateIcon: (baseToken: TokenItemType, quoteToken: TokenItemType) => JSX.Element;
};
export const ListPoolsMobile: React.FC<ListPoolProps> = ({ poolTableData, generateIcon }) => {
  const [pairDenomsDeposit, setPairDenomsDeposit] = useState('');
  const theme = useTheme();
  const renderListPool =
    poolTableData.length > 0 ? (
      poolTableData.map((pool) => (
        <PoolMobileItem pool={pool} setPairDenomsDeposit={setPairDenomsDeposit} generateIcon={generateIcon} />
      ))
    ) : (
      <div className={styles.no_data}>
        <img src={theme === 'light' ? NoDataLightSvg : NoDataSvg} alt="nodata" />
        <span>No data</span>
      </div>
    );

  return (
    <div className={styles.listpools}>
      <div className={styles.listpools_list}>{renderListPool}</div>
      {pairDenomsDeposit && (
        <AddLiquidityModal
          isOpen={!!pairDenomsDeposit}
          close={() => setPairDenomsDeposit('')}
          pairDenoms={pairDenomsDeposit}
        />
      )}
    </div>
  );
};
