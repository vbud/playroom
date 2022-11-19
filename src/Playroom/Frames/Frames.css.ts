import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

export const root = style([
  {
    height: '100%',
    width: '100%',
    whiteSpace: 'nowrap',
    display: 'flex',
    boxSizing: 'border-box',
    padding: vars.space.gutter,
    paddingRight: 0,
    textAlign: 'center',
    overflowX: 'auto',
    overflowY: 'hidden',
    // // Simulate centering when fewer frames than viewport width.
    '::before': {
      content: '""',
      flex: 1,
    },
    '::after': {
      content: '""',
      flex: 1,
    },
  },
]);

export const frameContainer = style({
  position: 'relative',
  height: '100%',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  paddingRight: vars.space.gutter,
});

export const frame = style({
  position: 'relative',
  height: '100%',
  border: 0,
  flexGrow: 1,
});

export const frameBorder = style({
  position: 'absolute',
  inset: 0,
  boxShadow: colorPaletteVars.shadows.small,
  pointerEvents: 'none',
  selectors: {
    [`&:not(:hover)`]: {
      opacity: 0.8,
    },
  },
});

const frameNameHeight = '30px';
export const frameName = style({
  display: 'flex',
  alignItems: 'center',
  flex: `0 0 ${frameNameHeight}`,
  height: frameNameHeight,
  marginBottom: '-10px',
  selectors: {
    [`${frameContainer}:not(:hover) &`]: {
      opacity: 0.3,
    },
  },
});
