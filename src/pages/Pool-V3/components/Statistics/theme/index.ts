// theme.ts
import { createTheme } from '@mui/material/styles';

export const colors = {
  black: {
    full: '#000000',
    background: '#1B1C2A', // v2.0
    light: '#090B1B',
    kinda: '#1A1A1A',
    greyish: '#081323',
    cinder: '#0E0C12', // v2.0 background color
    controls: '#44424E', // v2.0 controls background color
    header: '#1A1D28', // v2.0 header
    card: '#28242E' // v2.0 card color
  },
  blue: {
    accent: '#072E5A',
    subtle: 'rgba(7,46,90,0.1)',
    deepAccent: 'rgba(7,46,90,0.5)',
    base: '#0B2545',
    light: '#66AFF5',
    neon: '#08F7FE',
    astel: '#48ADF1',
    bastille: '#1E1A23',
    charade: '#272735', // v2.0 component
    deep: '#4B5983'
  },
  green: {
    main: '#00F9BB',
    // button: '#40BFA0',
    button: '#aee67f',
    hover: 'rgba(0,249,187,0.15)',
    pastel: '#8AF7E4',
    snackbar: '#4BB724',
    shine: '#AEE57E'
  },
  white: {
    main: '#FFFFFF'
  },
  red: {
    main: '#EB5757',
    error: '#C52727',
    neon: '#FF2079',
    pinkish: '#FE53BB',
    snackbar: '#DE3232'
  },
  yellow: {
    neon: '#F5D300'
  },
  navy: {
    // colors with suffix "2" on figma
    background: '#0C0D2C',
    dark: '#0E0E2A',
    component: '#1D1D49',
    navBar: 'rgba(249, 249, 251, 0.76)',
    navButton: '#3A3A85',
    grey: '#A3A8CE',
    lightGrey: '#DADCF1',
    veryLightGrey: '#FBFBFB',
    button: '#655ED4',
    info: '#6261A3',
    darkGrey: '#292956',
    tooltip: '#5B54CE',
    '5756B3': '#5756B3',
    '807ADC': '#807ADC'
  },
  oraidex: {
    neutralText: '#979995',
    neutralTextLight: '#EFEFEF',
    border: '#595B57',
    warning: '#EFD063',
    pink: '#EF84F5',
    violet: '#9C3EBD',
    green: '#2EE09A',
    dark: '#040B22',
    newDark: '#232521',
    component: '#181a17',
    componentBcg: '#232521',
    light: '#494949',
    lightHover: '#A9B6BF',
    black: '#232521',
    textGrey: '#A9B6BF',
    lightGrey: '#A9B6BF',
    text: '#F7F7F7',
    Error: '#FB555F',
    greenLinearGradient: '#aee67f',
    greenLinearGradientOpacity: '#aee67f',
    pinkLinearGradient: 'linear-gradient(180deg, #EF84F5 0%, #9C3EBD 100%)',
    pinkLinearGradientOpacity: 'linear-gradient(180deg, rgba(239, 132, 245, 0.8) 0%, rgba(156, 62, 189, 0.8) 100%)',
    yellow: '#EFD063',
    blue: '#43BBFF'
  }
};

export const typography = {
  heading1: {
    fontSize: 32,
    lineHeight: '36px',
    fontWeight: 700
  },
  heading2: {
    fontSize: 28,
    lineHeight: '32px',
    fontWeight: 700
  },
  heading3: {
    fontSize: 24,
    lineHeight: '28px',
    fontWeight: 700
  },
  heading4: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400
  },
  heading5: {
    fontSize: 18,
    lineHeight: 1.5,
    fontWeight: 500
  },
  body1: {
    fontSize: 16,
    lineHeight: '20px',
    fontWeight: 500
  },
  body2: {
    fontSize: 16,
    lineHeight: '20px',
    fontWeight: 400
  },
  body3: {
    fontSize: 20,
    lineHeight: '24px',
    fontWeight: 400
  },
  body4: {
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 400
  },
  caption1: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 700
  },
  caption2: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400
  },
  caption3: {
    fontSize: 12,
    lineHeight: '15px',
    fontWeight: 700
  },
  caption4: {
    fontSize: 12,
    lineHeight: '16px',
    fontWeight: 400
  },
  tiny1: {
    fontSize: 10,
    lineHeight: '13px',
    fontWeight: 700
  },
  tiny2: {
    fontSize: 10,
    lineHeight: '13px',
    fontWeight: 400
  }
};

// Create a theme instance.
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.navy.button, // v2.0
      contrastText: colors.navy.veryLightGrey // v2.0
    },
    secondary: {
      main: colors.green.button,
      contrastText: colors.navy.background
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#595B57'
    },
    error: {
      main: '#E15757'
    }
  },
  typography: {
    fontWeightRegular: 500,
    h1: typography.heading1,
    h2: typography.heading2,
    h3: typography.heading3,
    h4: typography.heading4,
    body1: typography.body1,
    body2: typography.body2,
    body3: typography.body3,
    caption: typography.caption1
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
  // overrides: {
  //   MuiInputBase: {
  //     input: {
  //       MozAppearance: "textfield",
  //       "&::-webkit-clear-button, &::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
  //         {
  //           display: "none",
  //         },
  //     },
  //   },
  // },
});
