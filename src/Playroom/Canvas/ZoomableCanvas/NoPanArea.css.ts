import { style } from '@vanilla-extract/css';

export const root = style({
  // TODO: are any of the below three rules necessary anymore
  msTouchAction: 'default',
  WebkitUserSelect: 'text',
  WebkitTouchCallout: 'default',
  userSelect: 'text',
  cursor: 'auto',
});
