export const hast = {
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'blockquote',
      properties: {},
      children: [
        {
          type: 'text',
          value: '\n',
          data: {
            textOffset: { start: 0, end: 1 },
          },
        },
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'strong',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'some',
                  data: {
                    textOffset: { start: 1, end: 5 },
                  },
                  position: {
                    start: {
                      line: 1,
                      column: 5,
                      offset: 4,
                    },
                    end: {
                      line: 1,
                      column: 9,
                      offset: 8,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 3,
                  offset: 2,
                },
                end: {
                  line: 1,
                  column: 11,
                  offset: 10,
                },
              },
            },
            {
              type: 'text',
              value: ' markdown content',
              data: {
                textOffset: { start: 5, end: 22 },
              },
              position: {
                start: {
                  line: 1,
                  column: 11,
                  offset: 10,
                },
                end: {
                  line: 1,
                  column: 28,
                  offset: 27,
                },
              },
            },
          ],
          position: {
            start: {
              line: 1,
              column: 3,
              offset: 2,
            },
            end: {
              line: 1,
              column: 28,
              offset: 27,
            },
          },
        },
        {
          type: 'text',
          value: '\n',
          data: {
            textOffset: { start: 22, end: 23 },
          },
        },
      ],
      position: {
        start: {
          line: 1,
          column: 1,
          offset: 0,
        },
        end: {
          line: 1,
          column: 28,
          offset: 27,
        },
      },
    },
  ],
  position: {
    start: {
      line: 1,
      column: 1,
      offset: 0,
    },
    end: {
      line: 1,
      column: 28,
      offset: 27,
    },
  },
};
