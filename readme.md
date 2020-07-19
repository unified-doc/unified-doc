# unified-doc
unified document APIs.

## Contents
- [Intro](#intro)
- [Spec](#spec)
- [Packages](#packages)
- [Development](#development)

## Intro
`unified-doc` provides a set of APIs to easily work with content in various document/file formats.  With `unified-doc`, we can easily

- compile and render any content to HTML.
- format and style the document.
- annotate the document.
- search on the document's text content.
- export the document in a variety of file formats.
- retrieve useful representations of the doucment (source content, text content, syntax tree).
- enrich the document through an ecosystem of plugins.

Instead of implementing custom render/search/annotation/export programs based on specific content types, `unified-doc` implements a unified set of APIs for supported content types.  This allows easy extension of existing APIs to newly introduced content types, and for supported content types to benefit from new API methods.

`unified-doc` renders semantic HTML documents that are interoperable with web technologies.

## Spec
Please refer to the [Spec](./spec.md) documentation for more details on goals, definitions, and implementations in `unified-doc`.

## Packages
The following packages are used in the `unified-doc` interface.

### API
Unified document APIs for Node, CLI, and/or DOM.
- [`unified-doc`][unified-doc]
- [`unified-doc-cli`][unified-doc-cli]
- [`unified-doc-dom`][unified-doc-dom]

### Parsers
Parsers parse source content into [`hast`][hast] trees.
- [`unified-doc-parse-text`][unified-doc-parse-text]

### Search Algorithms
Search algorithms use a unified search interface to return search results based on the provided `query` and `textContent` of a document by using a custom implementation.
- [`unified-doc-search-micromatch`][unified-doc-search-micromatch]

### Hast Utils
`hast` utilities operate and transform `hast` trees.
- [`unified-doc-util-annotate`][unified-doc-util-annotate]
- [`unified-doc-util-text-offsets`][unified-doc-util-text-offsets]

### Wrappers
Wrappers implement `unified-doc` APIs in other interfaces.
- [`unified-doc-react`][unified-doc-react]

### Types
Shared Typescript typings used across `unified-doc` packages.
- [`unified-doc-types`][unified-doc-types]

## Development
This project is:
- implemented with the [unified][unified] interface.
- linted with `xo` + `prettier` + `tsc`.
- developed and built with `microbundle`.
- tested with `jest`.
- softly-typed with `typescript` with `checkJs` (only public APIs are typed).
- managed with `lerna`

Monorepo scripts:
  ```sh
  # install dependencies and bootstrap with lerna
  npm run bootstrap

  # build all packages with microbundle
  npm run build

  # clean all packages (rm dist + node_modules)
  npm run clean

  # watch/rebuild all packages with microbundle
  npm run dev

  # link all packages with lerna
  npm run link

  # lint all packages with xo + prettier + tsc
  npm run lint

  # test all packages with jest in --watch mode (make sure to run the 'dev' script)
  npm run test

  # test all packages in a single run
  npm run test:run

  # publish all packages with lerna
  npm run publish
  ```

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[rehype]: https://github.com/rehypejs/rehype
[unified]: https://github.com/unifiedjs
[unified-doc]: https://github.com/unified-doc/unified-doc/tree/main/packages/unified-doc
[unified-doc-cli]: https://github.com/unified-doc/unified-doc-cli
[unified-doc-dom]: https://github.com/unified-doc/unified-doc-dom
[unified-doc-parse-text]: https://github.com/unified-doc/unified-doc/tree/main/packages/unified-doc-parse-text
[unified-doc-react]: https://github.com/unified-doc/unified-doc-react
[unified-doc-search-micromatch]: https://github.com/unified-doc/unified-doc/tree/main/packages/unified-doc-search-micromatch
[unified-doc-types]: https://github.com/unified-doc/unified-doc/tree/main/packages/unified-doc-types
[unified-doc-util-annotate]: https://github.com/unified-doc/unified-doc/tree/main/packages/unified-doc-util-annotate
[unified-doc-util-text-offsets]: https://github.com/unified-doc/unified-doc/tree/main/packages/unified-doc-util-text-offsets

