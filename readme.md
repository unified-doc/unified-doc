# unified-doc
unified document APIs.

## Contents
- [Intro](#intro)
- [Specs](#specs)
- [Packages](#packages)
- [Development](#development)

## Intro
The [`unified`][unified] initiative provides specs, tools, and a foundation to unify and structure content of varying formats.  `unified-doc` seeks to unify common document APIs that operate on top of a unified content layer.

Working with documents should be simple and unified.  We should be able to:
- parse and render any content to HTML for easy viewing in the browser.
- apply annotations and formatting to the document.
- convert the document to a variety of file formats.
- use a unified search interface that is simple to implement and works with any content type.
- retrieve useful representations of the document (e.g. source content, text content, files, syntax tree).
- enrich the document through an ecosystem of plugins.
- avoid working with problems relating to specific content types, and instead work with APIs that are built on simple and unified data and interfaces.
- support new content types and extend existing APIs to them for free.
- support new APIs and extend them to supported content types for free.
- use these APIs in both Node + browsers.
- evolve with web technologies.

The above statements represent the goals that the `unified-doc` project is working towards: building simple and unified document APIs.

## Spec
Please refer to the [Spec](./spec.md) documentation for more details ono how the `unified-doc` project is defined and implemented.

## Packages
The following packages are used in the `unified-doc` ecosystem.

### API
Unified document APIs accessible for both Node and DOM.
- [`unified-doc`][unified-doc]
- [`unified-doc-cli`][unified-doc-cli]
- [`unified-doc-dom`][unified-doc-dom]

### Parsers
Parsers parse source content into unified [`hast`][hast] trees.  The following parsers are integrated in `unified-doc`.
- [`rehype-parse`][rehype-parse]
- [`remark-parse`][remark-parse]
- [`unified-doc-parse-text`][unified-doc-parse-text]

### Search Algorithms
Search algorithms use a unified interface to return search results when searching against a the `textContent` of a `doc`.
- [`unified-doc-search-micromatch`][unified-doc-search-micromatch]

### Hast Utils
`hast` utilities operate and transform `hast` trees.
- [`unified-doc-util-annotate`][unified-doc-util-annotate]
- [`unified-doc-util-text-offsets`][unified-doc-util-text-offsets]

### Wrappers
Wrappers implement `unified-doc` APIs in other ecosystems.
- [`unified-doc-react`][unified-doc-react]

## Development
This project is:
- made possible by many awesome open-source projects (e.g. [unified][unified]).
- linted with `xo` + `prettier` + `tsc`.
- developed and bundled with `microbundle`.
- tested with `jest`.
- softly-typed with `typescript` (only public APIs are typed).  Typescript definitions used across packages are defined in `unified-docs-types` and the project is typed using `checkJs`.
- managed with `lerna` with the following scripts to organize the monorepo development:
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
[rehype-parse]: https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse
[remark-parse]: https://github.com/remarkjs/remark/tree/master/packages/remark-parse
[unified]: https://github.com/unifiedjs
[unified-doc]: https://github.com/unified-doc/unified-doc/tree/master/packages/unified-doc
[unified-doc-cli]: https://github.com/unified-doc/unified-doc-cli
[unified-doc-dom]: https://github.com/unified-doc/unified-doc-dom
[unified-doc-parse-text]: https://github.com/unified-doc/unified-doc/tree/master/packages/unified-doc-parse-text
[unified-doc-react]: https://github.com/unified-doc/unified-doc-react
[unified-doc-search-micromatch]: https://github.com/unified-doc/unified-doc/tree/master/packages/unified-doc-search-micromatch
[unified-doc-util-annotate]: https://github.com/unified-doc/unified-doc/tree/master/packages/unified-doc-util-annotate
[unified-doc-util-text-offsets]: https://github.com/unified-doc/unified-doc/tree/master/packages/unified-doc-util-text-offsets

