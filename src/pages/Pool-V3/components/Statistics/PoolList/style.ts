import { colors, theme } from '../theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    padding: '0 24px',
    borderRadius: '24px',
    backgroundColor: `${colors.oraidex.component} !important`
  },
  pagination: {
    width: '100%',
    padding: '20px 0 10px 0',

    '& div': {
      width: '100%'
    }
  },
  listWrapper: {
    width: '100%',

    [theme.breakpoints.down('md')]: {
      overflowX: 'scroll'
    }
  },
  inner: {
    [theme.breakpoints.down('md')]: {
      minWidth: 576
    }
  }
}));
