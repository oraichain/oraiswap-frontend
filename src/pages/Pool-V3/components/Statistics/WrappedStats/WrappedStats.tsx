import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { EmptyPlaceholder } from '../EmptyPlaceholder/EmptyPlaceholder';
import useStyles from './styles';
import LoadingBox from 'components/LoadingBox';
import Liquidity from '../Liquidity/Liquidity';
import PoolList from '../PoolList/PoolList';
import TokensList from '../TokensList/TokensList';
import Volume from '../Volume/Volume';
import useGetStatistic from '../hooks/useGetStatistic';
import VolumeBar from '../volumeBar/VolumeBar';
import { getPoolDayDataV3 } from 'rest/graphClient';
import { useGetPoolDayData } from './useGetPoolDayData';

export const WrappedStats: React.FC = () => {
  const { classes } = useStyles();
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [stats, setStats] = useState({
    volume24: {
      value: 0,
      change: 0
    },
    tvl24: {
      value: 0,
      change: 0
    },
    fees24: {
      value: 0,
      change: 0
    },
    tokensData: [],
    poolsData: [],
    volumePlot: [],
    liquidityPlot: []
  });
  const { getStats } = useGetStatistic();
  const { liquidityPlotData, volumePlotData, isLoadingPoolsDayData, volume24h, tvl24h, fees24h } = useGetPoolDayData();

  useEffect(() => {
    getPoolDayDataV3();
  }, []);

  const {
    // volume24: volume24h,
    // tvl24: tvl24h,
    // fees24: fees24h,
    tokensData,
    poolsData
    // volumePlot: volumePlotData,
    // liquidityPlot: liquidityPlotData
  } = stats;

  useEffect(() => {
    (async () => {
      setIsLoadingStats(true);

      

      const data = await getStats();

      if (data) {
        setStats(data);
      }
      setIsLoadingStats(false);
    })();
  }, []);

  // isLoadingStats ? (
  //   <img src={loader} className={classes.loading} alt="Loading" />
  // ) :
  console.log({ volumePlotData, liquidityPlotData });

  return (
    <Grid container className={classes.wrapper} direction="column">
      <LoadingBox loading={isLoadingStats} styles={{ minHeight: '60vh', height: 'fit-content' }}>
        {!isLoadingStats && liquidityPlotData.length === 0 ? (
          <Grid container direction="column" alignItems="center">
            <EmptyPlaceholder desc={'We have not started collecting statistics yet'} />
          </Grid>
        ) : (
          !isLoadingStats && (
            <>
              <Typography className={classes.subheader}>Overview</Typography>
              <Grid container className={classes.plotsRow} wrap="nowrap">
                <Volume
                  volume={volume24h.value}
                  percentVolume={volume24h.change}
                  data={volumePlotData}
                  className={classes.plot}
                />
                <Liquidity
                  liquidityVolume={tvl24h.value}
                  liquidityPercent={tvl24h.change}
                  data={liquidityPlotData}
                  className={classes.plot}
                />
              </Grid>
              <Grid className={classes.row}>
                <VolumeBar
                  volume={volume24h.value}
                  percentVolume={volume24h.change}
                  tvlVolume={tvl24h.value}
                  percentTvl={tvl24h.change}
                  feesVolume={fees24h.value}
                  percentFees={fees24h.change}
                />
              </Grid>
              <Typography className={classes.subheader}>Top tokens</Typography>
              <Grid container className={classes.row}>
                <TokensList
                  data={tokensData.map((tokenData) => ({
                    icon: tokenData.Icon,
                    name: tokenData.tokenInfo.name,
                    symbol: tokenData.tokenInfo.name,
                    price: tokenData.price,
                    priceChange: tokenData.priceChange,
                    volume: tokenData.volume24,
                    TVL: tokenData.tvl
                  }))}
                />
              </Grid>
              <Typography className={classes.subheader}>Top pools</Typography>
              <PoolList
                data={poolsData.map((poolData) => ({
                  symbolFrom: poolData.tokenXinfo.name,
                  symbolTo: poolData.tokenYinfo.name,
                  iconFrom: poolData.FromTokenIcon,
                  iconTo: poolData.ToTokenIcon,
                  volume: poolData.volume24,
                  TVL: poolData.tvl,
                  fee: poolData.fee,
                  apy: poolData.apy
                  // apyData: {
                  //   fees: poolData.apy,
                  //   accumulatedFarmsSingleTick: 0,
                  //   accumulatedFarmsAvg: 0
                  // },
                  // apy:
                  //   poolData.apy + (accumulatedSingleTickAPY?.[poolData.poolAddress.toString()] ?? 0),
                  // apyData: {
                  //   fees: poolData.apy,
                  //   accumulatedFarmsSingleTick:
                  //     accumulatedSingleTickAPY?.[poolData.poolAddress.toString()] ?? 0,
                  //   accumulatedFarmsAvg: accumulatedAverageAPY?.[poolData.poolAddress.toString()] ?? 0
                  // }
                }))}
              />
            </>
          )
        )}
      </LoadingBox>
    </Grid>
  );
};

export default WrappedStats;
