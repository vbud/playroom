import React from 'react';
import { defaultIconSize } from './iconConfig';

interface Props {
  size?: number;
}
const TickIcon = ({ size = defaultIconSize }: Props) => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M19.7 6.3c-.4-.4-1-.4-1.4 0L9 15.6l-3.3-3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4 4c.2.2.4.3.7.3s.5-.1.7-.3l10-10c.4-.4.4-1 0-1.4z" />
  </svg>
);

export default TickIcon;
