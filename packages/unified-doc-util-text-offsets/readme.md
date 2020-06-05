# unified-doc-util-text-offsets

Add text offsets to text nodes in a [`hast`][hast] tree.

## Install

```sh
npm install unified-doc-util-text-offsets
```

## Use

Given a hast tree parsed from some HTML content:

```js
import textOffsets from 'unified-doc-util-text-offsets';

const html = '<blockquote><strong>some</strong>\ncontent</blockquote>';

const hast = {
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'blockquote',
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
  data: {
    quirksMode: true,
  },
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

console.log(textOffsets(hast));
```

Yields:

```js
const output = {
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
              data: {
                textOffset: [0, 4],
              },
              position: ...,
            },
          ],
          position: ...,
        },
        {
          type: 'text',
          value: '\ncontent',
          data: {
            textOffset: [4, 12],
          },
          position: ...,
        },
      ],
      position: ...,
    },
  ],
  position: ...,
};
```


## API

### `textOffsets(hast)`

Utility to add `textOffset` data to all text nodes under a specified `hast` tree.

A `TextOffset` for a given node is a tuple that tracks the start and end offset of the node's `textContent` relative to the `textContent` of the provided `hast` tree.

A simple way to interpret this is presented in the pseudocode below:

```js
const html = '<blockquote><strong>some</strong>\ncontent</blockquote>';
const htmlTextContent = 'some\ncontent';
const textNodes = ['some', '\ncontent'];
const textNodeOffsets = [[0, 4], [4, 12]];

const hast = { ... } // parsed from html
const withTextOffsets = textOffsets(hast) // assign textNodesOffsets to relevant text nodes in the hast tree.
```

#### Parameters
- `node`: A valid `hast` node.

<!-- Links -->

[hast]: https://github.com/syntax-tree/hast
