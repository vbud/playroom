import { style } from '@vanilla-extract/css';
import { colorPaletteVars, vars } from '../theme.css';

export const root = style({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '80vh',
  width: '800px',
  maxWidth: '80vw',
  backgroundColor: colorPaletteVars.background.surface,
  boxShadow: colorPaletteVars.shadows.small,
  borderRadius: '16px',
});

export const fieldContainer = style({
  display: 'flex',
  alignItems: 'center',
  padding: vars.space.medium,
  borderBottom: `1px solid ${colorPaletteVars.border.standard}`,
});

export const snippetsContainer = style({
  overflow: 'auto',
  margin: 0,
  padding: vars.space.medium,
});

export const snippet = style({
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  padding: `${vars.space.large} ${vars.space.xlarge}`,
  color: colorPaletteVars.foreground.neutral,
  backgroundColor: colorPaletteVars.background.surface,
  borderRadius: vars.radii.large,
});

export const snippetName = style({
  display: 'block',
  color: colorPaletteVars.foreground.secondary,
});

export const highlight = style({
  backgroundColor: colorPaletteVars.background.selection,
  color: colorPaletteVars.foreground.accent,
});

export const snippetBackground = style({
  background: 'white',
  padding: vars.space.medium,
  borderRadius: vars.radii.large,
});
