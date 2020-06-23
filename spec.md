# Spec

Specifications for how the `unified-doc` project should be defined and implemented to build unified document APIs.

The following are key concepts used throughout the documentation (a full list is provided in the [Glossary](#glossary) section).
- **`knowledge`**: abstract human information that is acquired and shared among humans.
- **`content`**: the physical materialization of `knowledge`.
- **`document`**: an abstraction that manages `content`.
- **`doc`**: an instance of a `document` implemented by `unified-doc`.
- **`file`**: an object storing `content` and associated metadata.

## Contents
- [`doc`](#doc)
- [`parser`](#parser)
- [`hast`](#hast)
- [`compiler`](#compiler)
- [`sanitizeSchema`](#sanitizeschema)
- [`searchAlgorithm`](#searchalgorithm)
- [Plugins](#plugins)
- [Wrappers](#wrappers)
- [Glossary](#glossary)

## `doc`
A `doc` is an instance of a `document` implemented by `unified-doc` that provides an abstraction for managing `content` (e.g. parsing, transforming, annotating, searching, rendering). The following concepts define the scope and behaviors of a `doc`.

### `content`
Refers to the source data of a `doc` provided as a string.  The following are common ways to set `content` on a `doc`.

```js
const stringContent = 'some string';
const contentFromFile = await someBlob.text();
```

### `filename`
A `doc` is usually associated with a `file` that stores `content`.  The `doc` will use the `filename` to infer the `mimeType` for the associated `content`, which determines how this `content` should be parsed.  If a `mimeType` cannot be inferred, we set it to `text/plain` as a default value.  The following shows the behaviors between `filename` and inferred `mimeTypes`.

```js
const file0 = 'file.html'; // text/html (html parser)
const file1 = 'file.htm'; // text/html (html parser)
const file2 = 'file.md'; // text/markdown (markdown parser)
const file3 = 'file.txt'; // text/plain (text parser)
const file5 = 'file.random-extension'; // text/plain (text parser)
const file6 = 'file.a.b.c'; // text/plain (text parser)
const file7 = 'no-extensions-not-recommended'; // text/plain (text parser)
const file4 = 'file.jpg'; // image/jpeg (unsupported parser)
const file4 = 'file.pdf'; // application/pdf (unsupported/pdf parser)
```

> **Note**: Using the `filename` to determine the actual `mimeType` for some `content` is not a reliable method.  It is however a convenient method, and is therefore used by a `doc` to infer how `content` should be parsed.  New parsers can be implemented in the future to bridge unsupported `mimeTypes`.

### `annotations`
An `annotation` is an object describing how the `textContent` in a `doc` should be marked.  This is achieved by specifying the `start` and `end` offset of the annotation relative to the `textContent`.  The formal spec for an `annotation` is provided below.

```ts
interface Annotation {
  id: string;
  start: number;
  end: number;
  classNames?: string[];
  data?: Record<string, any>;
  style?: Record<string, any>;
}
```

A `doc` should implement `annotations` by wrapping annotated text node segments with `<mark />` nodes while leaving other areas of the `doc` semantically unchanged.  The following pseudocode describes the process and behaviors when annotating a `doc`.

```js
const content = '<blockquote><strong>some</strong>\ncontent</blockquote>';
const textContent = 'some\ncontent';
const textNodeOffsets = [
  { start: 0, end: 4 }, // from "[some]\ncontent"
  { start: 4, end: 12 }, // from "some[\ncontent]"
];

const annotations = [
  { id: 'a', classNames: ['a', 'b'], start: 3, end: 8 },
  { id: 'b', style: { background: 'red' }, start: 6, end: 10 },
];
const expectedTextSegments = [
  {
    value: 'som', // from "[som]e" text node
    textOffset: { start: 0, end: 3},
    annotationIds: [], // not annotated
  },
  {
    value: 'e', // from "som[e]" text node
    textOffset: { start: 3, end: 4},
    annotationIds: ['a'], // annotated by 'a'
  },
  {
    value: '\nc', // from "[\nc]ontent" text node
    textOffset: { start: 4, end: 6},
    annotationIds: ['a'], // annotated by 'a'
  },
  {
    value: 'on', // from "\nc[on]tent" text node
    textOffset: { start: 6, end: 8},
    annotationIds: ['a', 'b'], // annotated by 'a' + 'b'
  },
  {
    value: 'te', // from "\ncon[te]nt" text node
    textOffset: { start: 8, end: 10},
    annotationIds: ['b'], // annotated by 'b'
  },
  {
    value: 'nt', // from "\nconte[nt]" text node
    textOffset: { start: 10, end: 12},
    annotationIds: [], // not annotated
  },
];

// apply annotation properties to text segments with <mark /> nodes
```

### `doc.compile(): VFile`
Compiles `content` into output results that is stored on a [`vfile`][vfile].  Renderers can use the compiled results to render the document.  Compiled results are defined and configured by assigning a specific `compiler` to the `doc`.  More details on [`compilers`](#compiler) is provided in a later section.

### `doc.file(extension?: string): FileData`
Supports easy ways to convert between file formats by providing a supported `extension` argument (e.g. source file, `.html`, `.txt`, `.uni`).  File data for the provided extension is returned.  The formal spec for `FileData` is provided below.

```ts
interface FileData {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}
```

The core supported file extensions and behaviors are:
- `null`: returns the source file without modification.
- `.html`: returns the compiled `html` in a `.html` file.
- `.txt`: returns the `textContent` in a `.txt` file.
- `.uni`: returns the `hast` tree in a `.uni` file.

```js
const content = '> **some** markdown content';

console.log(doc.file()); // outputs source file
// {
  // content: '> **some** markdown content',
  // extension: '.md',
  // name: 'doc.md',
  // stem: 'doc',
  // type: 'text/markdown',
// }
console.log(doc.file('.html')); // outputs html file
// {
  // content: '<blockquote><strong>some</strong>markdown content</blockquote>',
  // extension: '.html',
  // name: 'doc.html',
  // stem: 'doc',
  // type: 'text/html',
// }
console.log(doc.file('.txt')); // outputs txt file with only textContent
// {
  // content: 'some markdown content',
  // extension: '.txt',
  // name: 'doc.txt',
  // stem: 'doc',
  // type: 'text/plain',
// }
```

Note that you can easily create a Javascript `File` instance using `FileData`:
```js
const { content, name, type } = doc.file('.html');
const file = new File([content], name, { type }); // creates a valid HTML file
```

### `doc.parse(): Hast`
Converts `content` into a [`hast`][hast] tree.  The tree is useful for transformations with `hast` utilities.  A `doc` uses this unified and structured `hast` representation to implement many APIs irregardless of its underlying `mimeType`.

```js
const content = '> **some** markdown content';
console.log(doc.parse());
// { type: 'root', children: [...] }
```

### `doc.textContent(): string`
The `textContent` of a `doc` is obtained by extracting values of all text nodes in the `hast` representation of the source `content`.  The `textContent` is free of markup and metadata, and supports many important `doc` features (annotations and searching).

```js
const content1 = '> **some** markdown content';
console.log(doc1.textContent()); // 'some markdown content';

const content2 = '<blockquote><strong>some</strong> markdown content</blockquote>';
console.log(doc2.textContent()); // 'some markdown content';
```

### `doc.search(query: string, options?: object): SearchResultSnippet[]`
Searches on the `textContent` of a `doc` when a `query` string and configurable `options` is provided.  Returns `SearchResultSnippet`.  This method supports a simple and robust way to search on a `doc` irregardless of its underlying `mimeType`. Custom `searchAlgorithm` with the same unified interface can be easily integrated.

```js
const content = '> **some** markdown content';
const searchOptions = { minQueryLength: 2, snippetOffsetPadding: 10 }

doc.search('some|content', { enableRegexp: true });
// [
  // { start: 0, end: 5, value: 'some', snippet: ['', 'some', ' markdown c']},
  // { start: 14, end: 21, value: 'content', snippet: [' markdown ', 'content', '']},
// ]
```

More details on [`searchAlgorithm`](#searchalgorithm) is covered in a later section.

## `parser`
A `parser` is responsible for parsing string `content` into a [`hast`][hast] tree.

```ts
function parser(content: string, options?: object): Hast;
```

The `doc` should detect and assign a parser based on the `mimeType` inferred from the `filename`.  This parser will then parse the provided `content` into a `hast` tree.  The `doc` can support new `mimeTypes` by implementing and integrating new parsers.

> **Note**: All parsers in `unified-doc` should use the `unified-doc-parse-*` naming convention.

## `hast`
[`hast`][hast] is a syntax tree representing HTML.  A `hast` tree is created from a `parser` parsing `content`.

`hast` utilities are functions that operate or modify `hast` trees.  `doc` methods are usually implemented with `hast` utilities because `hast` provides a unified and structured representation for transforming `content` irregardless of its underlying `mimeType`.

```ts
function util(hast: Hast, options?: object): Hast;
```

> **Note**: All `hast` utilities in `unified-doc` should use the `unified-doc-util-*` naming convention.

## `compiler`
A `compiler` compiles a `hast` tree into an output (usually a string).  The results of a `compiler` is used by a renderer to render the `doc`.

```ts
function compile(hast: Hast, options?: object): VFile;
```

## `sanitizeSchema`
By default, a `doc` will be safely sanitized.  You can supply a custom schema to specify custom sanitization rules before plugins are applied.  Please see the [`hast-util-sanitize`][hast-util-sanitize] package for more details.

## `searchAlgorithm`
A `doc` provides a simple way to search its `textContent` against a `query` string.  A `searchAlgorithm` implements the behaviors of searching a `doc` and uses the following unified interface.

```ts
type SearchAlgorithm = (
  content: string,
  query: string,
  options?: Record<string, any>,
) => SearchResult[];

interface SearchResult {
  [key]: string;
  start: number;
  end: number;
  value: string;
}

interface SearchResultSnippet extends SearchResult {
  snippet: [string, string, string];
}
```

A `searchAlgorithm` implementation simply needs to return `SearchResults` containing text offsets relative to the `textContent` of a `doc` when a `query` string is provided.

> **Note**: All search algorithms in `unified-doc` should use the `unified-doc-search-*` naming convention.

## Plugins
Private plugins are used to implement `doc` APIs.  Public plugins are applied after private plugins and add further features to a `doc`.  We require that public plugins:
- are interoperable with `hast`.
- avoid mutating or affecting the `textContent` of a `doc`.

## Wrappers
Wrappers implement and expose `doc` APIs in other ecosystems.  An example of a wrapper is `unified-doc-react`, a [`react`][react] wrapper for `unified-doc`.  Wrappers should:
- specify a `compiler` and easily render the `doc` in the corresponding ecosystem.
- expose a `doc` instance for convenient access to `doc` API methods.
- include a reference to the rendered `doc` DOM node for convenient DOM manipulation.
- avoid obsfuscating `doc` APIs with wrapping code.

## Glossary
The following are the author's definition of terms used in the project:

- **`annotation`**: an object describing how `textContent` in a `doc` should be marked.
- **`compiler`**: a function that converts a `hast` tree into output data that can be used be a renderer to render a `doc`.
- **`content`**: the physical materialization of `knowledge`.
- **`document`**: an abstraction that manages `content`.
- **`doc`**: an instance of a `document` implemented by `unified-doc`.
- **`file`**: an object storing `content` and associated metadata.
- **`filename`**: the name of a `file` that is used by a `doc` to infer the underlying `mimeType` for parsing `content` with an appropriate `parser`.
- **`hast`**: a syntax tree representing HTML.  A `hast` tree is created from a `parser` parsing `content`.  It is used by a `doc` to implement many APIs that rely on a unified and structured representation of the underlying `content`.
- **`knowledge`**: abstract human information that is acquired and shared among humans.
- **`mimeType`**: a standard used to identify the nature and format for associated `content`.
- **`sanitizeSchema`**: a schema describing custom sanitzation rules. A `doc` is safely sanitized by default.
- **`searchAlgorithm`**: a function that takes a string query with configurable options, and returns search results while searching across the `textContent` in a `doc`.
- **`searchResult`**: a search result includes offsets to indicate where the matched value occurs in the `textContent` of a `doc`.
- **`searchResultSnippet`**: a search result snippet is an extension of a search result that provides snippet information (preceding and postceding text surrounding the matched search value).
- **`textContent`**: derived content obtained by extracting values of all text nodes in the `hast` representation of the source `content`.  The `textContent` is free of markup and metadata, and supports many important `doc` features (annotations and searching).
- **`unified`**: the [project][unified] that unifies content as structured data.
- **`unified-doc`**: this [project][unified-doc] that unifies document APIs on top of a unified content layer.
- **`util`**: usually refers to `hast` utilities that operate on `hast` trees.
- **`vfile`**: a lightweight data structure representing a `doc` as a virtual `file`.
- **`wrapper`**: a wrapping function that implements and exposes `doc` APIs in other ecosystems.

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize
[react]: https://github.com/facebook/react
[unified]: https://github.com/unifiedjs
[unified-doc]: https://github.com/unified-doc/unified-doc
[vfile]: https://github.com/vfile/vfile
