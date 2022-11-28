import { validateCode } from './compileJsx';

const breakoutString = '<b>"b"</b>';

export const insertAtCursor = ({
  code,
  cursor,
  snippet,
}: {
  code: string;
  cursor: number;
  snippet: string;
}) => `${code.slice(0, cursor)}${snippet}${code.slice(cursor)}`;

export const isValidLocation = ({
  code,
  cursor,
}: {
  code: string;
  cursor: number;
}) =>
  code.length === 0
    ? true
    : validateCode(
        insertAtCursor({
          code,
          cursor,
          snippet: breakoutString,
        })
      );

interface CursorPosition {
  line: number;
  ch: number;
}
export const positionToCursorOffset = (
  code: string,
  { line, ch }: CursorPosition
): number =>
  code.split('\n').reduce((pos, currLine, index) => {
    if (index < line) {
      return pos + currLine.length + 1;
    } else if (index === line) {
      return pos + ch;
    }
    return pos;
  }, 0);
