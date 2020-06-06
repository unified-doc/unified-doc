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
            textOffset: [0, 1],
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
                    textOffset: [1, 5],
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
                textOffset: [5, 22],
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
            textOffset: [22, 23],
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

export const htmlContent =
  '<blockquote><strong>some</strong>\ncontent</blockquote>';

export const markdownContent = '> **some** markdown content';
