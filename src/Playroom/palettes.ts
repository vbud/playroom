import { transparentize, mix, darken } from 'polished';

const lightPalette = {
  blue0: '#e5f3ff',
  blue1: '#0088ff',
  blue2: '#005ad2',
  blue3: '#00439c',
  blue4: '#040080',
  green1: '#c5f5e9',
  green2: '#1da584',
  red1: '#fee1e9',
  red2: '#e52b50',
  red3: '#cd193d',
  purple: '#75438a',
  white: '#fff',
  gray1: '#f4f4f4',
  gray2: '#e8e8e8',
  gray3: '#a7a7a7',
  gray4: '#767676',
  gray5: '#515151',
  gray6: '#1e1e1e',
  black: '#000',
};

export const light = {
  code: {
    text: lightPalette.black,
    tag: lightPalette.blue4,
    attribute: lightPalette.blue2,
    string: lightPalette.blue3,
    atom: lightPalette.blue3,
    variable: lightPalette.blue1,
    number: lightPalette.purple,
  },
  foreground: {
    neutralSoft: lightPalette.gray3,
    neutral: lightPalette.gray5,
    neutralInverted: lightPalette.white,
    secondary: lightPalette.gray3,
    critical: lightPalette.red3,
    accent: lightPalette.blue2,
    positive: lightPalette.green2,
  },
  background: {
    transparent: 'rgba(0, 0, 0, .05)',
    accent: lightPalette.blue2,
    positive: lightPalette.green1,
    critical: lightPalette.red1,
    neutral: lightPalette.gray6,
    surface: lightPalette.white,
    body: lightPalette.gray1,
    selection: lightPalette.blue0,
  },
  border: {
    standard: lightPalette.gray2,
  },
  shadows: {
    small: '0 2px 8px rgba(18, 21, 26, 0.3)',
    focus: `0 0 0 5px ${lightPalette.blue0}`,
  },
};

const darkPalette = {
  grey: {
    900: '#0f131b',
    800: '#1c2230',
    700: '#2d3648',
    600: '#3d4b63',
    500: '#5b6881',
    400: '#828ea4',
    300: '#abb3c1',
    200: '#d2d7de',
    100: '#e8ecf0',
    50: '#f6f8fa',
  },
  mint: {
    900: '#033720',
    800: '#0a5334',
    700: '#13774f',
    600: '#18986a',
    500: '#28b888',
    400: '#57cea9',
    300: '#88dec5',
    200: '#beeddf',
    100: '#e1f7f1',
    50: '#f3fdfa',
  },
  red: {
    900: '#730706',
    800: '#941110',
    700: '#b71f1f',
    600: '#db2d2d',
    500: '#f94344',
    400: '#fa6b6c',
    300: '#fb999a',
    200: '#fdc8c8',
    100: '#ffe3e2',
    50: '#fef2f2',
  },
  purple: {
    900: '#1d0a63',
    800: '#341b85',
    700: '#502eaa',
    600: '#6a40cc',
    500: '#8b5ceb',
    400: '#aa83f2',
    300: '#c6aaf5',
    200: '#e1d1f9',
    100: '#f1e7fc',
    50: '#f9f5fe',
  },
  blue: {
    900: '#052253',
    800: '#103975',
    700: '#1e549b',
    600: '#296fc0',
    500: '#3e8fe0',
    400: '#68aeea',
    300: '#97c8f1',
    200: '#c8e1f7',
    100: '#e2f1fb',
    50: '#f3faff',
  },
};

export const dark = {
  code: {
    text: darkPalette.grey[50],
    tag: darkPalette.blue[200],
    attribute: darkPalette.blue[400],
    string: darkPalette.blue[300],
    atom: darkPalette.blue[300],
    variable: darkPalette.blue[500],
    number: darkPalette.purple[400],
  },
  foreground: {
    neutralSoft: darkPalette.grey[600],
    neutral: darkPalette.grey[50],
    neutralInverted: lightPalette.black,
    secondary: darkPalette.grey[400],
    critical: darkPalette.red[400],
    accent: darkPalette.blue[500],
    positive: darkPalette.mint[500],
  },
  background: {
    transparent: 'rgba(0, 0, 0, .15)',
    accent: darkPalette.blue[500],
    positive: mix(0.6, darkPalette.grey[900], darkPalette.mint[500]),
    critical: mix(0.7, darkPalette.grey[900], darkPalette.red[600]),
    neutral: darkPalette.grey[800],
    surface: darkPalette.grey[900],
    body: darken(0.03, darkPalette.grey[900]),
    selection: transparentize(0.7, darkPalette.blue[600]),
  },
  border: {
    standard: darkPalette.grey[800],
  },
  shadows: {
    small: `0 0 10px -2px ${darkPalette.grey[700]}`,
    focus: `0 0 0 5px ${transparentize(0.6, darkPalette.blue[400])}`,
  },
};
