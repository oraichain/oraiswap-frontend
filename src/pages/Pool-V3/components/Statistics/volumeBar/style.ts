import { colors, typography, theme } from '../theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    width: '100%',
    backgroundColor: colors.oraidex.component,
    borderRadius: 22,
    padding: 20,
    display: 'flex',
    whiteSpace: 'nowrap',
    justifyContent: 'space-between'
  },

  tokenName: {
    display: 'flex',
    whiteSpace: 'nowrap',

    [theme.breakpoints.down('sm')]: {
      '& p': {
        ...typography.caption2
      }
    },

    [theme.breakpoints.down('xs')]: {
      '& p': {
        ...typography.caption4
      }
    }
  },

  tokenHeader: {
    ...typography.heading4,
    color: colors.oraidex.textGrey
  },

  tokenContent: {
    ...typography.heading4,
    color: colors.white.main,
    padding: '0 0 0 5px'
  },

  tokenLow: {
    color: colors.oraidex.Error,
    fontWeight: 400
  },

  tokenUp: {
    color: colors.oraidex.green,
    fontWeight: 400
  }
}));
