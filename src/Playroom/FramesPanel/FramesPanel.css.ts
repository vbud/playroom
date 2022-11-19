import { calc } from '@vanilla-extract/css-utils';
import { globalStyle, style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

export const title = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space.medium,
});

export const reset = style({
  position: 'relative',
  font: vars.font.scale.small,
  border: 0,
  padding: vars.space.medium,
  appearance: 'none',
  color: 'currentColor',
  backgroundColor: 'transparent',
  outline: 'none',
  textDecoration: 'underline',
  margin: calc(vars.space.medium).negate().toString(),
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: vars.radii.large,
    boxShadow: colorPaletteVars.shadows.focus,
    cursor: 'pointer',
    opacity: 0,
    transform: 'scale(0.8)',
  },
  selectors: {
    [`&:focus::before, &:hover::before`]: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
});

export const label = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  height: calc(vars.grid).multiply(9).toString(),
});

const checkboxSize = '20px';
export const checkbox = style({
  position: 'absolute',
  margin: 0,
  left: 0,
  right: 0,
  opacity: 0,
  pointerEvents: 'none',
  height: checkboxSize,
  width: checkboxSize,
});

const checkboxPadding = vars.space.xxsmall;
export const fakeCheckbox = style([
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: vars.radii.large,
    marginRight: vars.space.large,
    padding: checkboxPadding,
    flexGrow: 0,
    flexShrink: 0,
    height: calc(checkboxSize)
      .subtract(calc(checkboxPadding).multiply(2))
      .toString(),
    width: calc(checkboxSize)
      .subtract(calc(checkboxPadding).multiply(2))
      .toString(),
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: vars.radii.medium,
      boxShadow: colorPaletteVars.shadows.focus,

      opacity: 0,
      transform: 'scale(0.5)',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: vars.radii.medium,
      boxShadow: 'inset 0 0 0px 1px currentColor',
      background: colorPaletteVars.background.surface,
    },
    selectors: {
      [`${checkbox}:hover:not(:focus) ~ &::before, ${checkbox}:focus ~ &::before`]:
        {
          opacity: 1,
          transform: 'scale(1)',
        },
    },
  },
]);

globalStyle(`${fakeCheckbox} > svg`, {
  height: '100%',
  width: '100%',
  opacity: 0,
  transform: 'scale(0.6)',

  transitionDelay: '0.1s, 0.3s',
  zIndex: 1,
});

globalStyle(`${checkbox}:checked ~ ${fakeCheckbox} > svg `, {
  opacity: 1,
  transform: 'none',
});
