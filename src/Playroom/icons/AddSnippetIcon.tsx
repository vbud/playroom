import React from 'react';
import { defaultIconSize } from './iconConfig';

interface Props {
  size?: number;
}
const AddSnippetIcon = ({ size = defaultIconSize }: Props) => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
export default AddSnippetIcon;
