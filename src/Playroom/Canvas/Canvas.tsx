import React, { useContext, useRef } from 'react';
import { Space } from 'react-zoomable-ui';
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
  const spaceRef = useRef<Space | null>(null);

  const onSpaceUpdate = useDebouncedCallback((vp) => {
    dispatch({
      type: 'saveCanvasPosition',
      payload: { left: vp.left, top: vp.top, zoom: vp.zoomFactor },
    });
  }, 100);

  return (
    <div
      ref={canvasRef}
      className={styles.root}
      onMouseDown={() => dispatch({ type: 'selectFrame', payload: undefined })}
    >
      <Space
        ref={spaceRef}
        onCreate={(viewport) => {
          dispatch({
            type: 'initializeCanvas',
            payload: { canvasViewport: viewport },
          });

          const { left, top, zoom } = canvasPosition;
          viewport.camera.updateTopLeft(left, top, zoom);
        }}
        onUpdated={onSpaceUpdate}
      >
        {Object.keys(frames).map((frameId) => (
          <CanvasFrame
            key={frameId}
            frameConfig={frames[frameId]}
            components={components}
            selectedFrameId={selectedFrameId}
            scale={canvasPosition.zoom}
            canvasEl={canvasRef.current}
            canvasViewportCamera={spaceRef.current?.viewPort?.camera ?? null}
          />
        ))}
      </Space>
    </div>
  );
};
