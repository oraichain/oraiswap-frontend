import React from 'react';
import classNames from 'classnames';
import { theme } from '../theme';
import { useStyles } from './style';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { formatNumbers, showPrefix } from 'pages/Pool-V3/helpers/helper';

interface Iprops {
  percentVolume: number;
  volume: number;
  tvlVolume: number;
  percentTvl: number;
  feesVolume: number;
  percentFees: number;
}

const VolumeBar: React.FC<Iprops> = ({ percentVolume, volume, tvlVolume, percentTvl, feesVolume, percentFees }) => {
  const { classes } = useStyles();

  const isXDown = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Grid container classes={{ container: classes.container }}>
      <Box className={classes.tokenName}>
        <Typography className={classes.tokenHeader}>Volume 24H:</Typography>
        <Typography className={classes.tokenContent}>
          ${formatNumbers()(volume.toString())}
          {showPrefix(volume)}
        </Typography>
        {!isXDown && (
          <Typography
            className={classNames(classes.tokenContent, percentVolume < 0 ? classes.tokenLow : classes.tokenUp)}
          >
            {percentVolume === Infinity
              ? '(+9999%)'
              : percentVolume < 0
              ? `(${percentVolume.toFixed(2)}%)`
              : `(+${percentVolume.toFixed(2)}%)`}
          </Typography>
        )}
      </Box>
      <Box className={classes.tokenName}>
        <Typography className={classes.tokenHeader}>TVL 24H:</Typography>
        <Typography className={classes.tokenContent}>
          ${formatNumbers()(tvlVolume.toString())}
          {showPrefix(tvlVolume)}
        </Typography>
        {!isXDown && (
          <Typography className={classNames(classes.tokenContent, percentTvl < 0 ? classes.tokenLow : classes.tokenUp)}>
            {percentTvl < 0 ? `(${percentTvl.toFixed(2)}%)` : `(+${percentTvl.toFixed(2)}%)`}
          </Typography>
        )}
      </Box>
      <Box className={classes.tokenName}>
        <Typography className={classes.tokenHeader}>Fees 24H:</Typography>
        <Typography className={classes.tokenContent}>
          ${formatNumbers()(feesVolume.toString())}
          {showPrefix(feesVolume)}
        </Typography>
        {!isXDown && (
          <Typography
            className={classNames(classes.tokenContent, percentFees < 0 ? classes.tokenLow : classes.tokenUp)}
          >
            {percentFees === Infinity
              ? '(+9999%)'
              : percentFees < 0
              ? `(${percentFees.toFixed(2)}%)`
              : `(+${percentFees.toFixed(2)}%)`}
          </Typography>
        )}
      </Box>
    </Grid>
  );
};

export default VolumeBar;
