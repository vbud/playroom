import React, { useContext, useRef, useState } from 'react';
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
  const [isViewportReady, setIsViewportReady] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const saveCanvasPosition = useDebouncedCallback((vp) => {
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
        onCreate={(viewport) => {
          dispatch({
            type: 'initializeCanvas',
            payload: { canvasViewport: viewport },
          });

          const { left, top, zoom } = canvasPosition;
          viewport.camera.updateTopLeft(left, top, zoom);
        }}
        onUpdated={(vp) => {
          // Because viewport camera updates are asynchronous, Space's children render
          // before the `onCreate` camera update containing the stored canvas position
          // can finish. To avoid seeing a flash of incorrectly positioned children,
          // we wait for the first call to `onUpdated`, after which we update a flag
          // that tells us that the viewport has been updated, and we can safely
          // render the children.
          //
          // The author is aware of the issue
          // (https://github.com/aarondail/react-zoomable-ui/issues/49#issuecomment-1374714798)
          // and may provide a fix in the future.
          if (!isViewportReady) {
            setIsViewportReady(true);
          }

          saveCanvasPosition(vp);
        }}
      >
        {isViewportReady &&
          Object.keys(frames).map((frameId) => (
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
