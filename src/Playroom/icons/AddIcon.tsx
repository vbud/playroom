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
    <path d="M18,11H13V6a1,1,0,0,0-2,0v5H6a1,1,0,0,0,0,2h5v5a1,1,0,0,0,2,0V13h5a1,1,0,0,0,0-2Z" />
  </svg>
);
