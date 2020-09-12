# unified-doc-parse-csv

[**unified-doc**][unified-doc] parser to parse csv content into a [hast][hast] table node ([RFC-4180][] compliant).

## Install

```sh
npm install unified-doc-parse-csv
```

## Use

```js
import csv from "unified-doc-parse-csv";
import unified from "unified";

const content = `
`

const processor = unified().use(csv);

expect(processor.parse(content)).toEqual({
});
```

## API

### `unified().use(content[, options])`

#### Interface
```ts
function parse(
  /** Configurable options (compatible with tdast-util-to-hast-table's options) */
  options?: Options
): void;
```

hast parser to parse csv content into a hast table node ([RFC-4180][] compliant).

Use the parser with any unified processor.

Implemented with [`tdast-util-from-csv`][tdast-util-from-csv] and [`tdast-util-to-hast-table`][tdast-util-to-hast-table].

#### Related interfaces
```ts
interface Options {
  /** use the `label` property of a tdast `Column` node for the text value of a hast thead node. */
  useColumnLabel?: boolean;
}
```

<!-- Definitions -->
[hast]: https://github.com/syntax-tree/hast
[rfc-4180]: https://tools.ietf.org/html/rfc4180
[tdast-util-from-csv]: https://github.com/tdast/tdast-util-from-csv
[tdast-util-to-hast-table]: https://github.com/tdast/tdast-util-to-hast-table
[rehype]: https://github.com/rehypejs/rehype
[unified-doc]: https://github.com/unified-doc/unified-doc
