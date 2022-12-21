import dedent from 'dedent';

import { isValidLocation, cursorCoordinatesToCursorPosition } from './cursor';

describe('cursor', () => {
  describe('isValidLocation', () => {
    const code = dedent`
    <a>
      <b />
      <c>
        <d>...</d>
        <e />
        ...
        <f>
          <g />
        </f>
        <h
          i="j"
        />
      </c>
    </a>`;

    describe('with cursor', () => {
      [
        {
          should: 'start of line after before component is valid',
          input: {
            code,
            cursor: cursorCoordinatesToCursorPosition(code, {
              line: 1,
              col: 0,
            }),
          },
          output: true,
        },
        {
          should: 'end of line after component is valid',
          input: {
            code,
            cursor: cursorCoordinatesToCursorPosition(code, {
              line: 1,
              col: 7,
            }),
          },
          output: true,
        },
        {
          should: 'middle of line inside component is valid',
          input: {
            code,
            cursor: cursorCoordinatesToCursorPosition(code, {
              line: 3,
              col: 7,
            }),
          },
          output: true,
        },
        {
          should: 'middle of line inside tag is not valid',
          input: {
            code,
            cursor: cursorCoordinatesToCursorPosition(code, {
              line: 3,
              col: 5,
            }),
          },
          output: false,
        },
        {
          should: 'start of line inside between attributes is not valid',
          input: {
            code,
            cursor: cursorCoordinatesToCursorPosition(code, {
              line: 10,
              col: 0,
            }),
          },
          output: false,
        },
      ].forEach(({ should, input, output }) => {
        it(should, () => {
          expect(isValidLocation(input)).toEqual(output);
        });
      });
    });
  });
});

describe('position to cursor offset', () => {
  it('should work for one line', () => {
    const code = `<h1>Title</h1>`;
    const offset = {
      line: 0,
      col: 4,
    }; // Before the capital T

    expect(cursorCoordinatesToCursorPosition(code, offset)).toEqual(4);
  });

  it('should work across multiple lines', () => {
    const code = `<div>\n<h1>Title</h1>\n</div>`;
    const offset = {
      line: 1,
      col: 4,
    };

    expect(cursorCoordinatesToCursorPosition(code, offset)).toEqual(10);
  });
});
