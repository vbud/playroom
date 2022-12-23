import { EditorView } from '@codemirror/view';
import { HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { StyleSpec } from 'style-mod';

import { colorPaletteVars, vars } from '../theme.css';

const fontSize = '14px';

const themeOptions: Record<string, StyleSpec> = {
  '&': {
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
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 6px',
  },
  '.cm-tooltip-lint': {
    background: colorPaletteVars.background.surface,
    fontFamily: vars.font.family.code,
  },
  '.cm-diagnostic-error': {
    borderLeftColor: colorPaletteVars.background.critical,
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
