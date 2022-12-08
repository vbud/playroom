import React, { useContext, useState, useCallback } from 'react';
import { useTimeoutFn } from 'react-use';
import { PlayroomProps } from '../Playroom';
import { StoreContext } from 'src/StoreContext/StoreContext';
import FramesPanel from '../FramesPanel/FramesPanel';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import Snippets from '../Snippets/Snippets';
import ToolbarItem from '../ToolbarItem/ToolbarItem';
import AddIcon from '../icons/AddIcon';
import FramesIcon from '../icons/FramesIcon';
import ShareIcon from '../icons/ShareIcon';
import PlayIcon from '../icons/PlayIcon';

import * as styles from './Toolbar.css';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import SettingsIcon from '../icons/SettingsIcon';
import { formatAndInsert } from 'src/utils/formatting';

interface Props {
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
  snippets: PlayroomProps['snippets'];
}

export default ({ themes: allThemes, widths: allWidths, snippets }: Props) => {
  const [
    {
      visibleThemes = [],
      visibleWidths = [],
      activeToolbarPanel,
      validCursorPosition,
      code,
      cursorPosition,
      editorView,
    },
    dispatch,
  ] = useContext(StoreContext);
  const [copying, setCopying] = useState(false);
  const [isReady, cancel, reset] = useTimeoutFn(() => setCopying(false), 3000);

  const copyHandler = useCallback(() => {
    dispatch({
      type: 'copyToClipboard',
      payload: { url: window.location.href, trigger: 'toolbarItem' },
    });
    setCopying(true);

    if (isReady() === false) {
      cancel();
    }

    reset();
  }, [cancel, dispatch, isReady, reset]);

  const isSnippetsOpen = activeToolbarPanel === 'snippets';
  const isFramesOpen = activeToolbarPanel === 'frames';
  const isSettingsOpen = activeToolbarPanel === 'settings';
  const isPreviewOpen = activeToolbarPanel === 'preview';

  const hasSnippets = snippets && snippets.length > 0;
  const hasFilteredFrames =
    visibleThemes.length > 0 || visibleWidths.length > 0;
  const isOpen = Boolean(activeToolbarPanel);

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <div>
          {hasSnippets && (
            <ToolbarItem
              active={isSnippetsOpen}
              title={`Insert snippet (${
                navigator.platform.match('Mac') ? '\u2318' : 'Ctrl + '
              }K)`}
              disabled={!validCursorPosition}
              data-testid="toggleSnippets"
              onClick={() => {
                dispatch({
                  type: 'toggleToolbar',
                  payload: { panel: 'snippets' },
                });
              }}
            >
              <AddIcon />
            </ToolbarItem>
          )}
          <ToolbarItem
            active={isFramesOpen}
            showIndicator={hasFilteredFrames}
            title="Configure visible frames"
            onClick={() => {
              dispatch({
                type: 'toggleToolbar',
                payload: { panel: 'frames' },
              });
            }}
            data-testid="toggleFrames"
          >
            <FramesIcon />
          </ToolbarItem>
          <ToolbarItem
            active={isPreviewOpen}
            title="Preview playroom"
            disabled={code.trim().length === 0}
            onClick={() => {
              dispatch({
                type: 'toggleToolbar',
                payload: { panel: 'preview' },
              });
            }}
            data-testid="togglePreview"
          >
            <PlayIcon />
          </ToolbarItem>
        </div>

        <div>
          <ToolbarItem
            title="Copy link to clipboard"
            success={copying}
            onClick={copyHandler}
            data-testid="copyToClipboard"
          >
            <ShareIcon />
          </ToolbarItem>
          <ToolbarItem
            active={isSettingsOpen}
            title="Edit settings"
            onClick={() =>
              dispatch({
                type: 'toggleToolbar',
                payload: { panel: 'settings' },
              })
            }
          >
            <SettingsIcon />
          </ToolbarItem>
        </div>
      </div>
      {isOpen && (
        <div className={styles.panel}>
          {isSnippetsOpen && (
            <Snippets
              snippets={snippets}
              onClose={(snippet) => {
                if (snippet && editorView) {
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
                } else {
                  dispatch({ type: 'closeToolbar' });
                }
              }}
            />
          )}
          {isFramesOpen && (
            <FramesPanel
              availableWidths={allWidths}
              availableThemes={allThemes}
            />
          )}

          {isPreviewOpen && (
            <PreviewPanel themes={allThemes} visibleThemes={visibleThemes} />
          )}

          {isSettingsOpen && <SettingsPanel />}
        </div>
      )}
    </div>
  );
};
