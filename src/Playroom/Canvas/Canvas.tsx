import React, { useContext, useRef } from 'react';
import { Space } from './ZoomableCanvas';
import { useDebouncedCallback } from 'use-debounce';

import {
  FrameConfigs,
  SelectedFrameId,
  StoreContext,
} from 'src/StoreContext/StoreContext';
import { Components } from 'src/utils/componentsToHints';
import { CanvasFrame } from './CanvasFrame';

import * as styles from './Canvas.css';

interface CanvasProps {
  frames: FrameConfigs;
  components: Components;
  selectedFrameId: SelectedFrameId;
}
export const Canvas = ({
  frames,
  components,
  selectedFrameId,
}: CanvasProps) => {
  const [{ canvasPosition }, dispatch] = useContext(StoreContext);

  const canvasRef = useRef<HTMLDivElement>(null);

  const saveCanvasPosition = useDebouncedCallback((vp) => {
    dispatch({
      type: 'saveCanvasPosition',
      payload: { left: vp.left, top: vp.top, zoom: vp.zoomFactor },
    });
  }, 50);

  return (
    <div
      ref={canvasRef}
      className={styles.root}
      onMouseDown={() => dispatch({ type: 'selectFrame', payload: undefined })}
    >
      <Space
        onCreate={(viewport) => {
          dispatch({
            type: 'initializeCanvas',
            payload: { canvasViewport: viewport },
          });

          const { left, top, zoom } = canvasPosition;
          viewport.camera.updateTopLeft(left, top, zoom);
        }}
        onUpdated={saveCanvasPosition}
      >
        {Object.keys(frames).map((frameId) => (
          <CanvasFrame
            key={frameId}
            frameConfig={frames[frameId]}
            components={components}
            selectedFrameId={selectedFrameId}
            scale={canvasPosition.zoom}
            canvasEl={canvasRef.current}
          />
        ))}
      </Space>
    </div>
  );
};
