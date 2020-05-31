import parser from '../../../../packages/unified-doc-parse-text/lib/parser';

import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('should parse a file with empty content', () => {
    expect(parser('')).to.deep.equal({
      type: 'root',
      children: [],
    });
  });

  it('should parse a file with a single line of content', () => {
    expect(parser('a to the b to the c')).to.deep.equal({
      type: 'root',
      children: [
        {
          type: 'text',
          value: 'a to the b to the c',
          position: {
            start: {
              column: 1,
              line: 1,
              offset: 0,
            },
            end: {
              column: 20,
              line: 1,
              offset: 19,
            },
          },
        },
      ],
      position: {
        start: {
          column: 1,
          line: 1,
          offset: 0,
        },
        end: {
          column: 20,
          line: 1,
          offset: 19,
        },
      },
    });
  });

  it('should parse a file with many lines of content', () => {
    expect(parser('\na to the \nb to the \n\nc to the d')).to.deep.equal({
      type: 'root',
      children: [
        {
          type: 'text',
          value: '\na to the \nb to the \n\nc to the d',
          position: {
            start: {
              column: 1,
              line: 1,
              offset: 0,
            },
            end: {
              column: 11,
              line: 5,
              offset: 32,
            },
          },
        },
      ],
      position: {
        start: {
          column: 1,
          line: 1,
          offset: 0,
        },
        end: {
          column: 11,
          line: 5,
          offset: 32,
        },
      },
    });
  });
});
