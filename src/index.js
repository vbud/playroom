import React from 'react';
import { createRoot } from 'react-dom/client';

import Playroom from './Playroom/Playroom';
import { StoreProvider } from './StoreContext/StoreContext';

const polyfillIntersectionObserver = () =>
  typeof window.IntersectionObserver !== 'undefined'
    ? Promise.resolve()
    : import('intersection-observer');

polyfillIntersectionObserver().then(() => {
  const outlet = document.createElement('div');
  document.body.appendChild(outlet);

  const renderPlayroom = ({
    importedComponents = require('./components'),
    snippets = require('./snippets'),
  } = {}) => {
    // Exclude undefined components, e.g. an exported TypeScript type.
    const components = Object.fromEntries(
      Object.entries(importedComponents).filter(([_, value]) => value)
    );

    const root = createRoot(outlet);
    root.render(
      <StoreProvider>
        <Playroom
          components={components}
          snippets={
            typeof snippets.default !== 'undefined'
              ? snippets.default
              : snippets
          }
        />
      </StoreProvider>
    );
  };
  renderPlayroom();

  if (module.hot) {
    module.hot.accept('./components', () => {
      renderPlayroom({ components: require('./components') });
    });

    module.hot.accept('./snippets', () => {
      renderPlayroom({ snippets: require('./snippets') });
    });
  }
});
