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

// easily initialize a `doc` instance with access to document APIs.
// any supported content type benefits from the same APIs.
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

// export source file
expect(doc.file()).toEqual({
  content: '> **some** markdown content',
  extension: '.md',
  name: 'doc.md',
  stem: 'doc',
  type: 'text/markdown',
});

// export file as html
expect(doc.file('.html')).toEqual({
  content: '<blockquote><strong>some</strong> markdown content</blockquote>',
  extension: '.html',
  name: 'doc.html',
  stem: 'doc',
  type: 'text/html',
});

// export file as text (only textContent is extracted)
expect(doc.file('.txt')).toEqual({
  content: 'some markdown content',
  extension: '.txt',
  name: 'doc.txt',
  stem: 'doc',
  type: 'text/plain',
});

// easily search on a doc
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

// retrieve just the textContent of the document
expect(doc.textContent()).toEqual('some markdown content');

// retrieve the `hast` (syntax tree) representation of the document
expect(doc.parse()).toEqual({ // hast tree
  type: 'root',
  children: [...],
});

// compile the document to use the results for rendering
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

A `doc` refers to an instance of `unified-doc`.

### `unifiedDoc(options)`

Initialize a `doc` instance that provides a set of useful methods to working with documents.  Any supported content type benefits from the API methods.  As of the time of this writing, `unified-doc` supports `.html`, `.md`, `.txt` content types but future support of popular content types are in active development (e.g. `.xml`, `.json`, `.csv`, `.docx`)!

```js
// initialize as markdown content
const doc1 = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});
// initialize as html content
const doc2 = unifiedDoc({
  content: '<blockquote><strong>some</strong> markdown content</blockquote>',
  filename: 'doc.html',
});
// initialize as text content
const doc3 = unifiedDoc({
  content: '<blockquote><strong>some</strong> markdown content</blockquote>',
  filename: 'doc.txt',
});
```

The `doc` instance can be configured by providing other properties.  This will be elaborated more in the [`options`](#options) section.

### `doc.compile()`
#### Interface
```ts
function compile(): VFile;
```
Returns the results of the compiled content based on the `compiler` attached to the `doc`.  The results are stored as a [`VFile`][VFile], and can be used by various renderers.  By default, a HTML string compiler is used, and stringifed HTML is returned by this method.

### `doc.file([extension])`
#### Interface
```ts
function file(extension?: string): FileData;
```
Returns `FileData` for the specified extension.  This is a useful way to convert and output different file formats.  Supported extensions include `'.html'`, `'.txt'`.  If no extension is provided, the source file should be returned.  Future extensions can be implemented, providing a powerful way to convert file formats for any supported content type

#### Example
```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

// export source file
expect(doc.file()).toEqual({
  content: '> **some** markdown content',
  extension: '.md',
  name: 'doc.md',
  stem: 'doc',
  type: 'text/markdown',
});

// export file as html
expect(doc.file('.html')).toEqual({
  content: '<blockquote><strong>some</strong> markdown content</blockquote>',
  extension: '.html',
  name: 'doc.html',
  stem: 'doc',
  type: 'text/html',
});

// export file as text (only textContent is extracted)
expect(doc.file('.txt')).toEqual({
  content: 'some markdown content',
  extension: '.txt',
  name: 'doc.txt',
  stem: 'doc',
  type: 'text/plain',
});
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
Returns the `hast` representation of the content.  This content representation is used internally by the `doc`, but it can also be used by any `hast` utility.

#### Example
```js
import toMdast from 'hast-util-to-mdast';

const hast = doc.parse();
const mdast = toMdast(hast);
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

Returns `SearchResultSnippet` based on the provided `query` string and search `options`.  Uses the `searchAlogrithm` attached to the `doc` for when executing a search against the `textContent` of a `doc`.

#### Example
```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
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
Returns the `textContent` of a `doc`.  This content is the concatenated value of all text nodes under a `doc`, and is used by many internal APIs (marking, searching).

#### Example
```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

expect(doc.textContent()).toEqual('some markdown content');
```

### `options`
Configure the `doc` instance with the following `options`:

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

#### Example
The following is an example of a doc with custom configurations.
```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
  compiler: [ // attach a custom compiler for custom content rendering
    [customCompiler, customCompilerOptions],
  ],
  marks: [ // content will be marked in appropriate places
    { id: 'a', start: 0, end: 4, classNames: ['class-a']},
    { id: 'b', start: 0, end: 4, style: { background: 'red', color: 'white' } },
  ],
  parsers: {
    'text/html': [parser1, parser2, parser3], // overwrite html parser with a custom multi-step parser
    'application/pdf': [pdfParser],  // a unified pdf parser is in high demand!
  },
  postPlugins: [ // apply custom rehype plugins (post content processing)
    [toc, tocOptions],
  ],
  sanitizeSchema: { // custom sanitization rules
    attributes: { '*': ['style'] }
  },
  searchAlgorithm: customSearchAlgorithm, // attach a custom search algorithm relevant to your needs (e.g. elasticsearch, googlesearch etc)
  searchOptions: { // unified search option behavior
    minQueryLength: 5,
    snippetOffsetPadding: 10,
  },
});
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
[vfile]: https://github.com/vfile/vfile
