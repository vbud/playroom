import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const root = style({
  position: 'fixed',
  inset: 0,
  overflow: 'auto',
  padding: vars.space.xxlarge,
});
