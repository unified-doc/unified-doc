# unified-doc-util-text-offsets

[**unified-doc**][unified-doc] [hast][] utility to add text offsets to text nodes.

---

## Install

```sh
npm install unified-doc-util-text-offsets
```

## Use

Given a `hast` tree parsed from some HTML content:

```js
import textOffsets from 'unified-doc-util-text-offsets';

// html: '<blockquote><strong>some</strong>\ncontent</blockquote>'
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

expect(textOffsets(hast)).toEqual({
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
  ]
});
```

## API
- [`textOffsets(hast)`](#textOffsetshast)

### `textOffsets(hast)`
#### Interface
```ts
function textOffsets(hast: Hast): Hast;
```

Accepts a `hast` tree and adds `textOffset` data to text nodes.  Returns a new tree.

A `TextOffset` for a `text` node tracks the start and end offset of its text value relative to the `textContent` representation of the provided `hast` tree.  The `textContent` representation of a `hast` tree is the concatenation of all text node values under the tree.  The following pseudocode helps visualize this behavior:

```js
const html = '<blockquote><strong>some</strong>\ncontent</blockquote>';
const textContent = 'some\ncontent';
const textNodes = ['some', '\ncontent'];
const textOffsets = [
  { start: 0, end: 4 }, // "[some]\ncontent"
  { start: 4, end: 12 }, // "some[\ncontent]"
];

// textOffset data mentioned above attached to text nodes
const withTextOffsets = textOffsets(hast);
```

#### Related interfaces
```ts
interface TextOffset = {
  /** start offset of the text node value relative to the `textContent` of the `hast` tree */
  start: number;
  /** end offset of the text node value relative to the `textContent` of the `hast` tree */
  end: number
}
```

<!-- Definitions -->
[hast]: https://github.com/syntax-tree/hast
[unified-doc]: https://github.com/unified-doc/unified-doc
