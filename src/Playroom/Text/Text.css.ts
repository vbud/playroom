import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

export const base = style({
  display: 'block',
});

export const neutral = style({
  color: colorPaletteVars.foreground.neutral,
});

export const critical = style({
  color: colorPaletteVars.foreground.critical,
});

export const xsmall = style({
  font: vars.font.scale.xsmall,
});

export const small = style({
  font: vars.font.scale.small,
});

export const standard = style({
  font: vars.font.scale.standard,
});

export const large = style({
  font: vars.font.scale.large,
});

export const strong = style({
  fontWeight: vars.font.weight.strong,
});

export const truncate = style({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});
