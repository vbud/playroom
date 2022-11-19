import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../theme.css';

export const root = style({
  position: 'relative',
});

export const divider = style({
  position: 'absolute',
  width: '100%',
  borderTop: `1px solid ${colorPaletteVars.border.standard}`,
});
