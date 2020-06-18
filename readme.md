# 📄 unified-doc
unified document APIs.

## Contents
- [Intro](#intro)
- [Features](#features)
- [Specs](#specs)
- [Packages](#packages)
- [Development](#development)

## Intro
The [unified][unified] initiative provides specs, tools, and a foundation to unify and structure content of varying formats.  This project seeks to unify common document APIs that operate on top of a unified content layer.

## Features
- Unified interface to parse supported content types (e.g. `.html`, `.txt`, `.md`) into HTML.
- Unified interface to search content and return search result snippets irregardless of underlying content structure.
- Easily convert between supported file formats (e.g. `.html`, `.txt`, `.md`).
- Retrieve various useful representation of the document:
  - `string`: source content in string form
  - `text`: extract only the human-readable content of text nodes
  - `hast`: syntax tree representation of the source content
- Existing document APIs can be extended to new content types as long as the relevant parsers are implemented.
- Adding new document APIs will enhance all supported content types.
- Rich ecosystem of [rehype][rehype] plugins.
- Interoperable with web technologies.
- Node + DOM friendly.

## Specs
Please refer to the [Specs](./specs.md) documentation for more details.

## Packages
- Core:
  - `unified-doc`
- Parsers
  - `unified-doc-parse-text`
- Search Algorithms
  - `unified-doc-search-regexp`
- Hast Utils
  - `unified-doc-util-annotate`
  - `unified-doc-util-text-offsets`
- Wrappers
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
