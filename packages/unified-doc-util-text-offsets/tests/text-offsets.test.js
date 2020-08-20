import { hast } from './fixtures';
import textOffsets from '../lib/text-offsets';

describe(textOffsets, () => {
  it('should return a new unmodified tree', () => {
    const emptyHast = { type: 'root', children: [] };
    expect(textOffsets(emptyHast)).not.toBe(emptyHast);
    expect(textOffsets(emptyHast)).toEqual(emptyHast);
  });

  it('should apply the correct text offsets for text nodes only', () => {
    const withTextOffsets = textOffsets(hast);
    expect(withTextOffsets).not.toEqual(hast);
    expect(withTextOffsets).toEqual({
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
                  data: {
                    textOffset: {
                      start: 0,
                      end: 4,
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
              data: {
                textOffset: {
                  start: 4,
                  end: 12,
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
    });
  });
});
