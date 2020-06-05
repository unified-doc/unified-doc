# unified-doc
unified document APIs.

## Packages
### Core
`unified-doc` is the core package for unified document APIs.

### Parsers
- Parsers convert content into a unified `hast` tree.
- Signature: `function parser(content: string | Buffer, options: object): Node`
- Naming pattern `unified-doc-parse-*`
- Packages:
  - `unified-doc-parse-text`

### Search Algorithms
- Search algorithms return search results in the form of text offsets against the original text content.
- Signature: `function search(content: string, options: object): TextOffset[]`
- Naming pattern `unified-doc-search-*`
- Packages:
  - `unified-doc-search-regexp`

### Hast Utils
- Hast utils modify and return a new `hast` tree.
- Signature: `function util(hast: Node, options: object): Node`
- Naming pattern `unified-doc-util-*`
- Packages:
  - `unified-doc-util-annotate`
  - `unified-doc-util-text-offsets`

## Development
The project is managed  `lerna`.

```sh
# install dependencies
npm install

# clean all packages (rm dist + node_modules)
npm run clean

# lint all packages with xo + prettier + tsc
npm run lint

# watch/rebuild all packages with microbundle
npm run dev

# test all packages with jest (make sure to run the 'dev' script)
npm run test

# build all packages with microbundle
npm run build
```
