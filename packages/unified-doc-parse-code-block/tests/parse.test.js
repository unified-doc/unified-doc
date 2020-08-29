import parser from '../lib/parser';

const content = `
var hello = "hi";

var world = "earth";
`;

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

  it('should parse non-empty content into a code block', () => {
    const position = {
      start: {
        column: 1,
        line: 1,
        offset: 0,
      },
      end: {
        column: 1,
        line: 5,
        offset: 41,
      },
    };
    expect(parser(content)).toEqual({
      type: 'root',
      position,
      children: [
        {
          type: 'element',
          tagName: 'pre',
          position,
          children: [
            {
              type: 'element',
              tagName: 'code',
              position,
              children: [
                {
                  type: 'text',
                  value: content,
                  position,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should apply code language as a className on the code node', () => {
    const position = {
      start: {
        column: 1,
        line: 1,
        offset: 0,
      },
      end: {
        column: 1,
        line: 5,
        offset: 41,
      },
    };
    expect(parser(content, { language: 'js' })).toEqual({
      type: 'root',
      position,
      children: [
        {
          type: 'element',
          tagName: 'pre',
          position,
          children: [
            {
              type: 'element',
              tagName: 'code',
              position,
              properties: {
                className: 'language-js',
              },
              children: [
                {
                  type: 'text',
                  value: content,
                  position,
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
