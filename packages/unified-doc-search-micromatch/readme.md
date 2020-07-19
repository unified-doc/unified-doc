# unified-doc-search-micromatch

[**unified-doc**][unified-doc] [`micromatch`][micromatch] [search algorithm][search-algorithm].

## Install

```sh
npm install unified-doc-search-micromatch
```

## Use

Supports the matching features in the `micromatch` package when searching `doc` instances managed by `unified-doc`.

```js
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

```ts
function SearchAlgorithm(
  content: string,
  query: string,
  options?: Options,
): SearchResult[]
```

Please refer to the [`micromatch`][micromatch] options documentation for configurable options and match behaviors.

### Interfaces

```js
interface SearchResult {
  [key]: string;
  start: number;
  end: number;
  value: string;
}
```

<!-- Links -->
[micromatch]: https://github.com/micromatch/micromatch
[unified-doc]: https://github.com/unified-doc/unified-doc
[search-algorithm]: https://github.com/unified-doc/unified-doc/blob/main/spec.md#search-algorithm
