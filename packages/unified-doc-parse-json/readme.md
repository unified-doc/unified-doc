# unified-doc-parse-json

[**unified-doc**][unified-doc] parser to parse JSON content into a [hast][hast] tree with a single code block node i.e.  `<pre><code>{JSON}</code></pre>`.

## Install

```sh
npm install unified-doc-parse-json
```

## Use

```js
import json from "unified-doc-parse-json";
import unified from "unified";

const options = {
  classNames: ['class-a', 'class-b'],
  space: 4,
};
const processor = unified().use(json, options);
const content = JSON.stringify({
  1: 'two',
  three: [4, 'five'],
  '6': true,
  '7': false,
  '8': null,
});

expect(processor.parse(content)).toEqual({
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'pre',
      position: {
        start: {
          column: 1,
          line: 1,
          offset: 0,
        },
        end: {
          column: 2,
          line: 10,
          offset: 112,
        },
      },
      children: [
        {
          type: 'element',
          tagName: 'code',
          position: {
            start: {
              column: 1,
              line: 1,
              offset: 0,
            },
            end: {
              column: 2,
              line: 10,
              offset: 112,
            },
          },
          children: [
            {
              type: 'text',
              value:
                '{\n    "1": "two",\n    "6": true,\n    "7": false,\n    "8": null,\n    "three": [\n        4,\n        "five"\n    ]\n}',
              position: {
                start: {
                  column: 1,
                  line: 1,
                  offset: 0,
                },
                end: {
                  column: 2,
                  line: 10,
                  offset: 112,
                },
              },
            },
          ],
          properties: {
            className: ['class-a', 'class-b'],
          },
        },
      ],
    },
  ],
  position: {
    start: {
      column: 1,
      line: 1,
      offset: 0,
    },
    end: {
      column: 2,
      line: 10,
      offset: 112,
    },
  },
});
```

## API

### `unified().use(json[, options])`

Parse JSON content into a single code block node i.e. `<pre><code>{JSON}</code></pre>`.  Use the parser with any unified processor.

#### `options`

```ts
interface Options {
  /** classnames attached to the pre node containing the JSON */
  classNames?: string[];
  /** reformat the JSON with the provided whitespace */
  space?: number;
}
```

<!-- Definitions -->
[hast]: https://github.com/syntax-tree/hast
[unified-doc]: https://github.com/unified-doc/unified-doc
