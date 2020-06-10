# unified-doc
unified document APIs.

## Packages
### Core
`unified-doc` is the core package for unified document APIs.

### Parsers
```ts
function parser(
  content: string | Buffer,
  options: object,
): Node;
```
- Parsers convert content into a unified `hast` tree.
- Naming pattern `unified-doc-parse-*`
- Packages:
  - `unified-doc-parse-text`

### Search Algorithms
```ts
function search(content: string, options?: object): Snippet[];

interface Snippet {
  start: number;
  end: number;
  value: string;
}
```
- Search algorithms return snippets against the text content of the source content.
- Naming pattern `unified-doc-search-*`
- Packages:
  - `unified-doc-search-regexp`

### Hast Utils
```ts
function util(
  hast: Node,
  options: object,
): Node;
```
- [`hast`][hast] utils modify and return a new `hast` tree.
- Naming pattern `unified-doc-util-*`
- Packages:
  - `unified-doc-util-annotate`
  - `unified-doc-util-text-offsets`

## Development
The project is managed with `lerna`.

```sh
# install dependencies and bootstrap with lerna
npx run bootstrap

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
