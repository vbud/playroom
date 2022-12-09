import { useEffect } from 'react';

export type ColorScheme = 'light' | 'dark' | 'system';
const applyColorScheme = (colorScheme: Exclude<ColorScheme, 'system'>) => {
  document.documentElement[
    colorScheme === 'dark' ? 'setAttribute' : 'removeAttribute'
  ]('data-playroom-dark', '');
};

export function useColorScheme(colorScheme: ColorScheme) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    if (colorScheme === 'system') {
      const handler = (e: MediaQueryListEvent) => {
        applyColorScheme(e.matches ? 'dark' : 'light');
      };
      mq.addEventListener('change', handler);
      applyColorScheme(mq.matches ? 'dark' : 'light');

      return () => {
        mq.removeEventListener('change', handler);
      };
    }

    applyColorScheme(colorScheme);
  }, [colorScheme]);
}
