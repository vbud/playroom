import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, colorPaletteVars } from './sprinkles.css';
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

export const root = sprinkles({
  height: 'viewport',
  width: 'viewport',
});

export const previewContainer = sprinkles({
  position: 'absolute',
  inset: 0,
});

export const resizeableContainer = style([
  sprinkles({
    bottom: 0,
    right: 0,
    overflow: 'hidden',
    boxShadow: 'small',
    transition: 'slow',
  }),
  // @ts-expect-error Shouldnt need to but types do not like `!important`
  {
    position: 'absolute !important', // override re-resizeable's inline style
  },
]);

export const resizeableContainer_isHidden = style({});

export const resizeableContainer_isRight = style([
  sprinkles({
    top: 0,
  }),
  {
    maxWidth: '90vw',
    selectors: {
      [`&${resizeableContainer_isHidden}`]: {
        transform: 'translateX(100%)',
      },
    },
  },
]);

export const resizeableContainer_isBottom = style([
  sprinkles({
    left: 0,
  }),
  {
    maxHeight: '90vh',
    selectors: {
      [`&${resizeableContainer_isHidden}`]: {
        transform: 'translateY(100%)',
      },
    },
  },
]);

export const editorContainer = style([
  sprinkles({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  }),
  {
    right: toolbarItemSize,
  },
]);

export const toolbarContainer = sprinkles({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
});
