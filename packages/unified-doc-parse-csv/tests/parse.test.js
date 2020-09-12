import parser from '../lib/parser';

describe(parser, () => {
  it('should parse empty content to empty trees', () => {
    expect(parser()).toEqual({
      type: 'element',
      tagName: 'table',
      children: [],
      properties: {},
    });
    expect(parser('')).toEqual({
      type: 'element',
      tagName: 'table',
      children: [],
      properties: {},
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

    expect(parser('content-without\tcomma-delimiters')).toEqual({
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
                      value: 'content-without\tcomma-delimiters',
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

  it('should apply RFC-4180 behaviors (dquotes, escape, newlines)', () => {
    const hast = parser('"c,,,ol\n\n\n\n1","c""ol""""2","col,\n""3"\n');
    expect(hast).toHaveProperty('tagName', 'table');
    expect(hast).toHaveProperty('children.0.tagName', 'tbody');
    expect(hast).toHaveProperty('children.0.children.0.tagName', 'tr');
    expect(hast).toHaveProperty(
      'children.0.children.0.children.0.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.0.children.0.value',
      'c,,,ol\n\n\n\n1',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.1.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.1.children.0.value',
      'c"ol""2',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.2.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.2.children.0.value',
      'col,\n"3',
    );
  });

  it('should parse into tbody rows with no thead', () => {
    const hast = parser(
      'row0col0,row0col1,row0col2\nrow1col0,row1col1,row1col2',
    );
    expect(hast).toHaveProperty('tagName', 'table');
    expect(hast).toHaveProperty('children.0.tagName', 'tbody');
    // first row
    expect(hast).toHaveProperty('children.0.children.0.tagName', 'tr');
    expect(hast).toHaveProperty(
      'children.0.children.0.children.0.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.0.children.0.value',
      'row0col0',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.1.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.1.children.0.value',
      'row0col1',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.2.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.2.children.0.value',
      'row0col2',
    );

    // second row
    expect(hast).toHaveProperty('children.0.children.1.tagName', 'tr');
    expect(hast).toHaveProperty(
      'children.0.children.1.children.0.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.1.children.0.children.0.value',
      'row1col0',
    );
    expect(hast).toHaveProperty(
      'children.0.children.1.children.1.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.1.children.1.children.0.value',
      'row1col1',
    );
    expect(hast).toHaveProperty(
      'children.0.children.1.children.2.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.0.children.1.children.2.children.0.value',
      'row1col2',
    );
  });

  it('should parse into tbody and thead rows if options.header is true', () => {
    const hast = parser(
      'row0col0,row0col1,row0col2\nrow1col0,row1col1,row1col2\nrow2col0,row2col1,row2col2',
      { header: true },
    );
    expect(hast).toHaveProperty('tagName', 'table');
    // thead
    expect(hast).toHaveProperty('children.0.tagName', 'thead');
    expect(hast).toHaveProperty('children.0.children.0.tagName', 'tr');
    expect(hast).toHaveProperty(
      'children.0.children.0.children.0.tagName',
      'th',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.0.children.0.value',
      'row0col0',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.1.tagName',
      'th',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.1.children.0.value',
      'row0col1',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.2.tagName',
      'th',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.2.children.0.value',
      'row0col2',
    );

    // tbody first row
    expect(hast).toHaveProperty('children.1.tagName', 'tbody');
    expect(hast).toHaveProperty('children.1.children.0.tagName', 'tr');
    expect(hast).toHaveProperty(
      'children.1.children.0.children.0.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.1.children.0.children.0.children.0.value',
      'row1col0',
    );
    expect(hast).toHaveProperty(
      'children.1.children.0.children.1.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.1.children.0.children.1.children.0.value',
      'row1col1',
    );
    expect(hast).toHaveProperty(
      'children.1.children.0.children.2.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.1.children.0.children.2.children.0.value',
      'row1col2',
    );
    // tbody second row
    expect(hast).toHaveProperty('children.1.children.1.tagName', 'tr');
    expect(hast).toHaveProperty(
      'children.1.children.1.children.0.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.1.children.1.children.0.children.0.value',
      'row2col0',
    );
    expect(hast).toHaveProperty(
      'children.1.children.1.children.1.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.1.children.1.children.1.children.0.value',
      'row2col1',
    );
    expect(hast).toHaveProperty(
      'children.1.children.1.children.2.tagName',
      'td',
    );
    expect(hast).toHaveProperty(
      'children.1.children.1.children.2.children.0.value',
      'row2col2',
    );
  });
});
