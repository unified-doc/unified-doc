export const hast = {
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'blockquote',
      children: [
        {
          type: 'element',
          tagName: 'strong',
          children: [
            {
              type: 'text',
              value: 'some',
              position: {
                start: {
                  line: 1,
                  column: 21,
                  offset: 20,
                },
                end: {
                  line: 1,
                  column: 25,
                  offset: 24,
                },
              },
            },
          ],
          position: {
            start: {
              line: 1,
              column: 13,
              offset: 12,
            },
            end: {
              line: 1,
              column: 34,
              offset: 33,
            },
          },
        },
        {
          type: 'text',
          value: '\ncontent',
          position: {
            start: {
              line: 1,
              column: 34,
              offset: 33,
            },
            end: {
              line: 2,
              column: 8,
              offset: 41,
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
          line: 2,
          column: 21,
          offset: 54,
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
      line: 2,
      column: 21,
      offset: 54,
    },
  },
};
