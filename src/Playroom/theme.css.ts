import { createGlobalTheme, createThemeContract } from '@vanilla-extract/css';
import { dark, light } from './palettes';

const fontFamily = 'Helvetica, arial, sans-serif';
export const vars = createGlobalTheme(':root', {
  font: {
    family: {
      standard: fontFamily,
      code: 'Source Code Pro, Firacode, Hasklig, Menlo, monospace',
    },
    scale: {
      xsmall: `normal 10px ${fontFamily}`,
      small: `normal 12px ${fontFamily}`,
      standard: `normal 14px ${fontFamily}`,
      large: `normal 16px/1.3em ${fontFamily}`,
    },
    weight: {
      weak: '100',
      strong: '700',
    },
  },
  grid: '4px',
  radii: {
    small: '2px',
    medium: '4px',
    large: '6px',
    full: '100%',
  },
  codeGutterSize: '70px',
  touchableSize: '44px',
  space: {
    none: '0',
    xxsmall: '2px',
    xsmall: '4px',
    medium: '6px',
    large: '12px',
    xlarge: '16px',
    xxlarge: '20px',
    gutter: '24px',
  },
});

export const colorPaletteVars = createThemeContract({
  code: {
    text: null,
    tag: null,
    attribute: null,
    string: null,
    atom: null,
    variable: null,
    number: null,
  },
  foreground: {
    neutralSoft: null,
    neutral: null,
    neutralInverted: null,
    secondary: null,
    critical: null,
    accent: null,
    positive: null,
  },
  background: {
    transparent: null,
    accent: null,
    positive: null,
    critical: null,
    neutral: null,
    surface: null,
    body: null,
    selection: null,
  },
  border: {
    standard: null,
  },
  shadows: {
    small: null,
    focus: null,
  },
});

createGlobalTheme(':root', colorPaletteVars, light);
createGlobalTheme(':root[data-playroom-dark]', colorPaletteVars, dark);
