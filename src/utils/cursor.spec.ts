import dedent from 'dedent';

import { isValidLocation, positionToCursorOffset } from './cursor';

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
            cursor: positionToCursorOffset(code, { line: 1, ch: 0 }),
          },
          output: true,
        },
        {
          should: 'end of line after component is valid',
          input: {
            code,
            cursor: positionToCursorOffset(code, { line: 1, ch: 7 }),
          },
          output: true,
        },
        {
          should: 'middle of line inside component is valid',
          input: {
            code,
            cursor: positionToCursorOffset(code, { line: 3, ch: 7 }),
          },
          output: true,
        },
        {
          should: 'middle of line inside tag is not valid',
          input: {
            code,
            cursor: positionToCursorOffset(code, { line: 3, ch: 5 }),
          },
          output: false,
        },
        {
          should: 'start of line inside between attributes is not valid',
          input: {
            code,
            cursor: positionToCursorOffset(code, { line: 10, ch: 0 }),
          },
          output: false,
        },
      ].forEach(({ should, input, output }) => {
        // eslint-disable-next-line jest/valid-title
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
      ch: 4,
    }; // Before the capital T

    expect(positionToCursorOffset(code, offset)).toEqual(4);
  });

  it('should work across multiple lines', () => {
    const code = `<div>\n<h1>Title</h1>\n</div>`;
    const offset = {
      line: 1,
      ch: 4,
    };

    expect(positionToCursorOffset(code, offset)).toEqual(10);
  });
});
