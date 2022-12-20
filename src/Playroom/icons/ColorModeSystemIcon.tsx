import React from 'react';

interface Props {
  size?: number;
}
export default ({ size = 20 }: Props) => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M19.2 2H4.8A2.908 2.908 0 0 0 2 5v10a2.908 2.908 0 0 0 2.8 3H11v2.005H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3V18h6.2a2.908 2.908 0 0 0 2.8-3V5a2.908 2.908 0 0 0-2.8-3Zm.8 13a.93.93 0 0 1-.8 1H4.8a.93.93 0 0 1-.8-1V5a.93.93 0 0 1 .8-1h14.4a.93.93 0 0 1 .8 1Z" />
  </svg>
);
