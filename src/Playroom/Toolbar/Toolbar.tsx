import React, { useContext, useRef } from 'react';

import { PlayroomProps } from '../Playroom';
import { useClickOutside } from 'src/utils/useClickOutside';
import { StoreContext } from 'src/StoreContext/StoreContext';
import ToolbarItem from './ToolbarItem/ToolbarItem';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import ZoomControlPanel from '../ZoomControlPanel/ZoomControlPanel';
import AddSnippetIcon from '../icons/AddSnippetIcon';
import AddFrameIcon from '../icons/AddFrameIcon';
import SettingsIcon from '../icons/SettingsIcon';

import * as styles from './Toolbar.css';

interface Props {
  snippets: PlayroomProps['snippets'];
}

export default function Toolbar({ snippets }: Props) {
  const [{ activeToolbarPanel, editorView, canvasPosition }, dispatch] =
    useContext(StoreContext);

  const clickOutsideHandler = () => {
    dispatch({ type: 'closeToolbar' });
  };
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, clickOutsideHandler);

  const isOpen = Boolean(activeToolbarPanel);
  const isSettingsOpen = activeToolbarPanel === 'settings';
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
        <AddFrameIcon />
      </ToolbarItem>
      <div className={styles.alignNextItemsRight} />
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
          {isSettingsOpen && <SettingsPanel />}
          {isZoomControlOpen && <ZoomControlPanel />}
        </div>
      )}
    </div>
  );
}
