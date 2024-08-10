import { Theme } from '@mui/material/styles/createTheme';
import { colors, typography } from '../theme';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    width: 1122,
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    '& .MuiPagination-ul': {
      flexWrap: 'nowrap',
      margin: '10px 0 10px'
    },

    '& .MuiPaginationItem-icon': {
      color: colors.black.full
    },

    '& .MuiPaginationItem-page': {
      ...typography.heading4,

      color: colors.oraidex.light,
      '&:hover': {
        color: colors.oraidex.lightGrey
      }
    },

    '& .MuiPaginationItem-page:hover': {
      color: colors.oraidex.textGrey
    },

    '& .MuiPaginationItem-ellipsis': {
      color: colors.oraidex.light
    },

    '& .Mui-selected': {
      color: colors.oraidex.greenLinearGradient
    },
    '& .Mui-selected:hover': {
      color: `${colors.oraidex.green} !important`
    },

    '& .MuiPaginationItem-page.Mui-selected': {
      backgroundColor: 'transparent',
      '&:hover': {
        color: colors.oraidex.greenLinearGradient
      }
    },
    '& li:first-of-type button': {
      backgroundColor: colors.oraidex.greenLinearGradient,
      minWidth: 40,
      minHeight: 40,
      opacity: 0.8
    },
    '& li:first-of-type button:hover': {
      opacity: 1
    },

    '& li:last-child button': {
      backgroundColor: colors.oraidex.greenLinearGradient,
      minWidth: 40,
      minHeight: 40,
      opacity: 0.8
    },

    '& li:last-child button:hover': {
      opacity: 1
    },

    '& svg': {
      transform: 'scale(2.2)'
    }
  }
}));
