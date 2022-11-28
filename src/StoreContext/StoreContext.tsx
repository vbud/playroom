import React, {
  useEffect,
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import copy from 'copy-to-clipboard';
import localforage from 'localforage';
import lzString from 'lz-string';
import dedent from 'dedent';
import { useDebouncedCallback } from 'use-debounce';

import { compressParams } from '../../utils';
import { getParamsFromQuery, updateUrlCode } from '../utils/params';
import { PlayroomProps } from '../Playroom/Playroom';
import { isValidLocation } from '../utils/cursor';
import playroomConfig from '../config';
import { EditorView } from 'codemirror';

const exampleCode = dedent(playroomConfig.exampleCode || '').trim();

const store = localforage.createInstance({
  name: playroomConfig.storageKey,
  version: 1,
});

export type EditorPosition = 'left' | 'undocked';
export type ColorScheme = 'light' | 'dark' | 'system';

const defaultPosition: EditorPosition = 'left';

const applyColorScheme = (colorScheme: Exclude<ColorScheme, 'system'>) => {
  document.documentElement[
    colorScheme === 'dark' ? 'setAttribute' : 'removeAttribute'
  ]('data-playroom-dark', '');
};

interface DebounceUpdateUrl {
  code?: string;
  themes?: string[];
  widths?: number[];
}

interface StatusMessage {
  message: string;
  tone: 'positive' | 'critical';
}

type ToolbarPanel = 'snippets' | 'frames' | 'preview' | 'settings';
interface State {
  editorView?: EditorView;
  code: string;
  cursorPosition: number;
  validCursorPosition: boolean;
  activeToolbarPanel?: ToolbarPanel;
  editorHidden: boolean;
  editorPosition: EditorPosition;
  editorHeight: number;
  editorWidth: number;
  statusMessage?: StatusMessage;
  visibleThemes?: string[];
  visibleWidths?: number[];
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
  | { type: 'hideEditor' }
  | { type: 'showEditor' }
  | {
      type: 'copyToClipboard';
      payload: { url: string; trigger: 'toolbarItem' | 'previewPanel' };
    }
  | { type: 'dismissMessage' }
  | {
      type: 'updateColorScheme';
      payload: { colorScheme: ColorScheme };
    }
  | {
      type: 'updateEditorPosition';
      payload: { position: EditorPosition };
    }
  | { type: 'resetEditorPosition' }
  | { type: 'updateEditorHeight'; payload: { size: number } }
  | { type: 'updateEditorWidth'; payload: { size: number } }
  | { type: 'updateVisibleThemes'; payload: { themes: string[] } }
  | { type: 'resetVisibleThemes' }
  | { type: 'updateVisibleWidths'; payload: { widths: number[] } }
  | { type: 'resetVisibleWidths' };

interface CreateReducerParams {
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}
const createReducer =
  ({
    themes: configuredThemes,
    widths: configuredWidths,
  }: CreateReducerParams) =>
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

      case 'hideEditor': {
        return {
          ...state,
          activeToolbarPanel: undefined,
          editorHidden: true,
        };
      }

      case 'showEditor': {
        return {
          ...state,
          editorHidden: false,
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

      case 'updateEditorPosition': {
        const { position } = action.payload;
        store.setItem('editorPosition', position);

        return {
          ...state,
          editorPosition: position,
        };
      }

      case 'resetEditorPosition': {
        store.setItem('editorPosition', defaultPosition);

        return {
          ...state,
          editorPosition: defaultPosition,
        };
      }

      case 'updateEditorHeight': {
        const { size } = action.payload;
        store.setItem('editorHeight', size);

        return {
          ...state,
          editorHeight: size,
        };
      }

      case 'updateEditorWidth': {
        const { size } = action.payload;
        store.setItem('editorWidth', size);

        return {
          ...state,
          editorWidth: size,
        };
      }

      case 'updateVisibleThemes': {
        const { themes } = action.payload;
        const visibleThemes = configuredThemes.filter((t) =>
          themes.includes(t)
        );
        store.setItem('visibleThemes', visibleThemes);

        return {
          ...state,
          visibleThemes,
        };
      }

      case 'resetVisibleThemes': {
        const { visibleThemes, ...restState } = state;
        store.removeItem('visibleThemes');

        return restState;
      }

      case 'updateVisibleWidths': {
        const { widths } = action.payload;
        const visibleWidths = configuredWidths.filter((w) =>
          widths.includes(w)
        );
        store.setItem('visibleWidths', visibleWidths);

        return {
          ...state,
          visibleWidths,
        };
      }

      case 'resetVisibleWidths': {
        const { visibleWidths, ...restState } = state;
        store.removeItem('visibleWidths');

        return restState;
      }

      default:
        return state;
    }
  };

type StoreContextValues = [State, Dispatch<Action>];

const initialState: State = {
  code: exampleCode,
  validCursorPosition: true,
  cursorPosition: 0,
  editorHidden: false,
  editorPosition: defaultPosition,
  editorHeight: 300,
  editorWidth: 360,
  ready: false,
  colorScheme: 'system',
};

export const StoreContext = createContext<StoreContextValues>([
  initialState,
  () => {},
]);

export const StoreProvider = ({
  children,
  themes,
  widths,
}: {
  children: ReactNode;
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}) => {
  const [state, dispatch] = useReducer(
    createReducer({ themes, widths }),
    initialState
  );
  const debouncedCodeUpdate = useDebouncedCallback(
    (params: DebounceUpdateUrl) => {
      // Ensure that when removing theme/width preferences
      // they are also removed from the url. Replacing state
      // with an empty string (returned from `createUrl`)
      // does not do anything, so replacing with `#`
      updateUrlCode(compressParams(params));
    },
    500
  );
  const hasThemesConfigured =
    (themes || []).filter((themeName) => themeName !== '__PLAYROOM__NO_THEME__')
      .length > 0;

  useEffect(() => {
    const params = getParamsFromQuery();
    let codeFromQuery: State['code'];
    let themesFromQuery: State['visibleThemes'];
    let widthsFromQuery: State['visibleWidths'];

    if (params.code) {
      const {
        code: parsedCode,
        themes: parsedThemes,
        widths: parsedWidths,
      } = JSON.parse(
        lzString.decompressFromEncodedURIComponent(String(params.code)) ?? ''
      );

      codeFromQuery = parsedCode;
      themesFromQuery = parsedThemes;
      widthsFromQuery = parsedWidths;
    }

    Promise.all([
      store.getItem<State['code']>('code'),
      store.getItem<State['editorPosition']>('editorPosition'),
      store.getItem<State['editorHeight']>('editorHeight'),
      store.getItem<State['editorWidth']>('editorWidth'),
      store.getItem<State['visibleWidths']>('visibleWidths'),
      store.getItem<State['visibleThemes']>('visibleThemes'),
      store.getItem<State['colorScheme']>('colorScheme'),
    ]).then(
      ([
        storedCode,
        storedPosition,
        storedHeight,
        storedWidth,
        storedVisibleWidths,
        storedVisibleThemes,
        storedColorScheme,
      ]) => {
        const code = codeFromQuery || storedCode || exampleCode;
        const editorPosition = storedPosition;
        const editorHeight = storedHeight;
        const editorWidth = storedWidth;
        const visibleWidths = widthsFromQuery || storedVisibleWidths;
        const visibleThemes =
          hasThemesConfigured && (themesFromQuery || storedVisibleThemes);
        const colorScheme = storedColorScheme;

        const payload: Partial<State> = {
          ready: true,
        };
        /* eslint-disable @typescript-eslint/no-unused-expressions */
        code && (payload.code = code);
        editorPosition && (payload.editorPosition = editorPosition);
        editorHeight && (payload.editorHeight = editorHeight);
        editorWidth && (payload.editorWidth = editorWidth);
        visibleThemes && (payload.visibleThemes = visibleThemes);
        visibleWidths && (payload.visibleWidths = visibleWidths);
        colorScheme && (payload.colorScheme = colorScheme);
        /* eslint-enable */

        dispatch({
          type: 'initialLoad',
          payload,
        });
      }
    );
  }, [hasThemesConfigured]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    if (state.colorScheme === 'system') {
      const handler = (e: MediaQueryListEvent) => {
        applyColorScheme(e.matches ? 'dark' : 'light');
      };
      mq.addEventListener('change', handler);
      applyColorScheme(mq.matches ? 'dark' : 'light');

      return () => {
        mq.removeEventListener('change', handler);
      };
    }

    applyColorScheme(state.colorScheme);
  }, [state.colorScheme]);

  useEffect(() => {
    debouncedCodeUpdate({
      code: state.code,
      themes: state.visibleThemes,
      widths: state.visibleWidths,
    });
  }, [
    state.code,
    state.visibleThemes,
    state.visibleWidths,
    debouncedCodeUpdate,
  ]);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
