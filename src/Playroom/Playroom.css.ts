import { style, globalStyle } from '@vanilla-extract/css';
import { colorPaletteVars } from './theme.css';

globalStyle('html[data-playroom-dark]', {
  colorScheme: 'dark',
});

globalStyle('body', {
  margin: 0,
});

export const root = style({
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: colorPaletteVars.background.body,
  display: 'flex',
});

export const resizeableContainer_isHidden = style({});

export const resizeableContainer = style({
  // maxWidth: '80vw',
  selectors: {
    [`&${resizeableContainer_isHidden}`]: {
      display: 'none',
    },
  },
});
