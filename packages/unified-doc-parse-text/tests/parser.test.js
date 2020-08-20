import parser from '../lib/parser';

describe(parser, () => {
  it('should parse empty content to empty trees', () => {
    expect(parser()).toEqual({
      type: 'root',
      children: [],
    });
    expect(parser('')).toEqual({
      type: 'root',
      children: [],
    });
  });

  it('should parse a single line of content to a single text node', () => {
    expect(parser('a to the b to the c')).toEqual({
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

  it('should parse many lines of content to a single text node', () => {
    expect(parser('\na to the \nb to the \n\nc to the d')).toEqual({
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
