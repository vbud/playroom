import dedent from 'dedent';
import { positionToCursorOffset } from './cursor';

import { formatCode, formatAndInsert } from './formatting';

// Test utility method for adding the EOF newline that dedent would otherwise
// strip.
const modifiedDedent = (code: string) => `${dedent(code)}\n`;

describe('formatting code', () => {
  const output = modifiedDedent(`
    <div>
      <h1>Title</h1>
    </div>`);

  it('should handle one line', () => {
    const input = `<div><h1>Title</h1></div>`;

    expect(formatCode({ code: input, cursor: 9 })).toEqual({
      cursor: positionToCursorOffset(output, { line: 1, ch: 6 }),
      code: output,
    });
  });

  it('should handle multiple lines', () => {
    const input = `<div>\n<h1>Title</h1>\n</div>`;
    expect(formatCode({ code: input, cursor: 10 })).toEqual({
      cursor: positionToCursorOffset(output, { line: 1, ch: 6 }),
      code: output,
    });
  });

  it('should handle multiple lines with cursor at start of line', () => {
    const input = `<div>\n<h1>Title</h1>\n</div>`;
    expect(formatCode({ code: input, cursor: 0 })).toEqual({
      cursor: 0,
      code: output,
    });
  });
});

describe('format and insert', () => {
  it('should handle inserting one line into one line', () => {
    const snippet = '<span>added</span>';
    const input = `<div><h1>Title</h1></div>`;
    const output = modifiedDedent(`
      <div>
        <h1>
          <span>added</span>Title
        </h1>
      </div>`);
    expect(formatAndInsert({ code: input, cursor: 9, snippet })).toEqual({
      cursor: positionToCursorOffset(output, { line: 2, ch: 22 }),
      code: output,
    });
  });

  it('should handle inserting multiple lines into multiple lines', () => {
    const snippet = '<span>\n  <strong>second</strong>\n</span>';
    const input = `<div>\n  <h1>\n    <span>added</span>Title\n  </h1>\n</div>\n`;
    const output = modifiedDedent(`
    <div>
      <h1>
        <span>
          added
          <span>
            <strong>second</strong>
          </span>
        </span>
        Title
      </h1>
    </div>`);
    expect(
      formatAndInsert({
        code: input,
        cursor: positionToCursorOffset(input, { line: 2, ch: 15 }),
        snippet,
      })
    ).toEqual({
      cursor: positionToCursorOffset(output, { line: 6, ch: 13 }),
      code: output,
    });
  });
});
