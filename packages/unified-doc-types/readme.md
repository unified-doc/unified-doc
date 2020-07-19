# unified-doc-types

[**unified-doc**][unified-doc] [typescript][typescript] typings.

## Install

```sh
npm install unified-doc-types
```

## Use

```ts
import { Annotation, FileData, SearchResult } from 'unified-doc';

const annotations: Annotation[] = [
  { id: 'a', start: 0, end: 5, classNames: ['class-a', 'class-b'] },
  { id: 'b', start: 0, end: 5, style: { background: 'red' } },
];

const fileData: FileData = {
  content: '> **some** markdown content',
  extension: '.md',
  name: 'doc.md',
  stem: 'name',
  type: 'text/markdown'
};

const results: SearchResult[] = [
  { start: 0, end: 2, value: 'so', data: { weight: 2 } },
  { start: 6, end: 8, value: 'rk', data: { weight: 5 } },
];
```

<!-- Links -->
[typescript]: https://github.com/microsoft/TypeScript
[unified-doc]: https://github.com/unified-doc/unified-doc
