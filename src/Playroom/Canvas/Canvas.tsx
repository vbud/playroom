import React from 'react';
import { Space } from 'react-zoomable-ui';

import { Components } from 'src/utils/componentsToHints';
import { Frame } from './Frame/Frame';

import * as styles from './Canvas.css';

export interface CanvasProps {
  code: string;
  components: Components;
}
export const Canvas = ({ code, components }: CanvasProps) => {
  return (
    <div className={styles.root}>
      <Space>
        <Frame code={code} components={components} />
      </Space>
    </div>
  );
};
