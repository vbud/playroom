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
import lzString from 'lz-string';
import dedent from 'dedent';
import { useDebouncedCallback } from 'use-debounce';

import { compressParams } from '../../utils';
import { getParamsFromQuery, updateUrlCode } from '../utils/params';
import { isValidLocation } from '../utils/cursor';
import playroomConfig from '../config';
import { ColorScheme, useColorScheme } from 'src/utils/colorScheme';

const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1,
});

interface DebounceUpdateUrl {
  code?: string;
}

interface StatusMessage {
  message: string;
  tone: 'positive' | 'critical';
}

type ToolbarPanel = 'snippets' | 'preview' | 'settings';
interface State {
  editorView?: EditorView;
  code: string;
  cursorPosition: number;
  validCursorPosition: boolean;
  activeToolbarPanel?: ToolbarPanel;
  isChromeHidden: boolean;
  editorWidth: number;
  statusMessage?: StatusMessage;
  ready: boolean;
  colorScheme: ColorScheme;
}

type Action =
  | { type: 'initialLoad'; payload: Partial<State> }
  | { type: 'initializeEditor'; payload: { editorView: EditorView } }
  | {
      type: 'updateEditorState';
      payload: { code: string; cursor: number };
    }
  | { type: 'toggleToolbar'; payload: { panel: ToolbarPanel } }
  | { type: 'closeToolbar' }
  | { type: 'hideChrome' }
  | { type: 'showChrome' }
  | {
      type: 'copyToClipboard';
      payload: { url: string; trigger: 'toolbarItem' | 'previewPanel' };
    }
  | { type: 'dismissMessage' }
  | {
      type: 'updateColorScheme';
      payload: { colorScheme: ColorScheme };
    }
  | { type: 'updateEditorWidth'; payload: { editorWidth: number } };

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

      case 'updateEditorState': {
        const { code, cursor } = action.payload;
        const newState = { ...state };

        if (code !== state.code) {
          store.setItem('code', code);
          newState.code = code;
        }

        if (cursor !== state.cursorPosition) {
          newState.cursorPosition = cursor;
          newState.validCursorPosition = isValidLocation({
            code: newState.code,
            cursor,
          });
        }

        return newState;
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
          if (panel === 'preview' && state.code.trim().length === 0) {
            return {
              ...state,
              statusMessage: {
                message: 'Must have code to preview',
                tone: 'critical',
              },
            };
          }

          if (panel === 'snippets') {
            const validCursorPosition = isValidLocation({
              code: currentState.code,
              cursor: currentState.cursorPosition,
            });

            if (!validCursorPosition) {
              return {
                ...currentState,
                statusMessage: {
                  message: "Can't insert snippet at cursor",
                  tone: 'critical',
                },
                validCursorPosition,
              };
            }

            return {
              ...currentState,
              statusMessage: undefined,
              activeToolbarPanel: panel,
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

      case 'hideChrome': {
        return {
          ...state,
          activeToolbarPanel: undefined,
          isChromeHidden: true,
        };
      }

      case 'showChrome': {
        return {
          ...state,
          isChromeHidden: false,
        };
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

      default:
        return state;
    }
  };

type StoreContextValues = [State, Dispatch<Action>];

export const initialEditorWidth = 400;

const initialState: State = {
  code: exampleCode,
  validCursorPosition: true,
  cursorPosition: 0,
  isChromeHidden: false,
  editorWidth: initialEditorWidth,
  ready: false,
  colorScheme: 'system',
};

export const StoreContext = createContext<StoreContextValues>([
  initialState,
  () => {},
]);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(createReducer(), initialState);
  const debouncedCodeUpdate = useDebouncedCallback(
    (params: DebounceUpdateUrl) => {
      updateUrlCode(compressParams(params));
    },
    500
  );

  useEffect(() => {
    const params = getParamsFromQuery();
    let codeFromQuery: State['code'];

    if (params.code) {
      const { code: parsedCode } = JSON.parse(
        lzString.decompressFromEncodedURIComponent(String(params.code)) ?? ''
      );

      codeFromQuery = parsedCode;
    }

    Promise.all([
      store.getItem<State['code']>('code'),
      store.getItem<State['editorWidth']>('editorWidth'),
      store.getItem<State['colorScheme']>('colorScheme'),
    ]).then(([storedCode, storedWidth, storedColorScheme]) => {
      const code = codeFromQuery || storedCode || exampleCode;
      const editorWidth = storedWidth;
      const colorScheme = storedColorScheme;

      const payload: Partial<State> = {
        ready: true,
      };
      /* eslint-disable @typescript-eslint/no-unused-expressions */
      code && (payload.code = code);
      editorWidth && (payload.editorWidth = editorWidth);
      colorScheme && (payload.colorScheme = colorScheme);
      /* eslint-enable */

      dispatch({
        type: 'initialLoad',
        payload,
      });
    });
  }, []);

  useColorScheme(state.colorScheme);

  useEffect(() => {
    debouncedCodeUpdate({
      code: state.code,
    });
  }, [state.code, debouncedCodeUpdate]);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
