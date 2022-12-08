import React, { useEffect } from 'react';

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    if (!ref || !ref.current) return;

    const clickListener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler();
    };

    const keyDownListener = (event: KeyboardEvent) => {
      if (!ref.current) return;

      if (event.code === 'Escape') {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('click', clickListener);
    document.addEventListener('keydown', keyDownListener);

    return () => {
      document.removeEventListener('click', clickListener);
      document.removeEventListener('keydown', keyDownListener);
    };
  }, [ref, handler]);
}
