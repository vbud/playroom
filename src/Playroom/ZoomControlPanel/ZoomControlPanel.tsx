import React, { useContext } from 'react';

import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { Stack } from '../Stack/Stack';
import { Heading } from '../Heading/Heading';
import { Button } from '../Button/Button';
import { Inline } from '../Inline/Inline';
import { StoreContext } from 'src/StoreContext/StoreContext';

export default function ZoomControlPanel() {
  const [{ canvasViewport }] = useContext(StoreContext);

  return (
    <ToolbarPanel data-testid="preview-panel">
      <Stack space="medium">
        <Heading as="h4" level="3">
          Canvas position
        </Heading>

        <Inline space="small">
          <Button
            title="Reset canvas zoom to default"
            data-testid="reset-canvas-zoom"
            onClick={() => {
              if (canvasViewport) {
                canvasViewport.camera.recenter(
                  canvasViewport.centerX,
                  canvasViewport.centerY,
                  1
                );
              }
            }}
          >
            Reset zoom
          </Button>
          <Button
            title="Reset canvas coordinates to default"
            data-testid="reset-canvas-coords"
            onClick={() => canvasViewport?.camera.updateTopLeft(0, 0)}
          >
            Reset coordinates
          </Button>
        </Inline>
      </Stack>
    </ToolbarPanel>
  );
}
