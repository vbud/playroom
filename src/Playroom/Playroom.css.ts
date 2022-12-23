import { style, globalStyle } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from './theme.css';

globalStyle('html[data-playroom-dark]', {
  colorScheme: 'dark',
});

globalStyle('body', {
  margin: 0,
});

export const root = style({
  height: '100vh',
  width: '100vw',
  backgroundColor: colorPaletteVars.background.body,
  display: 'flex',
  flexDirection: 'column',
});

export const main = style({
  flexGrow: 1,
  overflow: 'hidden',
  backgroundColor: colorPaletteVars.background.body,
  display: 'flex',
});

export const resizeableContainer_isHidden = style({});

export const resizeableContainer = style({
  display: 'flex',
  selectors: {
    [`&${resizeableContainer_isHidden}`]: {
      display: 'none',
    },
  },
});

export const editorContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  backgroundColor: colorPaletteVars.background.surface,
  borderRight: `1px solid ${colorPaletteVars.border.standard}`,
});

export const emptyCodeEditor = style({
  flexGrow: 1,
  textAlign: 'center',
  padding: vars.space.large,
});
