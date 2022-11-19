import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const strong = style({
  display: 'inline',
  fontWeight: vars.font.weight.strong,
});
