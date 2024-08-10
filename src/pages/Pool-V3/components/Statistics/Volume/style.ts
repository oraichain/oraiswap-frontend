import { typography, colors } from '../theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    backgroundColor: colors.oraidex.component,
    borderRadius: 24,
    padding: 24,
    boxSizing: 'border-box'
  },
  volumeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontWeight: 'normal'
  },
  volumeHeader: {
    color: colors.oraidex.textGrey,
    ...typography.body2
  },
  volumePercentContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  volumePercentHeader: {
    ...typography.heading1,
    letterSpacing: '-0.03em',
    color: colors.white.main,
    marginTop: 5
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
  barContainer: {
    height: 200,
    display: 'flex'
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
    color: colors.oraidex.pink,
    textAlign: 'center'
  }
}));
