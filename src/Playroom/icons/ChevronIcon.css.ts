import { style } from '@vanilla-extract/css';

export const root = style({
  transformOrigin: '50% 50%',
});

export const left = style({
  transform: 'rotate(90deg)',
});

export const up = style({
  transform: 'rotate(180deg)',
});

export const right = style({
  transform: 'rotate(270deg)',
});
