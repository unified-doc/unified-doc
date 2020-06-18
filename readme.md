# 📄 unified-doc
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
- retrieve useful representations of the document (e.g. source content, string content, text content, file, syntax tree).
- enrich the document through an ecosystem of plugins.
- avoid working with problems relating to specific content types, and instead work with APIs that are built on simple and unified data and interfaces.
- support new content types and extend existing APIs to them for free.
- support new APIs and extend them to supported content types for free.
- use these APIs in both Node + browsers.
- evolve with web technologies.

The above statements represent the goals that the `unified-doc` project is working towards: building simple and unified document APIs.

## Specs
Please refer to the [Specs](./specs.md) documentation for more details ono how the `unified-doc` project is defined and implemented.

## Packages
### Core:
- `unified-doc`

### Parsers
- `unified-doc-parse-text`

### Search Algorithms
- `unified-doc-search-regexp`

### Hast Utils
- `unified-doc-util-annotate`
- `unified-doc-util-text-offsets`

### Wrappers
- `unified-doc-react`

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
[rehype]: https://github.com/rehypejs/rehype
[unified]: https://github.com/unifiedjs
