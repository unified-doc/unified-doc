# unified-doc-parse-text

unified document parser to parse text content into a [hast][hast] tree with a single text node.

## Install

```sh
npm install unified-doc-parse-text
```

## Use

```js
import text from "unified-doc-parse-text";
import unified from "unified";

const processor = unified().use(text);

processor.parse("\na to the \nb to the \n\nc to the d");
```

Yields a `hast` tree where the input content string is represented as a single text node.

```js
const parsed = {
  type: 'root',
  children: [
    {
      type: 'text',
      value: '\na to the \nb to the \n\nc to the d',
      position: {
        start: {
          column: 1,
          line: 1,
          offset: 0,
        },
        end: {
          column: 20,
          line: 1,
          offset: 19,
        },
      },
    },
  ],
  position: {
    start: {
      column: 1,
      line: 1,
      offset: 0,
    },
    end: {
      column: 20,
      line: 1,
      offset: 19,
    },
  },
};
```

## API

### `processor.use(parse)
```ts
export default function parse(): void;
```

Simply use the plugin with any unified processor.

<!-- Links -->

[hast]: https://github.com/syntax-tree/hast
