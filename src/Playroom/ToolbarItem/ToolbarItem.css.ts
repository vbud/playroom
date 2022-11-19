import { colorPaletteVars, vars } from '../theme.css';
import { style, globalStyle } from '@vanilla-extract/css';

export const toolbarItemSize = 60;

export const success = style({});
export const disabled = style({});
export const showIndicator = style({});
export const button_isActive = style({});
export const button = style({
  position: 'relative',
  border: 0,
  padding: 0,
  appearance: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  height: toolbarItemSize,
  width: toolbarItemSize,
  color: 'currentColor',
  backgroundColor: colorPaletteVars.background.surface,
  WebkitTapHighlightColor: 'transparent',

  // Background
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colorPaletteVars.background.selection,
    opacity: 0,

    pointerEvents: 'none',
  },

  // Side strip
  '::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 5,
    backgroundColor: 'currentColor',
  },

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

    [[
      `&${showIndicator}`,
      `&${button_isActive}:not(${success}):not(${disabled})`,
      `html:not([data-playroom-dark]) &:hover:not(${success}):not(${disabled})`,
    ].join(',')]: {
      color: colorPaletteVars.foreground.accent,
    },

    [`&:not(${success}):not(:hover):focus::before`]: {
      color: colorPaletteVars.foreground.neutral,
    },
    [[
      `&:not(${success}):not(${disabled}):focus::before`,
      `&:not(${success}):not(${disabled}):hover::before`,
    ].join(',')]: {
      opacity: 1,
    },

    [`&:not(${button_isActive})::after`]: {
      transform: 'translateX(100%)',
      opacity: 0,
    },
  },
});

export const show = style({});
export const indicator = style({
  position: 'absolute',
  borderRadius: vars.radii.full,
  pointerEvents: 'none',
  top: 12,
  right: 12,
  height: 10,
  width: 10,
  backgroundColor: colorPaletteVars.background.accent,
  border: `2px solid ${colorPaletteVars.background.surface}`,
  selectors: {
    [`&:not(${show})`]: {
      transform: 'scale(0)',
      opacity: 0,
    },
  },
});

export const successIndicator = style({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radii.full,
  pointerEvents: 'none',
  top: 12,
  right: 12,
  height: 14,
  width: 14,
  backgroundColor: colorPaletteVars.foreground.positive,
  border: `2px solid ${colorPaletteVars.background.surface}`,
  selectors: {
    [`&:not(${show})`]: {
      transform: 'translate3d(-15px, 9px, 0) scale(0)',
      opacity: 0,
    },
  },
});

globalStyle(`${successIndicator} svg`, {
  color: colorPaletteVars.foreground.neutralInverted,
});
