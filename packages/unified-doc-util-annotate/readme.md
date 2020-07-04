# unified-doc-util-annotate

[**unified-doc**][unified-doc] [hast][hast] utility to annotate text nodes.

## Install

```sh
npm install unified-doc-util-annotate
```

## Use

Given a hast tree parsed from some HTML content:


```js
import annotate from 'unified-doc-util-annotate';

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

const annotations = [
  { id: 'a', classNames: ['a', 'b'], start: 1, end: 4 },
];

console.log(annotate(hast, { annotations }));
```

Yields:

```js
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
              value: 's',
            },
            {
              type: 'element',
              tagName: 'mark',
              properties: {
                dataAnnotationId: 'a',
                dataCategory: 'A',
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
};
```

`unified-doc-util-annotate` also supports annotating over multiple text nodes and overlapping annotations, and applying custom properties to the annotated mark nodes (`classNames`, `style`, `dataset` attributes).

```js
const annotations = [
  { id: 'a', start: 3, end: 8 , classNames: ['a', 'b'], dataset: { category: 'A' } },
  { id: 'b', start: 6, end: 10, style: { background: 'red' } },
];

console.log(annotate(hast, { annotations }));
```

Yields:

```js
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
              value: 'som',
            },
            {
              type: 'element',
              tagName: 'mark',
              properties: {
                id: 'a',
                classNames: ['a', 'b'],
                dataAnnotationId: 'a',
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
            dataAnnotationId: 'a',
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
                dataAnnotationId: 'b',
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
            dataAnnotationId: 'b',
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
};
```

## API

```ts
function annotate(hast: Hast, annotations: Annotation[]): Hast
```

Accepts a valid `hast` tree with options and applies `annotations`.  Returns a new tree.

### Interfaces

```ts
interface Annotation {
  id: string;
  start: number;
  end: number;
  classNames?: string[];
  dataset?: Record<string, any>;
  data?: Record<string, any>;
  style?: Record<string, any>;
}
```

An `Annotation` is an object that contains requried `id`, `start` and `end` field.  Optional ways to customize the annotation can be provided with the `classNames`, `style` and `dataset` properties.  Additional contextual data not used for annotation rendering can be defined under the `data` property.

The `start` and `end` field are offset values relative to the `textContent` of the provided `hast` tree.  The annotation algorithm uses these offsets against the tree's `textContent` to decide how to insert `mark` nodes with associated data while maintaining the semantic structure of the tree.

The following pseudocode should aid this understanding:

```js
const html = '<blockquote><strong>some</strong>\ncontent</blockquote>';
const htmlText = 'some\ncontent';
const textNodes = ['some', '\ncontent'];
const textNodeOffsets = [
  { start: 0, end: 4 }, // from "[some]\ncontent"
  { start: 4, end: 12 }, // from "some[\ncontent]"
];

const htmlHast = { ... };
const annotations = [
  { id: 'a', classNames: ['a', 'b'], start: 3, end: 8 },
  { id: 'b', style: { background: 'red' }, start: 6, end: 10 },
];
const expectedTextSegments = [
  {
    value: 'som', // from "[som]e" text node
    textOffset: { start: 0, end: 3},
    annotationIds: [], // not annotated
  },
  {
    value: 'e', // from "som[e]" text node
    textOffset: { start: 3, end: 4},
    annotationIds: ['a'], // annotated by 'a'
  },
  {
    value: '\nc', // from "[\nc]ontent" text node
    textOffset: { start: 4, end: 6},
    annotationIds: ['a'], // annotated by 'a'
  },
  {
    value: 'on', // from "\nc[on]tent" text node
    textOffset: { start: 6, end: 8},
    annotationIds: ['a', 'b'], // annotated by 'a' + 'b'
  },
  {
    value: 'te', // from "\ncon[te]nt" text node
    textOffset: { start: 8, end: 10},
    annotationIds: ['b'], // annotated by 'b'
  },
  {
    value: 'nt', // from "\nconte[nt]" text node
    textOffset: { start: 10, end: 12},
    annotationIds: [], // not annotated
  },
];

/**
 * Apply expectedTextSegments with annotation properties
 * to relevant text nodes in the hast tree.
 * Preserves the semantic structure of the tree.
 */
const annotated = annotate(htmlHast, { annotations });
```

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[unified-doc]: https://github.com/unified-doc/unified-doc
