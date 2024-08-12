import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { formatNumbers, PERCENTAGE_SCALE, showPrefix } from 'pages/Pool-V3/helpers/helper';
import React, { FunctionComponent } from 'react';
import { printBigint } from '../../PriceRangePlot/utils';
import { theme } from '../theme';
import { useStyles } from './style';

export enum SortType {
  NAME_ASC,
  NAME_DESC,
  FEE_ASC,
  FEE_DESC,
  VOLUME_ASC,
  VOLUME_DESC,
  TVL_ASC,
  TVL_DESC
  // APY_ASC,
  // APY_DESC
}

interface IProps {
  TVL?: number;
  volume?: number;
  fee?: number;
  displayType: string;
  symbolFrom?: string;
  symbolTo?: string;
  IconFrom?: FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  IconTo?: FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  tokenIndex?: number;
  sortType?: SortType;
  onSort?: (type: SortType) => void;
  hideBottomLine?: boolean;
  // apy?: number
  // apyData?: {
  //   fees: number
  //   accumulatedFarmsAvg: number
  //   accumulatedFarmsSingleTick: number
  // }
}

const PoolListItem: React.FC<IProps> = ({
  fee = 0,
  volume = 0,
  TVL = 0,
  displayType,
  symbolFrom,
  symbolTo,
  IconFrom,
  IconTo,
  tokenIndex,
  sortType,
  onSort,
  hideBottomLine = false
  // apy = 0,
  // apyData = {
  //   fees: 0,
  //   accumulatedFarmsAvg: 0,
  //   accumulatedFarmsSingleTick: 0
  // }
}) => {
  const { classes } = useStyles();

  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Grid>
      {displayType === 'token' ? (
        <Grid
          container
          classes={{ container: classes.container }}
          style={hideBottomLine ? { border: 'none' } : undefined}
        >
          {!isXs ? <Typography>{tokenIndex}</Typography> : null}
          <Grid className={classes.imageContainer}>
            {!isXs && (
              <Box className={classes.iconsWrapper}>
                {/* <img src={iconFrom} alt="Token from" />
                <img src={iconTo} alt="Token to" /> */}
                <IconFrom />
                <IconTo />
              </Box>
            )}
            <Grid className={classes.symbolsContainer}>
              <Typography>
                {symbolFrom}/{symbolTo}
              </Typography>
            </Grid>
          </Grid>
          {/* {!isXs ? (
            <Typography>
              {`${apy > 1000 ? '>1000' : apy.toFixed(2)}%`}
              <Tooltip
                title={
                  <>
                    <Typography className={classes.liquidityTitle}>Pool APY</Typography>
                    <Typography className={classes.liquidityDesc}>
                      Pool fees: {`${apyData.fees > 1000 ? '>1000' : apyData.fees.toFixed(2)}%`}
                      {apyData.accumulatedFarmsAvg > 0 ? (
                        <>
                          <br />+ All farms rewards with single tick position:{' '}
                          {`${
                            apyData.accumulatedFarmsSingleTick > 1000
                              ? '>1000'
                              : apyData.accumulatedFarmsSingleTick.toFixed(2)
                          }%`}
                          <br />
                          (All farms rewards with average position:{' '}
                          {`${
                            apyData.accumulatedFarmsAvg > 1000
                              ? '>1000'
                              : apyData.accumulatedFarmsAvg.toFixed(2)
                          }%`}
                          )
                        </>
                      ) : null}
                    </Typography>
                  </>
                }
                placement='bottom'
                classes={{
                  tooltip: classes.liquidityTooltip
                }}>
                <span className={classes.activeLiquidityIcon}>i</span>
              </Tooltip>
            </Typography>
          ) : null} */}
          <Typography>{+printBigint(BigInt(fee), PERCENTAGE_SCALE - 2)}%</Typography>
          <Typography>{`$${formatNumbers()(volume.toString())}${showPrefix(volume)}`}</Typography>
          <Typography>{`$${formatNumbers()(TVL.toString())}${showPrefix(TVL)}`}</Typography>
        </Grid>
      ) : (
        <Grid container classes={{ container: classes.container, root: classes.header }}>
          {!isXs && (
            <Typography style={{ lineHeight: '11px' }}>
              N<sup>o</sup>
            </Typography>
          )}
          <Typography
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (sortType === SortType.NAME_ASC) {
                onSort?.(SortType.NAME_DESC);
              } else {
                onSort?.(SortType.NAME_ASC);
              }
            }}
          >
            Name
            {sortType === SortType.NAME_ASC ? (
              <ArrowDropUpIcon className={classes.icon} />
            ) : sortType === SortType.NAME_DESC ? (
              <ArrowDropDownIcon className={classes.icon} />
            ) : null}
          </Typography>
          {/* {!isXs ? (
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (sortType === SortType.APY_DESC) {
                  onSort?.(SortType.APY_ASC)
                } else {
                  onSort?.(SortType.APY_DESC)
                }
              }}>
              APY
              {sortType === SortType.APY_ASC ? (
                <ArrowDropUpIcon className={classes.icon} />
              ) : sortType === SortType.APY_DESC ? (
                <ArrowDropDownIcon className={classes.icon} />
              ) : null}
            </Typography>
          ) : null} */}
          <Typography
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (sortType === SortType.FEE_ASC) {
                onSort?.(SortType.FEE_DESC);
              } else {
                onSort?.(SortType.FEE_ASC);
              }
            }}
          >
            Fee
            {sortType === SortType.FEE_ASC ? (
              <ArrowDropUpIcon className={classes.icon} />
            ) : sortType === SortType.FEE_DESC ? (
              <ArrowDropDownIcon className={classes.icon} />
            ) : null}
          </Typography>
          <Typography
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (sortType === SortType.VOLUME_DESC) {
                onSort?.(SortType.VOLUME_ASC);
              } else {
                onSort?.(SortType.VOLUME_DESC);
              }
            }}
          >
            Volume 24H
            {sortType === SortType.VOLUME_ASC ? (
              <ArrowDropUpIcon className={classes.icon} />
            ) : sortType === SortType.VOLUME_DESC ? (
              <ArrowDropDownIcon className={classes.icon} />
            ) : null}
          </Typography>
          <Typography
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (sortType === SortType.TVL_DESC) {
                onSort?.(SortType.TVL_ASC);
              } else {
                onSort?.(SortType.TVL_DESC);
              }
            }}
          >
            TVL
            {sortType === SortType.TVL_ASC ? (
              <ArrowDropUpIcon className={classes.icon} />
            ) : sortType === SortType.TVL_DESC ? (
              <ArrowDropDownIcon className={classes.icon} />
            ) : null}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default PoolListItem;
