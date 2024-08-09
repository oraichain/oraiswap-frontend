import { Theme } from '@mui/material';
import { typography, colors } from '../theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '5% 45% 15% 20% auto',
    // gridTemplateColumns: 'repeat(5, 1fr)',
    padding: '18px 0 ',
    backgroundColor: colors.oraidex.component,
    borderBottom: `1px solid ${colors.oraidex.light}`,
    whiteSpace: 'nowrap',

    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '5% 35% 15% 17.5% 16.5% 15%',
      '& p': {
        ...typography.caption2
      }
    },

    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '28% 15% 30% 25%'
    }
  },

  tokenList: {
    color: colors.white.main,
    '& p': {
      ...typography.heading4
    },

    [theme.breakpoints.down('sm')]: {
      '& p': {
        ...typography.caption1
      }
    }
  },

  header: {
    '& p': {
      ...typography.heading4,
      fontWeight: 400,
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center'
    },
    [theme.breakpoints.down('sm')]: {
      '& p': {
        ...typography.caption2
      }
    }
  },

  tokenName: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 5,

    '& p': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    },

    '& svg': {
      minWidth: 28,
      maxWidth: 28,
      height: 28,
      marginRight: 8,
      borderRadius: '50%'
    }
  },

  tokenSymbol: {
    color: colors.oraidex.textGrey,
    fontWeight: 400
  },
  icon: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: -4
    }
  }
}));
