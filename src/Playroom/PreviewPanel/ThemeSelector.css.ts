import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

export const root = style({
  position: 'relative',
});

export const label = style({
  userSelect: 'none',
  pointerEvents: 'none',
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
});

export const column = style({
  display: 'block',
  minWidth: 0,
});

export const minColumn = style({
  flexShrink: 0,
});

export const select = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  opacity: 0,
  font: vars.font.family.standard,
});

export const focusOverlay = style({
  position: 'absolute',
  pointerEvents: 'none',
  borderRadius: vars.radii.large,
  opacity: 0,
  boxShadow: colorPaletteVars.shadows.focus,
  top: -4,
  left: -4,
  right: -4,
  bottom: -4,
  selectors: {
    [`${select}:focus:not(:hover) ~ &`]: {
      opacity: 1,
    },
  },
});
