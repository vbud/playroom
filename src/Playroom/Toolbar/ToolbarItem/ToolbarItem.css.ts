import { colorPaletteVars, vars } from '../../theme.css';
import { style, globalStyle } from '@vanilla-extract/css';

export const toolbarItemHeight = 40;

export const success = style({});
export const disabled = style({});
export const button_isActive = style({});
export const button = style({
  position: 'relative',
  height: toolbarItemHeight,
  border: 0,
  padding: vars.space.large,
  appearance: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  color: 'currentColor',
  backgroundColor: colorPaletteVars.background.surface,

  selectors: {
    [`&${success}`]: {
      color: colorPaletteVars.foreground.positive,
    },

    [`&:not(${disabled})`]: {
      cursor: 'pointer',
    },

    [`&${disabled}`]: {
      color: colorPaletteVars.foreground.neutralSoft,
    },

    [`&${button_isActive}:not(${success}):not(${disabled})`]: {
      color: colorPaletteVars.foreground.accent,
    },

    [[
      `&:not(${success}):not(${disabled}):focus`,
      `&:not(${success}):not(${disabled}):hover`,
    ].join(',')]: {
      backgroundColor: colorPaletteVars.background.selection,
    },
  },
});

export const successIndicator = style({
  position: 'absolute',
  transform: 'translate(6px,-6px)',
  height: 12,
  width: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radii.full,
  pointerEvents: 'none',
  backgroundColor: colorPaletteVars.foreground.positive,
  border: `2px solid ${colorPaletteVars.background.surface}`,
});

globalStyle(`${successIndicator} svg`, {
  color: colorPaletteVars.foreground.neutralInverted,
});
