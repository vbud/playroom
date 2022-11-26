import React from 'react';
import { createRoot } from 'react-dom/client';
import Frame from './Playroom/Frame';

const outlet = document.createElement('div');
document.body.appendChild(outlet);

const renderFrame = ({
  themes = require('./themes'),
  components = require('./components'),
  FrameComponent = require('./frameComponent'),
} = {}) => {
  const root = createRoot(outlet);
  root.render(
    <Frame
      components={components}
      themes={themes}
      FrameComponent={FrameComponent}
    />
  );
};
renderFrame();

if (module.hot) {
  module.hot.accept('./components', () => {
    renderFrame({ components: require('./components') });
  });

  module.hot.accept('./themes', () => {
    renderFrame({ themes: require('./themes') });
  });

  module.hot.accept('./frameComponent', () => {
    renderFrame({ FrameComponent: require('./frameComponent') });
  });
}
