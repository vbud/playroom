import { style } from '@vanilla-extract/css';

export const root = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  cursor: 'default',
});

export const inner = style({
  margin: 0,
  padding: 0,
  transformOrigin: '0% 0%',
  minHeight: '100%',
  width: '100%',
});
