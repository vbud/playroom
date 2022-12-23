import React, { useContext, useState, useCallback, useRef } from 'react';
import { useTimeoutFn } from 'react-use';

import { PlayroomProps } from '../Playroom';
import { useClickOutside } from 'src/utils/useClickOutside';
import { StoreContext } from 'src/StoreContext/StoreContext';
import ToolbarItem from './ToolbarItem/ToolbarItem';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import ZoomControlPanel from '../ZoomControlPanel/ZoomControlPanel';
import ShareIcon from '../icons/ShareIcon';
import PlayIcon from '../icons/PlayIcon';
import AddSnippetIcon from '../icons/AddSnippetIcon';
import AddIcon from '../icons/AddIcon';
import SettingsIcon from '../icons/SettingsIcon';

import * as styles from './Toolbar.css';

interface Props {
  snippets: PlayroomProps['snippets'];
}

export default function Toolbar({ snippets }: Props) {
  const [
    { activeToolbarPanel, frames, selectedFrameId, editorView, canvasPosition },
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

  const clickOutsideHandler = () => {
    dispatch({ type: 'closeToolbar' });
  };
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, clickOutsideHandler);

  const isOpen = Boolean(activeToolbarPanel);
  const isSettingsOpen = activeToolbarPanel === 'settings';
  const isPreviewOpen = activeToolbarPanel === 'preview';
  const isZoomControlOpen = activeToolbarPanel === 'canvasZoomControl';

  const hasSnippets = snippets && snippets.length > 0;

  return (
    <div className={styles.root}>
      <ToolbarItem
        title={`Insert snippet (${
          navigator.platform.match('Mac') ? '\u2318' : 'Ctrl + '
        }K)`}
        disabled={!editorView || !hasSnippets}
        data-testid="toggleSnippets"
        onClick={() => {
          dispatch({
            type: 'toggleSnippets',
          });
        }}
      >
        <AddSnippetIcon />
      </ToolbarItem>
      <ToolbarItem
        title="Add new frame to canvas"
        data-testid="addFrame"
        onClick={() => {
          dispatch({
            type: 'addFrame',
          });
        }}
      >
        <AddIcon />
      </ToolbarItem>
      <div className={styles.alignNextItemsRight} />
      <ToolbarItem
        active={isPreviewOpen}
        title="Preview selected frame"
        disabled={
          !selectedFrameId || frames[selectedFrameId].code.trim().length === 0
        }
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
      <ToolbarItem
        title="Copy link to clipboard"
        success={copying}
        onClick={copyHandler}
        data-testid="copyToClipboard"
      >
        <ShareIcon />
      </ToolbarItem>
      <ToolbarItem
        title="Zoom level"
        onClick={() => {
          dispatch({
            type: 'toggleToolbar',
            payload: { panel: 'canvasZoomControl' },
          });
        }}
        data-testid="canvasZoomLevel"
      >
        {Math.round(canvasPosition.zoom * 100)}%
      </ToolbarItem>
      <ToolbarItem
        active={isSettingsOpen}
        title="Edit settings"
        onClick={() => {
          dispatch({
            type: 'toggleToolbar',
            payload: { panel: 'settings' },
          });
        }}
      >
        <SettingsIcon />
      </ToolbarItem>
      {isOpen && (
        <div ref={panelRef} className={styles.panel}>
          {isPreviewOpen && selectedFrameId && (
            <PreviewPanel selectedFrameId={selectedFrameId} />
          )}

          {isSettingsOpen && <SettingsPanel />}
          {isZoomControlOpen && <ZoomControlPanel />}
        </div>
      )}
    </div>
  );
}
