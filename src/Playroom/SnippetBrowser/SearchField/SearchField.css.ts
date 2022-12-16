import { colorPaletteVars, vars } from '../../theme.css';
import { style } from '@vanilla-extract/css';

export const field = style({
  font: vars.font.scale.large,
  border: 0,
  width: '100%',
  padding: `0 ${vars.space.xlarge}`,
  color: colorPaletteVars.foreground.neutral,
  height: vars.touchableSize,
  background: colorPaletteVars.background.surface,
  ':focus': {
    outline: 'none',
  },
  '::placeholder': {
    color: colorPaletteVars.foreground.neutralSoft,
  },
});
