import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../theme.css';
import { toolbarItemHeight } from './ToolbarItem/ToolbarItem.css';

const toolbarBorderThickness = 1;

export const root = style({
  width: '100%',
  height: toolbarItemHeight,
  display: 'flex',
  alignItems: 'center',
  color: colorPaletteVars.foreground.neutral,
  backgroundColor: colorPaletteVars.background.surface,
  borderBottom: `${toolbarBorderThickness}px solid ${colorPaletteVars.border.standard}`,
});

export const alignNextItemsRight = style({
  marginLeft: 'auto',
});

export const toolbarHeight = toolbarItemHeight + toolbarBorderThickness;
export const panel = style({
  position: 'absolute',
  top: toolbarHeight,
  right: 0,
  zIndex: 1,
  display: 'flex',
  overflow: 'auto',
  pointerEvents: 'auto',
  width: 300,
  height: `calc(100vh - ${toolbarHeight}px)`,
  backgroundColor: colorPaletteVars.background.surface,
  borderBottom: `${toolbarBorderThickness}px solid ${colorPaletteVars.border.standard}`,
});
