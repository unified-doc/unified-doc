# unified-doc-parse-text

[**unified-doc**][unified-doc] parser to parse text content into a [hast][hast] tree with a single text node.

## Install

```sh
npm install unified-doc-parse-text
```

## Use

```js
import text from "unified-doc-parse-text";
import unified from "unified";

const processor = unified().use(text);
const content = "\na to the \nb to the \n\nc to the d";

expect(processor.parse(content)).toEqual({
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
});
```

## API

- [`parse()`](#parse)

### `parse()`
#### Interface
```ts
function parse(): void;
```
Trivially parse text content into a single text node.

Use the parser with any unified processor.

<!-- Definitions -->
[hast]: https://github.com/syntax-tree/hast
[unified-doc]: https://github.com/unified-doc/unified-doc
