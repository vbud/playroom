import React from 'react';
import { createRoot } from 'react-dom/client';
import Preview from './Playroom/Preview';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderPreview = ({ components = require('./components') } = {}) => {
  const root = createRoot(outlet);
  root.render(<Preview components={components} />);
};
renderPreview();

if (module.hot) {
  module.hot.accept('./components', () => {
    renderPreview({ components: require('./components') });
  });
}
