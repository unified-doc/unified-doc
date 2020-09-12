# unified-doc-parse-csv

[**unified-doc**][unified-doc] parser to parse csv content into a [hast][hast] table node ([RFC-4180][] compliant).

## Install

```sh
npm install unified-doc-parse-csv
```

## Use

Given some [RFC-4180][] compliant CSV content, parse into a [hast][] table with semantic `table`, `tbody`, `tr`, `td` nodes

```js
import csv from "unified-doc-parse-csv";
import unified from "unified";

const content = 'row0col0,row0col1,row0col2\nrow1col0,row1col1,row1col2';

const processor = unified().use(csv);

expect(processor.parse(content)).toEqual({
  type: 'element',
  tagName: 'table',
  properties: {},
  children: [
    {
      type: 'element',
      tagName: 'tbody',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'tr',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row0col0',
                  position: {
                    start: {
                      line: 1,
                      column: 1,
                      offset: 0,
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
                  column: 1,
                  offset: 0,
                },
                end: {
                  line: 1,
                  column: 9,
                  offset: 8,
                },
              },
            },
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row0col1',
                  position: {
                    start: {
                      line: 1,
                      column: 10,
                      offset: 9,
                    },
                    end: {
                      line: 1,
                      column: 18,
                      offset: 17,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 10,
                  offset: 9,
                },
                end: {
                  line: 1,
                  column: 18,
                  offset: 17,
                },
              },
            },
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row0col2',
                  position: {
                    start: {
                      line: 1,
                      column: 19,
                      offset: 18,
                    },
                    end: {
                      line: 1,
                      column: 27,
                      offset: 26,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 19,
                  offset: 18,
                },
                end: {
                  line: 1,
                  column: 27,
                  offset: 26,
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
              column: 27,
              offset: 26,
            },
          },
        },
        {
          type: 'element',
          tagName: 'tr',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row1col0',
                  position: {
                    start: {
                      line: 2,
                      column: 1,
                      offset: 27,
                    },
                    end: {
                      line: 2,
                      column: 9,
                      offset: 35,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 2,
                  column: 1,
                  offset: 27,
                },
                end: {
                  line: 2,
                  column: 9,
                  offset: 35,
                },
              },
            },
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row1col1',
                  position: {
                    start: {
                      line: 2,
                      column: 10,
                      offset: 36,
                    },
                    end: {
                      line: 2,
                      column: 18,
                      offset: 44,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 2,
                  column: 10,
                  offset: 36,
                },
                end: {
                  line: 2,
                  column: 18,
                  offset: 44,
                },
              },
            },
            {
              type: 'element',
              tagName: 'td',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'row1col2',
                  position: {
                    start: {
                      line: 2,
                      column: 19,
                      offset: 45,
                    },
                    end: {
                      line: 2,
                      column: 27,
                      offset: 53,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 2,
                  column: 19,
                  offset: 45,
                },
                end: {
                  line: 2,
                  column: 27,
                  offset: 53,
                },
              },
            },
          ],
          position: {
            start: {
              line: 2,
              column: 1,
              offset: 27,
            },
            end: {
              line: 2,
              column: 27,
              offset: 53,
            },
          },
        },
      ],
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
      column: 27,
      offset: 53,
    },
  },
});
```

## API

### `unified().use(content[, options])`

#### Interface
```ts
function parse(
  /** Configurable options (compatible with tdast-util-from-csv's options) */
  options?: Options
): void;
```

hast parser to parse csv content into a hast table node ([RFC-4180][] compliant).

Use the parser with any unified processor.  Implemented with [`tdast-util-from-csv`][tdast-util-from-csv] and [`tdast-util-to-hast-table`][tdast-util-to-hast-table].

#### Related interfaces
```ts
interface Options {
  // if the first row of the CSV contains header values
  header?: boolean;
}
```

<!-- Definitions -->
[hast]: https://github.com/syntax-tree/hast
[rfc-4180]: https://tools.ietf.org/html/rfc4180
[tdast-util-from-csv]: https://github.com/tdast/tdast-util-from-csv
[tdast-util-to-hast-table]: https://github.com/tdast/tdast-util-to-hast-table
[rehype]: https://github.com/rehypejs/rehype
[unified-doc]: https://github.com/unified-doc/unified-doc
