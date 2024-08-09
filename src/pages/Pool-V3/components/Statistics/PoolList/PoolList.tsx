import React, { useMemo, useEffect, FunctionComponent } from 'react';

import PoolListItem, { SortType } from '../PoolListItem/PoolListItem';
import { useStyles } from './style';
import { Grid } from '@mui/material';
import { PaginationList } from '../PaginationList/PaginationList';

interface PoolListInterface {
  data: Array<{
    symbolFrom: string;
    symbolTo: string;
    iconFrom: FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string;
      }
    >;
    iconTo: FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string;
      }
    >;
    volume: number;
    TVL: number;
    fee: number;
    // apy: number
    // apyData: {
    //   fees: number
    //   accumulatedFarmsAvg: number
    //   accumulatedFarmsSingleTick: number
    // }
  }>;
}

const PoolList: React.FC<PoolListInterface> = ({ data }) => {
  const { classes } = useStyles();
  const [page, setPage] = React.useState(1);
  const [sortType, setSortType] = React.useState(SortType.VOLUME_DESC);

  const sortedData = useMemo(() => {
    switch (sortType) {
      case SortType.NAME_ASC:
        return data.sort((a, b) => `${a.symbolFrom}/${a.symbolTo}`.localeCompare(`${b.symbolFrom}/${b.symbolTo}`));
      case SortType.NAME_DESC:
        return data.sort((a, b) => `${b.symbolFrom}/${b.symbolTo}`.localeCompare(`${a.symbolFrom}/${a.symbolTo}`));
      case SortType.FEE_ASC:
        return data.sort((a, b) => a.fee - b.fee);
      case SortType.FEE_DESC:
        return data.sort((a, b) => b.fee - a.fee);
      case SortType.VOLUME_ASC:
        return data.sort((a, b) => (a.volume === b.volume ? a.TVL - b.TVL : a.volume - b.volume));
      case SortType.VOLUME_DESC:
        return data.sort((a, b) => (a.volume === b.volume ? b.TVL - a.TVL : b.volume - a.volume));
      case SortType.TVL_ASC:
        return data.sort((a, b) => (a.TVL === b.TVL ? a.volume - b.volume : a.TVL - b.TVL));
      case SortType.TVL_DESC:
        return data.sort((a, b) => (a.TVL === b.TVL ? b.volume - a.volume : b.TVL - a.TVL));
      // case SortType.APY_ASC:
      //   return data.sort((a, b) => a.apy - b.apy)
      // case SortType.APY_DESC:
      //   return data.sort((a, b) => b.apy - a.apy)
    }
  }, [data, sortType]);

  useEffect(() => {
    setPage(1);
  }, [data]);

  const handleChangePagination = (currentPage: number) => setPage(currentPage);

  const paginator = (currentPage: number) => {
    const page = currentPage || 1;
    const perPage = 10;
    const offest = (page - 1) * perPage;

    return sortedData.slice(offest).slice(0, perPage);
  };

  const pages = Math.ceil(data.length / 10);

  return (
    <Grid container direction="column" classes={{ root: classes.container }}>
      <div className={classes.listWrapper}>
        <div className={classes.inner}>
          <PoolListItem displayType="header" onSort={setSortType} sortType={sortType} />
          {paginator(page).map((element, index) => (
            <PoolListItem
              displayType="token"
              tokenIndex={index + 1 + (page - 1) * 10}
              symbolFrom={element.symbolFrom}
              symbolTo={element.symbolTo}
              IconFrom={element.iconFrom}
              IconTo={element.iconTo}
              volume={element.volume}
              TVL={element.TVL}
              fee={element.fee}
              hideBottomLine={pages === 1 && index + 1 === data.length}
              // apy={element.apy}
              // apyData={element.apyData}
              key={index}
            />
          ))}
        </div>
      </div>
      {pages > 1 ? (
        <Grid className={classes.pagination}>
          <PaginationList pages={pages} defaultPage={1} handleChangePage={handleChangePagination} variant="flex-end" />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default PoolList;
