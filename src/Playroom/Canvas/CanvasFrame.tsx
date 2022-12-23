import React, { useCallback, useContext, useState } from 'react';
import classNames from 'classnames';
import { NoPanArea, ViewPortCameraInterface } from 'react-zoomable-ui';
import { Rnd } from 'react-rnd';

import { Frame } from '../Frame/Frame';
import {
  FrameConfig,
  SelectedFrameId,
  StoreContext,
} from 'src/StoreContext/StoreContext';
import { Components } from 'src/utils/componentsToHints';

import * as styles from './CanvasFrame.css';

interface MoveInterval {
  direction:
    | 'leftUp'
    | 'up'
    | 'rightUp'
    | 'right'
    | 'rightDown'
    | 'down'
    | 'leftDown'
    | 'left';
  interval: number;
}

const directionToDeltas: Record<MoveInterval['direction'], [number, number]> = {
  leftUp: [-1, -1],
  up: [0, -1],
  rightUp: [1, -1],
  right: [1, 0],
  rightDown: [1, 1],
  down: [0, 1],
  leftDown: [-1, 1],
  left: [-1, 0],
};

interface CanvasFrameProps {
  frameConfig: FrameConfig;
  components: Components;
  selectedFrameId: SelectedFrameId;
  scale: number;
  canvasEl: HTMLDivElement | null;
  canvasViewportCamera: ViewPortCameraInterface | null;
}

export const CanvasFrame = ({
  frameConfig,
  components,
  selectedFrameId,
  scale,
  canvasEl,
  canvasViewportCamera,
}: CanvasFrameProps) => {
  const [_, dispatch] = useContext(StoreContext);
  const [canvasClientRect, setCanvasClientRect] = useState<DOMRect | null>(
    null
  );

  const [moveInterval, setMoveInterval] = useState<MoveInterval | null>(null);
  const moveMultiplier = 4;
  const startMoving = (direction: MoveInterval['direction']) => {
    const [x, y] = directionToDeltas[direction];
    setMoveInterval({
      direction,
      interval: setInterval(
        () =>
          canvasViewportCamera &&
          canvasViewportCamera.moveBy(x * moveMultiplier, y * moveMultiplier),
        1
      ),
    });
  };
  const stopMoving = () => {
    if (moveInterval) {
      clearInterval(moveInterval.interval);
      setMoveInterval(null);
    }
  };

  const focusIfSelected = useCallback((node: Rnd) => {
    if (node && id === selectedFrameId) {
      node.getSelfElement()?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { id, x, y, width, height } = frameConfig;

  return (
    <NoPanArea>
      <Rnd
        ref={focusIfSelected}
        className={classNames(styles.root, {
          [styles.selected]: id === selectedFrameId,
        })}
        size={{ width, height }}
        position={{ x, y }}
        scale={scale}
        onDragStart={() => {
          canvasEl && setCanvasClientRect(canvasEl.getBoundingClientRect());
        }}
        onDrag={(event) => {
          if (!canvasClientRect) return;

          const { left, top, right, bottom } = canvasClientRect;
          const { clientX, clientY } = event as MouseEvent;

          let direction: MoveInterval['direction'] | undefined;

          if (clientX < left && clientY < top) {
            direction = 'leftUp';
          } else if (clientX > right && clientY < top) {
            direction = 'rightUp';
          } else if (clientX > right && clientY > bottom) {
            direction = 'rightDown';
          } else if (clientX < left && clientY > bottom) {
            direction = 'leftDown';
          } else if (clientY < top) {
            direction = 'up';
          } else if (clientX > right) {
            direction = 'right';
          } else if (clientY > bottom) {
            direction = 'down';
          } else if (clientX < left) {
            direction = 'left';
          }

          // if previously moving in different direction, stop previous movement
          if (direction === undefined) {
            // if mouse is dragging inside bounds, cancel any existing movement
            stopMoving();
          } else if (moveInterval === null) {
            // if mouse is dragging outside of bounds and we are not currently moving, start moving
            startMoving(direction);
            // if mouse is dragging outside of bounds and we are currently moving in a different direction,
            // stop moving in that direction and start moving in the new direction
          } else if (moveInterval && moveInterval.direction !== direction) {
            stopMoving();
            startMoving(direction);
          }
        }}
        onDragStop={(_event, { x, y }) => {
          stopMoving();
          dispatch({
            type: 'moveFrame',
            payload: {
              id: id,
              x,
              y,
            },
          });
        }}
        onResize={(_event, _direction, ref, _delta, { x, y }) => {
          dispatch({
            type: 'moveFrame',
            payload: {
              id,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x,
              y,
            },
          });
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
          dispatch({ type: 'selectFrame', payload: id });
        }}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.code === 'Backspace') {
            dispatch({ type: 'deleteFrame', payload: id });
          }
        }}
        tabIndex={0} // make element focusable so it can handle keyboard events
      >
        <div className={styles.frameName}>{id}</div>
        <Frame frameConfig={frameConfig} components={components} />
      </Rnd>
    </NoPanArea>
  );
};
