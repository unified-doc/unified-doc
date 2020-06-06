# unified-doc-util-annotate

unified document [`hast`][hast] utility to annotate text nodes.

## Install

```sh
npm install unified-doc-util-annotate
```

## Use

### Pre-requisites
`unified-doc-util-annotate` requires the [`unified-doc-util-text-offsets`][unified-doc-util-text-offsets] package to work.

```js
import annotate from 'unified-doc-util-annotate';
import textOffsets from 'unified-doc-util-text-offsets';

const hast = { ... };
const withTextOffsets = textOffsets(hast);
const annotated = annotate(textOffsets);
```

Yields:

```js
```

## API

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[unified-doc-util-text-offsets]: https://github.com/unified-doc/unified-doc/tree/master/packages/unified-doc-util-text-offsets
