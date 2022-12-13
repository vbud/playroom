import React, { useCallback, useContext } from 'react';
import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
  EditorView,
  ViewUpdate,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import {
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete';
import { Diagnostic, linter, lintKeymap } from '@codemirror/lint';
import { javascript } from '@codemirror/lang-javascript';
import { debounce } from 'lodash';

import { StoreContext } from 'src/StoreContext/StoreContext';
import { formatCode } from 'src/utils/formatting';
import { compileJsx } from 'src/utils/compileJsx';
import { cursorCoordinatesToCursorPosition } from 'src/utils/cursor';
import { Hints } from 'src/utils/componentsToHints';
import { getCompletions } from './completions';
import { highlightStyle, themeExtension } from './styles';

import * as styles from './CodeEditor.css';

const errorLinter = linter((view) => {
  const diagnostics: Diagnostic[] = [];
  const code = view.state.doc.toString();

  try {
    compileJsx(code);
  } catch (err) {
    let errorMessage = '';
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    const matches = errorMessage.match(/\(([0-9]+):([0-9]+)\)/);
    let line, col;
    if (matches && matches.length === 3) {
      line = parseInt(matches[1], 10);
      col = parseInt(matches[2], 10);
    }

    if (line && line >= 0 && col && col >= 0) {
      const cursor = cursorCoordinatesToCursorPosition(code, {
        line: line - 1,
        col,
      });
      diagnostics.push({
        from: cursor,
        to: cursor + 1,
        severity: 'error',
        message: errorMessage,
      });
    }
  }

  return diagnostics;
});

export const CodeEditor = ({ hints }: { hints: Hints }) => {
  const [{ code }, dispatch] = useContext(StoreContext);

  const setupEditor = useCallback((node: HTMLDivElement) => {
    if (node) {
      const updateEditorState = debounce((payload) => {
        dispatch({
          type: 'updateEditorState',
          payload,
        });
      }, 250);

      const updateListener = EditorView.updateListener.of(
        (viewUpdate: ViewUpdate) => {
          if (viewUpdate.docChanged || viewUpdate.selectionSet) {
            updateEditorState({
              // updateListener is a non-react callback, so we need to get the
              // current code and cursor from editor state instead of from context.
              code: viewUpdate.state.doc.toString(),
              cursor: viewUpdate.state.selection.main.anchor,
            });
          }
        }
      );

      const extensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion({
          override: getCompletions(hints),
          icons: false,
        }),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        javascript({ jsx: true }),
        themeExtension,
        syntaxHighlighting(highlightStyle),
        errorLinter,
        updateListener,
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...lintKeymap,
          ...defaultKeymap,
          {
            key: 'Mod-s',
            run: (view: EditorView) => {
              const currentCode = view.state.doc.toString();
              const result = formatCode({
                code: currentCode,
                cursor: view.state.selection.main.anchor,
              });
              view.dispatch({
                changes: {
                  from: 0,
                  to: currentCode.length,
                  insert: result.code,
                },
                selection: { anchor: result.cursor },
              });
              return true;
            },
          },
          {
            key: 'Mod-k',
            run: () => {
              dispatch({
                type: 'toggleToolbar',
                payload: { panel: 'snippets' },
              });
              return true;
            },
          },
        ]),
      ];

      const initialState = EditorState.create({
        extensions,
        doc: code,
      });

      dispatch({
        type: 'initializeEditor',
        payload: {
          editorView: new EditorView({
            state: initialState,
            parent: node,
          }),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className={styles.root} ref={setupEditor} />;
};
