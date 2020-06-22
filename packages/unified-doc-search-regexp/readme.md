# unified-doc-search-regexp

[**unified-doc**][unified-doc] search algorithm to return snippets with simple regular expression features.

## Install

```sh
npm install unified-doc-search-regexp
```

## Use

```js
const content = 'a TO the b TO the c';

search(content, 'TO');
// [
  // { start: 2, end: 4, value: 'TO' },
  // { start: 11, end: 13, value: 'TO' },
// ];

search(content, 'TO', { isCaseSensitive: true });
// []

expect(search(content, 'a|b|c', { enableRegexp: true });
// [
//   { start: 0, end: 1, value: 'a' },
//   { start: 9, end: 10, value: 'b' },
//   { start: 18, end: 19, value: 'c' },
// ];
```


## API

```ts
function SearchAlgorithm(
  content: string,
  query: string,
  options?: Options,
): SearchResult[]
```

Uses the `SearchAlgorithm` interface with options to configure regexp features.  Performs the search algorithm against provided `content` and `query`jk and returns an array of `SearchResult`.

### Interfaces

```js
interface Options {
  enableRegexp?: boolean;
  isCaseSensitive?: boolean;
}

interface SearchResult {
  start: number;
  end: number;
  value: string;
}
```

<!-- Links -->
[unified-doc]: https://github.com/unified-doc/unified-doc
