import { Theme } from '@mui/material';
import { typography, colors } from '../theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  wrapper: {
    minHeight: '100%'
  },
  subheader: {
    ...typography.heading4,
    color: colors.white.main,
    marginBottom: 16
  },
  plotsRow: {
    marginBottom: 24,
    flexDirection: 'row',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  row: {
    marginBottom: 16
  },
  loading: {
    width: 150,
    height: 150,
    margin: 'auto'
  },
  plot: {
    width: '100%',

    '&:first-child': {
      marginRight: 24
    },

    [theme.breakpoints.down('sm')]: {
      width: '100%',

      '&:first-child': {
        marginRight: 0,
        marginBottom: 24
      }
    }
  }
}));

export default useStyles;
