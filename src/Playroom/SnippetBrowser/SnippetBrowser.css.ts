import { style } from '@vanilla-extract/css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';
import { colorPaletteVars, vars } from '../theme.css';

export const root = style({
  position: 'absolute',
  left: '10vw',
  top: '10vh',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '80vh',
  width: '80vw',
  backgroundColor: colorPaletteVars.background.surface,
  boxShadow: colorPaletteVars.shadows.small,
  borderRadius: '16px',
});

export const fieldContainer = style({
  display: 'flex',
  alignItems: 'center',
  padding: vars.space.medium,
  flexBasis: toolbarItemSize,
  borderBottom: `1px solid ${colorPaletteVars.border.standard}`,
});

export const snippetsContainer = style({
  overflow: 'auto',
  margin: 0,
  padding: vars.space.medium,
});

export const snippet = style({
  position: 'relative',
  cursor: 'pointer',
  padding: `${vars.space.large} ${vars.space.xlarge}`,
  color: colorPaletteVars.foreground.neutral,
  backgroundColor: colorPaletteVars.background.surface,
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colorPaletteVars.background.selection,
    borderRadius: vars.radii.medium,
    opacity: 0,
    pointerEvents: 'none',
  },
});

export const snippetName = style({
  display: 'block',
  color: colorPaletteVars.foreground.secondary,
});

export const highlight = style({
  color: colorPaletteVars.foreground.accent,
  '::before': {
    opacity: 1,
  },
});
