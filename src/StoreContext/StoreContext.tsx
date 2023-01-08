import React, {
  useEffect,
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import { EditorView } from 'codemirror';
import copy from 'copy-to-clipboard';
import localforage from 'localforage';
import { v4 as uuid } from 'uuid';

import { isValidLocation } from '../utils/cursor';
import playroomConfig from '../config';
import { ColorScheme, useColorScheme } from 'src/utils/colorScheme';
import { ViewPort } from 'src/Playroom/Canvas/ZoomableCanvas';

export const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1,
});

export type FrameId = string;

export interface FrameConfig {
  id: FrameId;
  code: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FrameConfigs = Record<string, FrameConfig>;

interface StatusMessage {
  message: string;
  tone: 'positive' | 'critical';
}

type ToolbarPanel = 'preview' | 'settings' | 'canvasZoomControl';

export type SelectedFrameId = string | undefined;

export interface State {
  editorView: EditorView | null;
  canvasViewport: ViewPort | null;
  frames: FrameConfigs;
  selectedFrameId: SelectedFrameId;
  cursorPosition: number;
  validCursorPosition: boolean;
  activeToolbarPanel?: ToolbarPanel;
  showSnippets: boolean;
  showCanvasOnly: boolean;
  editorWidth: number;
  statusMessage?: StatusMessage;
  ready: boolean;
  colorScheme: ColorScheme;
  canvasPosition: {
    left: number;
    top: number;
    zoom: number;
  };
}

interface MoveFramePayload {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

type Action =
  | { type: 'initialLoad'; payload: Partial<State> }
  | { type: 'initializeEditor'; payload: { editorView: EditorView } }
  | { type: 'destroyEditor' }
  | {
      type: 'updateEditorState';
      payload: { code: string; cursor: number };
    }
  | { type: 'initializeCanvas'; payload: { canvasViewport: ViewPort } }
  | { type: 'addFrame' }
  | { type: 'moveFrame'; payload: MoveFramePayload }
  | { type: 'deleteFrame'; payload: FrameId }
  | { type: 'selectFrame'; payload: SelectedFrameId }
  | { type: 'toggleToolbar'; payload: { panel: ToolbarPanel } }
  | { type: 'closeToolbar' }
  | { type: 'toggleSnippets' }
  | { type: 'toggleShowCanvasOnly' }
  | {
      type: 'copyToClipboard';
      payload: { url: string; trigger: 'toolbarItem' | 'previewPanel' };
    }
  | { type: 'displayStatusMessage'; payload: StatusMessage }
  | { type: 'dismissMessage' }
  | {
      type: 'updateColorScheme';
      payload: { colorScheme: ColorScheme };
    }
  | { type: 'updateEditorWidth'; payload: { editorWidth: number } }
  | { type: 'saveCanvasPosition'; payload: State['canvasPosition'] };

const createReducer =
  () =>
  (state: State, action: Action): State => {
    switch (action.type) {
      case 'initialLoad': {
        return {
          ...state,
          ...action.payload,
        };
      }

      case 'initializeEditor': {
        const { editorView } = action.payload;
        return {
          ...state,
          editorView,
        };
      }

      case 'destroyEditor': {
        state.editorView?.destroy();
        return {
          ...state,
          editorView: null,
        };
      }

      case 'updateEditorState': {
        const { code, cursor } = action.payload;
        const newState = { ...state };

        if (state.selectedFrameId) {
          const currentCode = state.frames[state.selectedFrameId].code;

          if (state.selectedFrameId && code !== currentCode) {
            const frames = {
              ...state.frames,
              [state.selectedFrameId]: {
                ...state.frames[state.selectedFrameId],
                code,
              },
            };
            store.setItem<State['frames']>('frames', frames);
            newState.frames = frames;
          }

          if (cursor !== state.cursorPosition) {
            newState.cursorPosition = cursor;
            newState.validCursorPosition = isValidLocation({
              code: currentCode,
              cursor,
            });
          }
        }

        return newState;
      }

      case 'initializeCanvas': {
        const { canvasViewport } = action.payload;
        return {
          ...state,
          canvasViewport,
        };
      }

      case 'addFrame': {
        const newFrameId = uuid();
        const frames = {
          ...state.frames,
          [newFrameId]: {
            id: newFrameId,
            code: '',
            x: 0,
            y: 0,
            width: 500,
            height: 500,
          },
        };
        store.setItem<State['frames']>('frames', frames);
        store.setItem<State['selectedFrameId']>('selectedFrameId', newFrameId);
        return {
          ...state,
          frames,
          selectedFrameId: newFrameId,
        };
      }

      case 'deleteFrame': {
        const frames = { ...state.frames };
        delete frames[action.payload];

        store.setItem<State['frames']>('frames', frames);
        store.setItem<State['selectedFrameId']>('selectedFrameId', undefined);
        return {
          ...state,
          frames,
          selectedFrameId: undefined,
        };
      }

      case 'moveFrame': {
        const { id, x, y, width, height } = action.payload;
        const updatedFrame = { ...state.frames[id] };

        if (x !== undefined) {
          updatedFrame.x = x;
        }
        if (y !== undefined) {
          updatedFrame.y = y;
        }
        if (width !== undefined) {
          updatedFrame.width = width;
        }
        if (height !== undefined) {
          updatedFrame.height = height;
        }

        const frames = {
          ...state.frames,
          [id]: updatedFrame,
        };
        store.setItem<State['frames']>('frames', frames);
        return {
          ...state,
          frames,
        };
      }

      case 'selectFrame': {
        const frameId = action.payload;

        store.setItem<State['selectedFrameId']>('selectedFrameId', frameId);

        if (frameId && state.editorView) {
          const { code } = state.frames[frameId];
          state.editorView.dispatch({
            changes: {
              from: 0,
              to: state.editorView.state.doc.toString().length,
              insert: code,
            },
          });
        }

        return {
          ...state,
          selectedFrameId: frameId,
        };
      }

      case 'displayStatusMessage': {
        return {
          ...state,
          statusMessage: action.payload,
        };
      }

      case 'dismissMessage': {
        return {
          ...state,
          statusMessage: undefined,
        };
      }

      case 'copyToClipboard': {
        const { url, trigger } = action.payload;

        copy(url);

        return {
          ...state,
          statusMessage:
            trigger === 'toolbarItem'
              ? {
                  message: 'Copied to clipboard',
                  tone: 'positive',
                }
              : undefined,
        };
      }

      case 'toggleToolbar': {
        const { panel } = action.payload;
        const { activeToolbarPanel: currentPanel, ...currentState } = state;
        const shouldOpen = panel !== currentPanel;

        if (shouldOpen) {
          if (
            panel === 'preview' &&
            state.selectedFrameId &&
            state.frames[state.selectedFrameId].code.trim().length === 0
          ) {
            return {
              ...state,
              statusMessage: {
                message: 'Must have code to preview',
                tone: 'critical',
              },
            };
          }

          return {
            ...currentState,
            statusMessage: undefined,
            activeToolbarPanel: panel,
          };
        }

        return currentState;
      }

      case 'closeToolbar': {
        return {
          ...state,
          activeToolbarPanel: undefined,
        };
      }

      case 'toggleSnippets': {
        return {
          ...state,
          showSnippets: !state.showSnippets,
        };
      }

      case 'toggleShowCanvasOnly': {
        const newState = {
          ...state,
          showCanvasOnly: !state.showCanvasOnly,
        };
        if (newState.showCanvasOnly) {
          newState.activeToolbarPanel = undefined;
        }

        return newState;
      }

      case 'updateColorScheme': {
        const { colorScheme } = action.payload;
        store.setItem('colorScheme', colorScheme);

        return {
          ...state,
          colorScheme,
        };
      }

      case 'updateEditorWidth': {
        const { editorWidth } = action.payload;
        store.setItem('editorWidth', editorWidth);

        return {
          ...state,
          editorWidth,
        };
      }

      case 'saveCanvasPosition': {
        store.setItem<State['canvasPosition']>(
          'canvasPosition',
          action.payload
        );
        return {
          ...state,
          canvasPosition: action.payload,
        };
      }

      default:
        return state;
    }
  };

type StoreContextValues = [State, Dispatch<Action>];

export const initialEditorWidth = 400;

const initialState: State = {
  frames: {},
  selectedFrameId: undefined,
  validCursorPosition: true,
  cursorPosition: 0,
  showSnippets: false,
  showCanvasOnly: false,
  editorView: null,
  editorWidth: initialEditorWidth,
  ready: false,
  colorScheme: 'system',
  canvasViewport: null,
  canvasPosition: {
    left: 0,
    top: 0,
    zoom: 1,
  },
};

export const StoreContext = createContext<StoreContextValues>([
  initialState,
  () => {},
]);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(createReducer(), initialState);

  useEffect(() => {
    Promise.all([
      store.getItem<State['frames']>('frames'),
      store.getItem<State['selectedFrameId']>('selectedFrameId'),
      store.getItem<State['editorWidth']>('editorWidth'),
      store.getItem<State['colorScheme']>('colorScheme'),
      store.getItem<State['canvasPosition']>('canvasPosition'),
    ]).then(
      ([frames, selectedFrameId, editorWidth, colorScheme, canvasPosition]) => {
        const payload: Partial<State> = {
          ready: true,
        };
        frames && (payload.frames = frames);
        selectedFrameId && (payload.selectedFrameId = selectedFrameId);
        editorWidth && (payload.editorWidth = editorWidth);
        colorScheme && (payload.colorScheme = colorScheme);
        canvasPosition && (payload.canvasPosition = canvasPosition);

        dispatch({
          type: 'initialLoad',
          payload,
        });
      }
    );
  }, []);

  useColorScheme(state.colorScheme);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
