import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

export const fieldset = style({
  border: 0,
  margin: 0,
  padding: 0,
});

export const radioContainer = style({
  display: 'flex',
  paddingTop: vars.space.medium,
});

export const realRadio = style({
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
  height: vars.touchableSize,
  width: vars.touchableSize,
});

export const labelText = style({
  display: 'block',
  position: 'relative',
  zIndex: 1,
});

export const label = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  marginRight: vars.space.xxsmall,
  height: vars.touchableSize,
  width: vars.touchableSize,
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colorPaletteVars.background.selection,
    borderRadius: vars.radii.large,

    opacity: 0,
    transform: 'scale(0.8)',
  },
  selectors: {
    [[
      `${realRadio}:checked ~ &`,
      `html:not([data-playroom-dark]) ${realRadio}:hover ~ &`,
    ].join(',')]: {
      color: colorPaletteVars.foreground.accent,
    },
    [`${realRadio}:focus ~ &::before, ${realRadio}:hover ~ &::before`]: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
});
