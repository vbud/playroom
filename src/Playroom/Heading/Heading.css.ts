import { colorPaletteVars, vars } from '../theme.css';
import { style } from '@vanilla-extract/css';

export const base = style({
  margin: 0,
  fontWeight: vars.font.weight.strong,
  color: colorPaletteVars.foreground.neutral,
  fontFamily: vars.font.family.standard,
});

export const level1 = style({
  fontSize: '36px',
});
export const level2 = style({
  fontSize: '24px',
});
export const level3 = style({
  fontSize: '16px',
});

export const weak = style({
  fontWeight: vars.font.weight.weak,
});
