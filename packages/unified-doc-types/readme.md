# unified-doc-types

Typescript typings for [`unified-doc`][unified-doc].

## Install

```sh
npm install unified-doc-types
```

## Use

```ts
import { Annotation, SearchAlgorithm } from 'unified-doc';

const annotations: Annotation[] = [
  { id: 'a', start: 0, end: 5, classNames: ['class-a', 'class-b'] },
  { id: 'b', start: 0, end: 5, style: { background: 'red' } },
];

const search: SearchAlgorithm = (
  _content,
  _query,
  options = {},
) => {
  return [];
};
```

<!-- Links -->
[unified-doc]: https://github.com/unified-doc/unified-doc
