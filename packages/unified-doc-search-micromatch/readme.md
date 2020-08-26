# unified-doc-search-micromatch

[**unified-doc**][unified-doc] [`micromatch`][micromatch] search algorithm.

## Install

```sh
npm install unified-doc-search-micromatch
```

## Use

Supports the matching features in the `micromatch` package when searching `doc` instances managed by `unified-doc`.

```js
import search from 'unified-doc-search-micromatch';

const content = 'a TO the b TO the c';

expect(search(content, 'TO', { nocase: true })).toEqual([
  { start: 2, end: 4, value: 'TO' },
  { start: 11, end: 13, value: 'TO' },
]);

expect(search(content, 'to', { nocase: false })).toEqual([]);

expect(search(content, 'a*b')).toEqual([
  { start: 0, end: 10, value: 'a TO the b' },
]);

expect(search(content, 'a????')).toEqual([
  { start: 0, end: 5, value: 'a TO ' },
]);

expect(search(content, 'a TO the (b|c)')).toEqual([
  { start: 0, end: 10, value: 'a TO the b' },
]);

expect(search(content, 'a TO the (c|d)')).toEqual([]);

expect(search(content, 'a TO the !(c|d)')).toEqual([
  { start: 0, end: 9, value: 'a TO the ' },
]);

```

## API

### `search(content, query[, options])`
#### Interface
```ts
function search(
  content: string,
  query: string,
  options?: Record<string, any>,
): SearchResult[]
```

Uses the unified `SearchAlgorithm` interface to search on `content` with a provided `query` string and `micromatch`-specific `options`.  Returns unified `SearchResult` data.

Please refer to the [`micromatch`][micromatch] documentation for configurable options and match behaviors.


#### Related interfaces
```ts
type SearchAlgorithm = (
  /** string content to search on */
  content: string,
  /** query string */
  query: string,
  /** search algorithm options */
  options?: Record<string, any>,
) => SearchResult[];

interface SearchResult {
  /** start offset of the search result relative to the `textContent` of the `doc` */
  start: number;
  /** end offset of the search result relative to the `textContent` of the `doc` */
  end: number;
  /** matched text value in the `doc` */
  value: string;
  /** additional data can be stored here */
  data?: Record<string, any>;
}
```

<!-- Definitions -->
[micromatch]: https://github.com/micromatch/micromatch
[unified-doc]: https://github.com/unified-doc/unified-doc
