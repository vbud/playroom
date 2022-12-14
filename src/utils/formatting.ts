import prettier from 'prettier/standalone';
import babel from 'prettier/parser-babel';

import { insertAtCursor } from './cursor';

export interface CodeWithCursor {
  code: string;
  cursor: number;
}

export const runPrettier = ({
  code,
  cursorOffset,
}: {
  code: string;
  cursorOffset: number;
}) => {
  try {
    return prettier.formatWithCursor(code, {
      cursorOffset,
      parser: 'babel',
      plugins: [babel],
      semi: false,
    });
  } catch (e) {
    // Just a formatting error so we pass
    return null;
  }
};

export const formatCode = ({
  code,
  cursor,
}: CodeWithCursor): CodeWithCursor => {
  const result = runPrettier({
    code,
    cursorOffset: cursor,
  });

  if (result === null) {
    // Return inputs if formatting error occurs.
    return {
      code,
      cursor,
    };
  }

  // Remove the leading ';' that prettier adds, and adjust the cursor accordingly.
  return {
    code: result.formatted.slice(1),
    cursor: result.cursorOffset - 1,
  };
};

export const formatAndInsert = ({
  code,
  cursor,
  snippet,
}: {
  code: string;
  cursor: number;
  snippet: string;
}): CodeWithCursor => {
  const newCode = insertAtCursor({
    code,
    cursor,
    snippet,
  });

  return formatCode({
    code: newCode,
    cursor: cursor + snippet.length,
  });
};
