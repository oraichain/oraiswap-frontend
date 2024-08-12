import { typography, colors } from '../theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    backgroundColor: colors.oraidex.component,
    color: 'white',
    borderRadius: 24,
    paddingBlock: 24,
    boxSizing: 'border-box'
  },
  liquidityContainer: {
    dispaly: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontWeight: 'normal',
    marginLeft: 24
  },

  liquidityHeader: {
    color: colors.oraidex.textGrey,
    ...typography.body2
  },

  volumeLiquidityHeader: {
    ...typography.heading1,
    letterSpacing: '-0.03em',
    marginTop: 5
  },

  barContainer: {
    height: 200,
    display: 'flex'
  },

  volumePercentHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  volumeStatusContainer: {
    marginLeft: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 'auto'
  },
  volumeStatusColor: {
    height: 30,
    minWidth: 'auto',
    padding: '5px 15px 5px 15px',
    borderRadius: 6
  },

  volumeStatusHeader: {
    ...typography.body1,
    filter: 'brightness(1.2)'
  },
  volumeLow: {
    color: colors.oraidex.Error
  },

  backgroundVolumeLow: {
    backgroundColor: 'rgba(251,85,95,0.2)'
  },

  backgroundVolumeUp: {
    backgroundColor: 'rgba(46, 224, 149,0.2)'
  },

  volumeUp: {
    color: colors.oraidex.green
  },

  LineKeys: {
    marginLeft: 10,
    display: 'flex',
    width: '100%'
  },

  keyPTag: {
    width: '100%',
    color: colors.oraidex.textGrey,
    ...typography.caption4
  },
  tooltip: {
    background: colors.oraidex.component,
    border: `1px solid ${colors.oraidex.lightGrey}`,
    borderRadius: 5,
    width: 100,
    padding: 5
  },
  tooltipDate: {
    ...typography.caption4,
    color: colors.white.main,
    textAlign: 'center'
  },
  tooltipValue: {
    ...typography.caption3,
    color: colors.oraidex.green,
    textAlign: 'center'
  }
}));
