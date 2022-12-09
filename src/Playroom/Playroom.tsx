import React, { useContext, ComponentType, useEffect } from 'react';
import classnames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { Resizable } from 're-resizable';

import { Snippets } from '../../utils';
import componentsToHints from 'src/utils/componentsToHints';
import Toolbar from './Toolbar/Toolbar';
import { StatusMessage } from './StatusMessage/StatusMessage';
import {
  initialEditorWidth,
  StoreContext,
} from 'src/StoreContext/StoreContext';
import { CodeEditor } from './CodeEditor/CodeEditor';
import { Canvas } from './Canvas/Canvas';

import * as styles from './Playroom.css';

export interface PlayroomProps {
  components: Record<string, ComponentType>;
  snippets: Snippets;
}

export default ({ components, snippets }: PlayroomProps) => {
  const [{ editorWidth, isChromeHidden, code, ready }, dispatch] =
    useContext(StoreContext);

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      if (event.code === 'Backslash' && event.metaKey) {
        event.preventDefault();
        dispatch({ type: isChromeHidden ? 'showChrome' : 'hideChrome' });
      }
    };

    document.addEventListener('keydown', keyDownListener);
    return () => {
      document.removeEventListener('keydown', keyDownListener);
    };
  }, [dispatch, isChromeHidden]);

  const updateEditorWidth = useDebouncedCallback((width: number) => {
    dispatch({
      type: 'updateEditorWidth',
      payload: { editorWidth: width },
    });
  }, 1);

  if (!ready) {
    return null;
  }

  const hints = componentsToHints(components);

  const toolbarAndEditor = (
    <div className={styles.toolbarAndEditor}>
      {!isChromeHidden && <Toolbar snippets={snippets} />}
      <CodeEditor hints={hints} />
    </div>
  );

  const sizeStyles = {
    height: '100%',
    width: `${editorWidth}px`,
  };

  return (
    <div className={styles.root}>
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
        {toolbarAndEditor}
      </Resizable>
      <Canvas code={code} components={components} />
      <StatusMessage />
    </div>
  );
};
