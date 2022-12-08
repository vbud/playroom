import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../theme.css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';

const toolbarBorderThickness = 1;

export const root = style({
  height: '100%',
  position: 'relative',
  color: colorPaletteVars.foreground.neutral,
});

export const buttons = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: toolbarItemSize,
  backgroundColor: colorPaletteVars.background.surface,
  borderRight: `${toolbarBorderThickness}px solid ${colorPaletteVars.border.standard}`,
});

export const panel = style({
  position: 'absolute',
  top: 0,
  left: toolbarItemSize + toolbarBorderThickness,
  zIndex: 1,
  display: 'flex',
  overflow: 'auto',
  pointerEvents: 'auto',
  width: 300,
  height: '100%',
  backgroundColor: colorPaletteVars.background.surface,
  borderRight: `${toolbarBorderThickness}px solid ${colorPaletteVars.border.standard}`,
});
