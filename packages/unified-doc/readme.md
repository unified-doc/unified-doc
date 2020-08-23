# unified-doc

unified document APIs.

## Install
```sh
npm install unified-doc
```

## Use

A unified API to easily work with documents of supported content types.

```js
import unifiedDoc from 'unified-doc';

const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

expect(doc.file()).toEqual({
  content: '> **some** markdown content',
  extension: '.md',
  name: 'doc.md',
  stem: 'doc',
  type: 'text/markdown',
});

expect(doc.file('.html')).toEqual({
  content: '<blockquote><strong>some</strong>markdown content</blockquote>',
  extension: '.html',
  name: 'doc.html',
  stem: 'doc',
  type: 'text/html',
});

expect(doc.file('.txt')).toEqual({
  content: 'some markdown content',
  extension: '.txt',
  name: 'doc.txt',
  stem: 'doc',
  type: 'text/plain',
});

expect(doc.search('nt')).toEqual([
  { 
    start: 16,
    end: 18,
    value: 'nt',
    snippet: ['some markdown co', 'nt', 'ent'],
  },
  {
    start: 19,
    end: 21,
    value: 'nt',
    snippet: ['some markdown conte', 'nt', ''],
  },
]);

expect(doc.textContent()).toEqual('some markdown content');

expect(doc.parse()).toEqual({ // hast tree
  type: 'root',
  children: [...],
});

expect(doc.compile()).toBeInstanceOf(VFile); // vfile instance
```

## API
- [`unifiedDoc(options)`](#unifiedDocoptions)
- [`doc.compile()`](#doccompile)
- [`doc.file([extension])`](#docfileextension)
- [`doc.parse()`](#docparse)
- [`doc.search(query[, options])`](#docsearchquery-options)
- [`doc.textContent()`](#doctextContent)
- [`options`](#options)

### `unifiedDoc(options)`

### `doc.compile()`
#### Interface
```ts
function compile(): VFile;
```

### `doc.file([extension])`
#### Interface
```ts
function file(extension?: string): FileData;
```

#### Related interfaces
```ts
interface FileData {
  /** file content in string form */
  content: string;
  /** file extension (includes preceding '.') */
  extension: string;
  /** file name (includes extension) */
  name: string;
  /** file name (without extension) */
  stem: string;
  /** mime type of file */
  type: string;
}
```

### `doc.parse()`
#### Interface
```ts
function parse(): Hast;
```

### `doc.search(query[, options])`
#### Interface
```ts
function search(
  /** search query string */
  query: string,
  /** algorithm-specific options based on attached search algorithm */
  options?: Record<string, any>,
): SearchResultSnippet[];
```

#### Related interfaces
```ts
interface SearchResult {
  /** start offset of the search result relative to the `textContent` of the `doc` */
  start: number;
  /** end offset of the search result relative to the `textContent` of the `doc` */
  end: number;
  /** matched text value in the `doc` */
  value: string;
  /** additional data can be stored here */
  data?: Record<string, any>;
}

interface SearchResultSnippet extends SearchResult {
  /** 3-tuple string representing the [left, matched, right] of a matched search result.  left/right are characters to the left/right of the matched text value, and its length is configurable in `SearchOptions.snippetOffsetPadding` */
  snippet: [string, string, string];
}
```

### `doc.textContent()`
#### Interface
```ts
function textContent(): string;
```

### `options`
#### Interface
```ts
interface Options {
  /** required content must be provided */
  content: string;
  /** required filename must be provided.  This infers the mimeType of the content and subsequently how content will be parsed */
  filename: string;
  /** attach a compiler (with optional options) in the `PluggableList` interface to determine how the content will be compiled */
  compiler?: PluggableList;
  /** an array of `Mark` data that is used by the mark algorithm to insert `mark` nodes with matching offsets */
  marks?: Mark[];
  /** specify new parsers or override existing parsers with this map */
  parsers?: Parsers;
  /** apply plugins to further customize the `doc`.  These plugins are applied after internal plugins (hence the 'post' prefix), and will not affect private APIs such as `textContent` and `parse` */
  postPlugins?: PluggableList;
  /** provide a sanitize schema for sanitizing the `doc`.  By default, the `doc` is safely sanitized.  If `null` is provided as a value, the `doc` will not be sanitized. */
  sanitizeSchema?: SanitizeSchema | null;
  /** attach a search algorithm that implements the `SearchAlgorithm` interface to support custom search behaviors on a `doc` */
  searchAlgorithm?: SearchAlgorithm;
  /** unified search options independent of the attached search algorithm */
  searchOptions?: SearchOptions;
}
```

#### Related interfaces
```ts
/**
 * An object used by a mark algorithm to mark text nodes based on text offset positions
 */
interface Mark {
  /** unique ID for mark (required for mark algorithm to work) */
  id: string;
  /** start offset of the mark relative to the `textContent` of the `doc` */
  start: number;
  /** end offset of the mark relative to the `textContent` of the `doc` */
  end: number;
  /** apply optional CSS classnames to marked nodes */
  classNames?: string[];
  /** apply optional dataset attributes (i.e. `data-*`) to marked nodes */
  dataset?: Record<string, any>;
  /** additional data can be stored here */
  data?: Record<string, any>;
  /** apply optional styles to marked nodes */
  style?: Record<string, any>;
}

/**
 * Mapping of mimeTypes to unified parsers.
 * New parsers can be introduced and existing parsers can be overwritten.
 * Parsers are provided in the `PluggableList` interface.
 * Parsers may consist of multiple steps.
 */
interface Parsers {
  [mimeType: string]: PluggableList;
}

// see https://github.com/syntax-tree/hast-util-sanitize
type SanitizeSchema = Record<string, any>;

/**
 * Unified search options affecting any attached search algorithm.
 */
interface SearchOptions {
  /** only execute `doc.search` if the query is at least of the specified length */
  minQueryLength?: number;
  /** return snippets padded with extra characters on the left/right of the matched value based on the specified padding length */
  snippetOffsetPadding?: number;
}
```

<!-- Definitions -->
[micromatch]: https://github.com/micromatch/micromatch
[rehype]: https://github.com/rehypejs/rehype
[hast]: https://github.com/syntax-tree/hast
