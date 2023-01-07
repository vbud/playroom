import React, { useCallback, useContext, useRef } from 'react';
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

  const dragStartPosition = React.useRef({ x: 0, y: 0 });
  const canvasClientRect = useRef<DOMRect | null>(null);
  const moveInterval = useRef<MoveInterval | null>(null);

  const { id, x, y, width, height } = frameConfig;

  const focusIfSelected = useCallback((node: Rnd) => {
    if (node && id === selectedFrameId) {
      node.getSelfElement()?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveMultiplier = 4;
  const startMoving = (direction: MoveInterval['direction']) => {
    const [x, y] = directionToDeltas[direction];
    moveInterval.current = {
      direction,
      interval: setInterval(
        () =>
          canvasViewportCamera &&
          canvasViewportCamera.moveBy(x * moveMultiplier, y * moveMultiplier),
        1
      ),
    };
  };
  const stopMoving = () => {
    if (moveInterval.current) {
      clearInterval(moveInterval.current.interval);
      moveInterval.current = null;
    }
  };

  const panIfDraggingOutsideCanvas = (mouseX: number, mouseY: number) => {
    if (!canvasClientRect.current) return;

    const { left, top, right, bottom } = canvasClientRect.current;

    let direction: MoveInterval['direction'] | undefined;

    if (mouseX < left && mouseY < top) {
      direction = 'leftUp';
    } else if (mouseX > right && mouseY < top) {
      direction = 'rightUp';
    } else if (mouseX > right && mouseY > bottom) {
      direction = 'rightDown';
    } else if (mouseX < left && mouseY > bottom) {
      direction = 'leftDown';
    } else if (mouseY < top) {
      direction = 'up';
    } else if (mouseX > right) {
      direction = 'right';
    } else if (mouseY > bottom) {
      direction = 'down';
    } else if (mouseX < left) {
      direction = 'left';
    }

    // if previously moving in different direction, stop previous movement
    if (direction === undefined) {
      // if mouse is dragging inside bounds, cancel any existing movement
      stopMoving();
    } else if (moveInterval.current === null) {
      // if mouse is dragging outside of bounds and we are not currently moving, start moving
      startMoving(direction);
      // if mouse is dragging outside of bounds and we are currently moving in a different direction,
      // stop moving in that direction and start moving in the new direction
    } else if (
      moveInterval.current &&
      moveInterval.current.direction !== direction
    ) {
      stopMoving();
      startMoving(direction);
    }
  };

  return (
    <NoPanArea style={{ transform: `translate(${x}px,${y}px)` }}>
      <Rnd
        ref={focusIfSelected}
        className={classNames(styles.root, {
          [styles.selected]: id === selectedFrameId,
        })}
        size={{ width, height }}
        position={{ x: 0, y: 0 }}
        scale={scale}
        onDragStart={(_event, d) => {
          dragStartPosition.current = {
            x: d.x,
            y: d.y,
          };
          canvasEl &&
            (canvasClientRect.current = canvasEl.getBoundingClientRect());
        }}
        onDrag={(event) => {
          const { clientX, clientY } = event as MouseEvent;
          panIfDraggingOutsideCanvas(clientX, clientY);
        }}
        onDragStop={(_event, d) => {
          stopMoving();
          dispatch({
            type: 'moveFrame',
            payload: {
              id: id,
              x: x + d.x - dragStartPosition.current.x,
              y: y + d.y - dragStartPosition.current.y,
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
