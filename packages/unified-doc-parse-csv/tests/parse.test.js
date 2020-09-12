import parser from '../lib/parser';

describe(parser, () => {
  it('should parse empty content to empty trees', () => {
    expect(parser()).toEqual({
      type: 'element',
      tagName: 'table',
      children: [],
    });
    expect(parser('')).toEqual({
      type: 'element',
      tagName: 'table',
      children: [],
    });
  });

  it('should parse single string into a table node with one row and cell (including properties and position)', () => {
    const position = {
      start: {
        line: 1,
        column: 1,
        offset: 0,
      },
      end: {
        line: 1,
        column: 33,
        offset: 32,
      },
    };
    const properties = {};

    expect(parser('content-without-comma-delimiters')).toEqual({
      type: 'element',
      tagName: 'table',
      position,
      properties,
      children: [
        {
          type: 'element',
          tagName: 'tbody',
          properties,
          children: [
            {
              type: 'element',
              tagName: 'tr',
              position,
              properties,
              children: [
                {
                  type: 'element',
                  tagName: 'td',
                  position,
                  properties,
                  children: [
                    {
                      type: 'text',
                      value: 'content-without-comma-delimiters',
                      position,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
