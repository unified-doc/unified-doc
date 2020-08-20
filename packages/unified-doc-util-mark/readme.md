# unified-doc-util-mark

[**unified-doc**][unified-doc] [hast][hast] utility to mark text nodes.

## Install

```sh
npm install unified-doc-util-mark
```

## Use

Given a `hast` tree parsed from some HTML content:

```js
import mark from 'unified-doc-util-mark';

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

const marks = [
  { id: 'a', start: 1, end: 4, classNames: ['a', 'b'] },
];

expect(mark(hast, marks)).toEqual({
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
              value: 's',
            },
            {
              type: 'element',
              tagName: 'mark',
              properties: {
                dataMarkId: 'a',
                id: 'a',
                classNames: ['a', 'b'],
              },
              children: [
                {
                  type: 'text',
                  value: 'ome',
                },
              ],
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
});
```

`unified-doc-util-mark` also supports overlapping marks, and applying custom properties to marked nodes (`classNames`, `style`, `dataset`).

```js
const marks = [
  { id: 'a', start: 3, end: 8 , classNames: ['a', 'b'], dataset: { category: 'A' } },
  { id: 'b', start: 6, end: 10, style: { background: 'red' } },
];

expect(mark(hast, marks)).toEqual({
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
              value: 'som',
            },
            {
              type: 'element',
              tagName: 'mark',
              properties: {
                id: 'a',
                classNames: ['a', 'b'],
                dataMarkId: 'a',
                dataCategory: 'A',
              },
              children: {
                type: 'text',
                value: 'e',
              },
            },
          ],
        },
        {
          type: 'element',
          tagName: 'mark',
          properties: {
            classNames: ['a', 'b'],
            dataMarkId: 'a',
            dataCategory: 'A',
          },
          children: [
            {
              type: 'text',
              value: '\nc',
            },
            {
              type: 'element',
              tagName: 'mark',
              properties: {
                id: 'b',
                dataMarkId: 'b',
                style: 'background: red',
              },
              children: [
                {
                  type: 'text',
                  value: 'on',
                },
              ],
            },
          ],
          type: 'text',
          value: '\ncontent',
        },
        {
          type: 'element',
          tagName: 'mark',
          properties: {
            dataMarkId: 'b',
            style: 'background: red; color white',
          },
          children: [
            {
              type: 'text',
              value: 'te',
            },
          ],
          {
            type: 'text',
            value: 'nt',
          },
        },
      ],
    },
  ],
});
```

## API

```ts
function mark(hast: Hast, marks: Mark[]): Hast
```

Accepts a `hast` tree and applies `mark` to text nodes.  Returns a new tree.

### Interfaces

```ts
interface Mark {
  id: string;
  start: number;
  end: number;
  classNames?: string[];
  dataset?: Record<string, any>;
  data?: Record<string, any>;
  style?: Record<string, any>;
}
```

A `Mark` is an object that contains at least the `id`, `start` and `end` properties, which provides positional information on segments of text nodes that can be marked.  Common application of marks include:
- highlight/mark segments of text (e.g. search results).
- act as anchors to identify segments of text positionally.

`mark` nodes can be visually customized by specifying the optional `classNames`, `style` and `dataset` properties.  All other data maybe organized under the `data` property.

The `start` and `end` properties of a `Mark` indicate text offset values relative to the `textContent` of the provided `hast` tree.  The mark algorithm uses these offsets to determine how to insert marked `mark` nodes in the tree only within the specified offset range, while preserving the semantic structure of the tree.

The following pseudocode helps visualize the expected behavior:

```js
const html = '<blockquote><strong>some</strong>\ncontent</blockquote>'jj
const textContent = 'some\ncontent';
const textNodes = ['some', '\ncontent'];
const textOffsets = [
  { start: 0, end: 4 }, // "[some]\ncontent"
  { start: 4, end: 12 }, // "some[\ncontent]"
];

const marks = [
  { id: 'a', classNames: ['a', 'b'], start: 3, end: 8 },
  { id: 'b', style: { background: 'red' }, start: 6, end: 10 },
];
const markedTextSegments = [
  {
    value: 'som', // "[som]e" text node
    textOffset: { start: 0, end: 3},
    markIds: [], // not marked
  },
  {
    value: 'e', // "som[e]" text node
    textOffset: { start: 3, end: 4},
    markIds: ['a'], // marked by 'a'
  },
  {
    value: '\nc', // "[\nc]ontent" text node
    textOffset: { start: 4, end: 6},
    markIds: ['a'], // marked by 'a'
  },
  {
    value: 'on', // "\nc[on]tent" text node
    textOffset: { start: 6, end: 8},
    markIds: ['a', 'b'], // marked by 'a' + 'b'
  },
  {
    value: 'te', // "\ncon[te]nt" text node
    textOffset: { start: 8, end: 10},
    markIds: ['b'], // marked by 'b'
  },
  {
    value: 'nt', // "\nconte[nt]" text node
    textOffset: { start: 10, end: 12},
    markIds: [], // not marked
  },
];

// marked hast tree based on markedTextSegments computed above
const marked = mark(hast, marks);
```

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[unified-doc]: https://github.com/unified-doc/unified-doc
