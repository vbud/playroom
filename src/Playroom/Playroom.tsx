import React, { useContext, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';

import Toolbar from './Toolbar/Toolbar';
import { StatusMessage } from './StatusMessage/StatusMessage';
import {
  initialEditorWidth,
  StoreContext,
} from 'src/StoreContext/StoreContext';
import { CodeEditor } from './CodeEditor/CodeEditor';
import { Canvas } from './Canvas/Canvas';
import SnippetBrowser from './SnippetBrowser/SnippetBrowser';
import { useClickOutside } from 'src/utils/useClickOutside';
import { formatAndInsert } from 'src/utils/formatting';
import { isValidLocation } from 'src/utils/cursor';
import componentsToHints, { Components } from 'src/utils/componentsToHints';
import { Snippets } from 'utils';

import * as styles from './Playroom.css';
import { Text } from './Text/Text';

export interface PlayroomProps {
  components: Components;
  snippets: Snippets;
}

export default function Playroom({ components, snippets }: PlayroomProps) {
  const [state, dispatch] = useContext(StoreContext);
  const {
    editorView,
    editorWidth,
    showSnippets,
    showChrome,
    cursorPosition,
    selectedFrameId,
    frames,
    ready,
  } = state;

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      if (
        event.code === 'Backslash' &&
        event.metaKey &&
        !event.shiftKey &&
        !event.altKey &&
        !event.ctrlKey
      ) {
        event.preventDefault();
        dispatch({ type: showChrome ? 'hideChrome' : 'showChrome' });
      } else if (
        event.code === 'KeyK' &&
        event.metaKey &&
        !event.shiftKey &&
        !event.altKey &&
        !event.ctrlKey
      ) {
        event.preventDefault();
        dispatch({
          type: 'toggleSnippets',
        });
      }
    };

    document.addEventListener('keydown', keyDownListener);
    return () => {
      document.removeEventListener('keydown', keyDownListener);
    };
  }, [dispatch, showChrome]);

  const updateEditorWidth = useDebouncedCallback((width: number) => {
    dispatch({
      type: 'updateEditorWidth',
      payload: { editorWidth: width },
    });
  }, 1);

  const clickOutsideHandler = () => {
    dispatch({ type: 'toggleSnippets' });
  };
  const snippetsRef = useRef<HTMLDivElement>(null);
  useClickOutside(snippetsRef, clickOutsideHandler);

  if (!ready) {
    return null;
  }

  const hints = componentsToHints(components);

  const editor = (
    <div className={styles.editorContainer}>
      {selectedFrameId ? (
        <CodeEditor code={frames[selectedFrameId].code} hints={hints} />
      ) : (
        <div className={styles.emptyCodeEditor}>
          <Text>No frame selected.</Text>
        </div>
      )}
    </div>
  );

  const sizeStyles = {
    height: '100%',
    width: `${editorWidth}px`,
  };

  return (
    <div className={styles.root}>
      {showChrome && <Toolbar snippets={snippets} />}
      <div className={styles.main}>
        <Resizable
          className={classnames(styles.resizeableContainer, {
            [styles.resizeableContainer_isHidden]: !showChrome,
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
          {editor}
        </Resizable>
        <Canvas
          frames={frames}
          components={components}
          selectedFrameId={selectedFrameId}
        />
      </div>
      {showSnippets && (
        <SnippetBrowser
          ref={snippetsRef}
          snippets={snippets}
          components={components}
          onSelectSnippet={(snippet) => {
            if (editorView) {
              dispatch({ type: 'toggleSnippets' });

              setTimeout(() => editorView.focus(), 0);

              if (!selectedFrameId) {
                dispatch({
                  type: 'displayStatusMessage',
                  payload: {
                    message: 'Select a frame before adding a snippet',
                    tone: 'critical',
                  },
                });
                return;
              }

              const code = frames[selectedFrameId].code;
              const validCursorPosition = isValidLocation({
                code,
                cursor: cursorPosition,
              });

              if (!validCursorPosition) {
                dispatch({
                  type: 'displayStatusMessage',
                  payload: {
                    message: 'Cannot insert snippet at cursor',
                    tone: 'critical',
                  },
                });
                return;
              }

              const result = formatAndInsert({
                code,
                cursor: cursorPosition,
                snippet: snippet.code,
              });

              editorView.dispatch({
                changes: {
                  from: 0,
                  to: code.length,
                  insert: result.code,
                },
                selection: { anchor: result.cursor },
              });
            }
          }}
        />
      )}
      <StatusMessage />
    </div>
  );
}
