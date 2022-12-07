import { EditorView, gutterLineClass, GutterMarker } from '@codemirror/view';
import { RangeSet } from '@codemirror/state';
import { HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { StyleSpec } from 'style-mod';

import { colorPaletteVars, vars } from '../theme.css';
import { compileJsx } from 'src/utils/compileJsx';

export const errorClass = 'cm-errorLineGutter';

const fontSize = '16px';

const themeOptions: Record<string, StyleSpec> = {
  '&': {
    backgroundColor: colorPaletteVars.background.surface,
    color: colorPaletteVars.foreground.neutral,
    height: '100%',
    width: '100%',
  },
  '.cm-scroller': {
    fontSize,
  },
  '&.cm-focused .cm-selectionBackground, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection':
    {
      backgroundColor: colorPaletteVars.background.selection,
    },
  '& .cm-selectionMatch': {
    backgroundColor: colorPaletteVars.background.selection,
  },
  '.cm-gutters': {
    backgroundColor: colorPaletteVars.background.surface,
    color: colorPaletteVars.foreground.neutralSoft,
    borderRight: 'none',
  },
  '.cm-line': {
    fontFamily: vars.font.family.code,
  },
  '.cm-activeLine': {
    backgroundColor: 'transparent',
  },
  '.cm-activeLineGutter': {
    background: 'none',
    color: colorPaletteVars.foreground.neutral,
  },
  '.cm-lineNumbers': {
    '& .cm-gutterElement': {
      padding: '0 6px',
    },
    [`& .${errorClass}`]: {
      backgroundColor: colorPaletteVars.background.critical,
      color: colorPaletteVars.foreground.critical,
      borderRadius: vars.radii.large,
      '&.cm-activeLineGutter': {
        color: colorPaletteVars.foreground.neutral,
      },
    },
  },
  '.cm-cursor': {
    borderLeftColor: colorPaletteVars.foreground.neutral,
  },
  '.cm-tooltip-autocomplete': {
    boxShadow: colorPaletteVars.shadows.small,
    borderRadius: vars.radii.medium,
    backgroundColor: colorPaletteVars.background.surface,
    fontSize,
    fontFamily: vars.font.family.code,
    maxHeight: '20em',
    '&.cm-tooltip > ul': {
      minWidth: '200px',
      maxWidth: '400px',
      '& > li': {
        lineHeight: '150%',
        padding: '0 8px',
        '&[aria-selected]': {
          background: colorPaletteVars.background.accent,
          color: colorPaletteVars.foreground.neutralInverted,
        },
      },
    },
  },
};

export const themeExtension = EditorView.theme(themeOptions);

export const highlightStyle = HighlightStyle.define([
  { tag: [t.tagName], color: colorPaletteVars.code.tag },
  {
    tag: [t.variableName],
    color: colorPaletteVars.code.variable,
  },
  {
    tag: [t.number],
    color: colorPaletteVars.code.number,
  },
  {
    tag: [t.attributeName, t.keyword, t.propertyName],
    color: colorPaletteVars.code.attribute,
  },
]);

const errorLineGutterMarker = new (class extends GutterMarker {
  elementClass = errorClass;
})();
export const errorLineGutterHighlighter = gutterLineClass.compute(
  ['doc'],
  (state) => {
    const marks = [];

    try {
      compileJsx(state.doc.toString());
    } catch (err) {
      let errorMessage = '';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      const matches = errorMessage.match(/\(([0-9]+):/);
      const lineNumber =
        matches &&
        matches.length >= 2 &&
        matches[1] &&
        parseInt(matches[1], 10);
      if (lineNumber) {
        marks.push(
          errorLineGutterMarker.range(state.doc.line(lineNumber).from)
        );
      }
    }
    return RangeSet.of(marks);
  }
);
