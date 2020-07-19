# unified-doc-util-text-offsets

[**unified-doc**][unified-doc] [hast][hast] utility to add text offsets to text nodes.

## Install

```sh
npm install unified-doc-util-text-offsets
```

## Use

Given a `hast` tree parsed from some HTML content:

```js
import textOffsets from 'unified-doc-util-text-offsets';

const html = '<blockquote><strong>some</strong>\ncontent</blockquote>';

const hast = {
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
            },
          ],
        },
        {
          type: 'text',
          value: '\ncontent',
        },
      ],
    },
  ],
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
                textOffset: { start: 0, end: 4 },
              },
            },
          ],
        },
        {
          type: 'text',
          value: '\ncontent',
          data: {
            textOffset: { start: 4, end: 12 },
          },
        },
      ],
    },
  ],
};
```


## API

```ts
function textOffsets(hast: Hast): Hast;
```

Accepts a valid `hast` tree and applies `textOffset` data to text node.  Returns a new tree.

### Interfaces

```ts
interface TextOffset = {
  start: number;
  end: number;
}
```

A `TextOffset` for a `text` node tracks the start and end offset of its value relative to the `textContent` representation of the provided `hast` tree.

The following pseudocode aims to guide this understanding:

```js
const html = '<blockquote><strong>some</strong>\ncontent</blockquote>';
const textContent = 'some\ncontent';
const textNodes = ['some', '\ncontent'];
const textNodeOffsets = [
  { start: 0, end: 4 }, // from "[some]\ncontent"
  { start: 4, end: 12 }, // from "some[\ncontent]"
];


const hast = { ... };
const withTextOffsets = textOffsets(hast); // textOffset data added to text nodes.
```

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[unified-doc]: https://github.com/unified-doc/unified-doc
