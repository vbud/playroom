import React, { useContext, ComponentType, Fragment } from 'react';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';
import Frames from './Frames/Frames';
import WindowPortal from './WindowPortal';
import { Snippets } from '../../utils';
import componentsToHints from 'src/utils/componentsToHints';
import Toolbar, { toolbarItemCount } from './Toolbar/Toolbar';
import { StatusMessage } from './StatusMessage/StatusMessage';
import { StoreContext } from 'src/StoreContext/StoreContext';
import { CodeEditor } from './CodeEditor/CodeEditor';

import * as styles from './Playroom.css';
import { toolbarOpenSize } from './Toolbar/Toolbar.css';
import { toolbarItemSize } from './ToolbarItem/ToolbarItem.css';

const MIN_HEIGHT = toolbarItemSize * toolbarItemCount;
const MIN_WIDTH = toolbarOpenSize + toolbarItemSize + 80;

export interface PlayroomProps {
  components: Record<string, ComponentType>;
  themes: string[];
  widths: number[];
  snippets: Snippets;
}

export default ({ components, themes, widths, snippets }: PlayroomProps) => {
  const [
    {
      editorPosition,
      editorHeight,
      editorWidth,
      editorHidden,
      visibleThemes,
      visibleWidths,
      code,
      ready,
    },
    dispatch,
  ] = useContext(StoreContext);

  const updateEditorSize = useDebouncedCallback(
    ({
      isVerticalEditor,
      offsetWidth,
      offsetHeight,
    }: {
      isVerticalEditor: boolean;
      offsetHeight: number;
      offsetWidth: number;
    }) => {
      dispatch({
        type: isVerticalEditor ? 'updateEditorWidth' : 'updateEditorHeight',
        payload: { size: isVerticalEditor ? offsetWidth : offsetHeight },
      });
    },
    1
  );

  const resetEditorPosition = useDebouncedCallback(() => {
    if (editorPosition === 'undocked') {
      dispatch({ type: 'resetEditorPosition' });
    }
  }, 1);

  if (!ready) {
    return null;
  }

  const hints = componentsToHints(components);

  const codeEditor = (
    <Fragment>
      <div className={styles.toolbarContainer}>
        <Toolbar widths={widths} themes={themes} snippets={snippets} />
      </div>
      <div className={styles.editorContainer}>
        <CodeEditor hints={hints} />
        <StatusMessage />
      </div>
    </Fragment>
  );
  const isVerticalEditor = editorPosition === 'left';
  const sizeStyles = {
    height: 'auto',
    width: isVerticalEditor ? `${editorWidth}px` : 'auto',
  };
  const editorContainer =
    editorPosition === 'undocked' ? (
      <WindowPortal
        height={window.outerHeight}
        width={window.outerWidth}
        onUnload={resetEditorPosition}
        onError={resetEditorPosition}
      >
        {codeEditor}
      </WindowPortal>
    ) : (
      <Resizable
        className={classnames(styles.resizeableContainer, {
          [styles.resizeableContainer_isLeft]: isVerticalEditor,
          [styles.resizeableContainer_isHidden]: editorHidden,
        })}
        defaultSize={sizeStyles}
        size={sizeStyles}
        minWidth={isVerticalEditor ? MIN_WIDTH : undefined}
        minHeight={MIN_HEIGHT}
        onResize={(_event, _direction, { offsetWidth, offsetHeight }) => {
          updateEditorSize({ isVerticalEditor, offsetWidth, offsetHeight });
        }}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        {codeEditor}
      </Resizable>
    );

  return (
    <div
      className={styles.root}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.code === 'Backslash' && event.metaKey) {
          event.preventDefault();
          dispatch({ type: editorHidden ? 'showEditor' : 'hideEditor' });
        }
      }}
    >
      <div
        className={styles.previewContainer}
        style={
          editorHidden
            ? undefined
            : {
                left: { left: editorWidth },
                bottom: { bottom: editorHeight },
                undocked: undefined,
              }[editorPosition]
        }
      >
        <Frames
          code={code}
          themes={
            visibleThemes && visibleThemes.length > 0 ? visibleThemes : themes
          }
          widths={
            visibleWidths && visibleWidths.length > 0 ? visibleWidths : widths
          }
        />
      </div>
      {editorContainer}
    </div>
  );
};
