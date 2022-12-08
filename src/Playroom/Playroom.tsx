import React, { useContext, ComponentType } from 'react';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';
import Frames from './Frames/Frames';
import WindowPortal from './WindowPortal';
import { Snippets } from '../../utils';
import componentsToHints from 'src/utils/componentsToHints';
import Toolbar from './Toolbar/Toolbar';
import { StatusMessage } from './StatusMessage/StatusMessage';
import {
  initialEditorWidth,
  StoreContext,
} from 'src/StoreContext/StoreContext';
import { CodeEditor } from './CodeEditor/CodeEditor';

import * as styles from './Playroom.css';

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
      editorWidth,
      isChromeHidden,
      visibleThemes,
      visibleWidths,
      code,
      ready,
    },
    dispatch,
  ] = useContext(StoreContext);

  const updateEditorWidth = useDebouncedCallback((width: number) => {
    dispatch({
      type: 'updateEditorWidth',
      payload: { editorWidth: width },
    });
  }, 1);

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
    <div>
      <CodeEditor hints={hints} />
      <StatusMessage />
    </div>
  );

  const sizeStyles = {
    height: 'auto',
    width: `${editorWidth}px`,
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
          [styles.resizeableContainer_isHidden]: isChromeHidden,
        })}
        defaultSize={sizeStyles}
        size={sizeStyles}
        minWidth={initialEditorWidth}
        maxWidth="80vw"
        onResize={(_event, _direction, { offsetWidth }) => {
          updateEditorWidth(offsetWidth);
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
      tabIndex={0}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.code === 'Backslash' && event.metaKey) {
          event.preventDefault();
          dispatch({ type: isChromeHidden ? 'showChrome' : 'hideChrome' });
        }
      }}
    >
      {!isChromeHidden && (
        <Toolbar widths={widths} themes={themes} snippets={snippets} />
      )}
      {editorContainer}
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
  );
};
