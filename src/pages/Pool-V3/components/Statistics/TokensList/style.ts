import { colors, theme } from '../theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    padding: '0 24px',
    borderRadius: '24px',
    backgroundColor: colors.oraidex.component
  },
  pagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBlock: 10
  },
  listWrapper: {
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

export default useStyles;
