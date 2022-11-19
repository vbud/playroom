import { style, globalStyle } from '@vanilla-extract/css';
import { colorPaletteVars } from './theme.css';
import { toolbarItemSize } from './ToolbarItem/ToolbarItem.css';

globalStyle('html', {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: colorPaletteVars.background.body,
});

globalStyle('html[data-playroom-dark]', {
  colorScheme: 'dark',
});

globalStyle('body', {
  margin: 0,
});

export const root = style({
  height: '100vh',
  width: '100vw',
});

export const previewContainer = style({
  position: 'absolute',
  inset: 0,
});

export const resizeableContainer = style({
  // @ts-expect-error types do not like `!important`
  position: 'absolute !important', // override re-resizeable's inline style
  bottom: 0,
  left: 0,
  overflow: 'hidden',
  boxShadow: colorPaletteVars.shadows.small,
});

export const resizeableContainer_isHidden = style({});

export const resizeableContainer_isLeft = style({
  top: 0,
  maxWidth: '90vw',
  selectors: {
    [`&${resizeableContainer_isHidden}`]: {
      transform: 'translateX(-100%)',
    },
  },
});

export const editorContainer = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: toolbarItemSize,
});

export const toolbarContainer = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
});
