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
  defaultHighlightStyle,
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
import { lintKeymap } from '@codemirror/lint';
import { javascript } from '@codemirror/lang-javascript';
import { debounce } from 'lodash';

import { StoreContext } from 'src/StoreContext/StoreContext';
import { formatCode } from 'src/utils/formatting';
import { Hints } from 'src/utils/componentsToHints';
import { getCompletions } from './completions';
import {
  errorLineGutterHighlighter,
  highlightStyle,
  themeExtension,
} from './styles';

import * as styles from './CodeEditor.css';

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
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
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
        errorLineGutterHighlighter,
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
