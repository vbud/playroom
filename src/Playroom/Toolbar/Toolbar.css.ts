import { calc } from '@vanilla-extract/css-utils';
import { style } from '@vanilla-extract/css';
import { colorPaletteVars } from '../theme.css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';

export const toolbarOpenSize = 300;
const toolbarBorderThickness = '1px';

export const isOpen = style({});
export const root = style({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'row-reverse',
  color: colorPaletteVars.foreground.neutral,
  minWidth: calc(`${toolbarItemSize}px`).add(toolbarBorderThickness).toString(),
});

export const backdrop = style({
  position: 'absolute',
  height: '100vh',
  width: '100vw',
});

export const sidebar = style({
  position: 'absolute',
  display: 'flex',
  pointerEvents: 'none',
  height: '100%',
  flexDirection: 'row-reverse',
});

export const positions_isOpen = style({});
export const positionContainer = style({
  position: 'absolute',
  top: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  bottom: toolbarItemSize,
  selectors: {
    [`&:not(${positions_isOpen})`]: {
      opacity: 0,
      pointerEvents: 'none',
      transform: 'translateY(20px)',
    },
  },
});

export const buttons = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'auto',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 1,
  width: toolbarItemSize,
  backgroundColor: colorPaletteVars.background.surface,
  borderRight: `${toolbarBorderThickness} solid ${colorPaletteVars.border.standard}`,
});

export const panel = style({
  position: 'absolute',
  display: 'flex',
  overflow: 'auto',
  pointerEvents: 'auto',
  width: toolbarOpenSize,
  height: '100%',
  backgroundColor: colorPaletteVars.background.surface,
  borderRight: `${toolbarBorderThickness} solid ${colorPaletteVars.border.standard}`,
  transform: `translateX(${toolbarOpenSize}px)`,
});
