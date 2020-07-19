# Spec
Specifications for how the `unified-doc` interface should be defined and implemented to build unified document APIs.

The following are key concepts used throughout the documentation (a full list is provided in the [Glossary](#glossary) section).
- **`knowledge`**: abstract human information that is acquired and shared among humans.
- **`content`**: the physical materialization of `knowledge`.
- **`document`**: an abstraction that manages `content`.
- **`doc`**: an instance of a `document` implemented by `unified-doc`.
- **`file`**: an object storing `content` and associated metadata.

## Contents
- [Intro](#intro)
- [Design](#design)
- [Implementation](#implementation)
- [Configuration](#configuration)
  - [`content`](#content)
  - [`filename`](#filename)
  - [`annotations`](#annotations)
  - [`compiler`](#compiler)
  - [`parsers`](#parsers)
  - [`plugins`](#plugins)
  - [`sanitizeSchema`](#sanitizeSchema)
  - [`searchAlgorithm`](#searchAlgorithm)
  - [`searchOptions`](#searchOptions)
- [API](#api)
  - [`compile`](#compile)
  - [`file`](#file)
  - [`parse`](#parse)
  - [`search`](#search)
  - [`textContent`](#textContent)
- [Packages](#packages)
- [Glossary](#glossary)

## Intro
Vast amounts of human knowledge is stored digitally in different document formats.  It is cheap to create, store, render, and manage content within the same document format, but much harder to perform the same operations for content across different document formats.  Some form of [unified][unified] bridge is required to significantly lower the friction for working across document formats, and subsequently improve aquisition and sharing of human knowledge.

Instead of implementing custom programs per content type to parse/render/search/annotate/export content, `unified-doc` implements a set of unified document APIs for supported content types.  This allows extension of existing APIs to newly introduced content types, and for supported content types to benefit from new API methods.

With `unified-doc`, we can easily
- compile and render any content to HTML.
- format and style the document.
- annotate the document.
- search on the document's text content.
- export the document in a variety of file formats.
- preserve the semantic structure of the source content.
- retrieve useful representations of the document (source content, text content, syntax tree).
- enrich the document through an ecosystem of plugins.
- evolve with interoperable web technologies.

## Design
`unified-doc` is built with the following design principles:
- Wrap any supported content in a `doc` instance.  All `doc` instances can now be managed in a unified way irregardless of the source content type.
- Maintain a small and simple set of APIs (`compile`, `file`, `parse`, `search`, `textContent`).
- APIs operate on unified and structured [hast][hast] syntax trees.
- New content types can benefit from existing APIs as long as it can be parsed into `hast`.
- Preconfigured with useful defaults, but extensible through plugins.
- Node friendly and DOM-independent.

The following diagram provides a visual summary of the design principles.

```
# Create a unified doc instance
unifiedDoc({ content }) -> doc

# Access unified document APIs through unified hast syntax tree
*doc.parse() -> hast
                 | -> annotations -> *plugins -> *doc.compile() -> output
                 | -> *doc.file() -> output file
                 | -> *doc.search() -> search result snippets
                 | -> doc.textContent() -> text content

*extensible interfaces
```

## Implementation
Specific details are covered in the [**Configuration**](#configuration) and [**API**](#api) sections.  A brief overview of the `unified-doc` implementation is provided in this section.

`unified-doc` uses the [unified][unified] and [hast][hast] interfaces to bridge different content types into a unified structured `hast` syntax tree.  At a minimum, the `content` and `filename` must be provided to allow `unified-doc` to infer the source content type and how the content should be parsed.  This inference is accomplished with a mapping of content type to parsers, with the default parser being a text parser.

Once `content` is parsed into a `hast` tree, we can reliably implement APIs for any supported content type with predictable behaviors.  APIs are implemented as private [rehype][rehype] plugins, which operate on the `hast` tree.  For example:
- annotations can be applied on the `hast` tree by inserting annotated `mark` nodes based on provided annotation data.
- file data for a specified file extension can be returned by transforming the `hast` tree into relevant output content.
- the `textContent` is easily computed from the `hast` tree by concatenating all values in text nodes.
- the `hast` tree can be sanitized through a custom sanitzation schema.

Public rehype plugins can be attached after private plugins to further enhance the `doc`.  Note that some APIs (e.g. `annotations` and `textContent`) are unaffected by public plugins since they are applied before public plugins are attached.

Searching a document is a common and useful feature, and `unified-doc` accepts custom search algorithms that implement an underlying unified search interface.  The design of the search interface is simple and only requires implementors to compute offsets based on the `textContent` of a `doc` with a provided query string.

Finally, `unified-doc` accepts a configurable `compiler` to compile the `hast` tree into an output that can be used by a renderer program.  By default, a HTML string compiler is used.

## Configuration
`unified-doc` accepts the following configuration options.

### `content`
Refers to the source data of a `doc` provided as a string.  The following are common ways to set `content` on a `doc`.

```js
const stringContent = 'some string';
const contentFromFile = await someBlob.text();
```

### `filename`
The `doc` will use the `filename` to infer the `mimeType` for the associated `content`, which determines how the `content` will be parsed.  If a `mimeType` cannot be inferred, we set it to `text/plain` as a default value.  The following shows the behaviors between `filename` and inferred `mimeTypes`.

```js
const file0 = 'file.html'; // text/html (html parser)
const file1 = 'file.htm'; // text/html (html parser)
const file2 = 'file.md'; // text/markdown (markdown parser)
const file3 = 'file.txt'; // text/plain (text parser)
const file5 = 'file.random-extension'; // text/plain (text parser)
const file6 = 'file.a.b.c'; // text/plain (text parser)
const file7 = 'no-extensions-not-recommended'; // text/plain (text parser)
const file4 = 'file.jpg'; // image/jpeg (unsupported parser, defaults to string parser)
const file4 = 'file.pdf'; // application/pdf (unsupported parser, defaults to string parser)
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
  dataset?: Record<string, any>; // assigns dataset attributes
  data?: Record<string, any>;  // any other data not relating to markup
  style?: Record<string, any>;
}
```

A `doc` should implement `annotations` by wrapping annotated text node segments with `<mark />` nodes while leaving other areas of the `doc` semantically unchanged.

### `compiler`
A `compiler` compiles a `hast` tree into a `vfile` that stores the compiled output (usually a string).  The results of a `compiler` is used by a renderer to render the `doc`.  By default, a HTML string compiler is used.  A `compiler` is applied using the `PluggableList` interface e.g. `[compiler]` or `[[compiler, compilerOptions]]`.

```ts
function compile(hast: Hast, options?: Record<string, any>): VFile;
```

### `parsers`
A `parser` is responsible for parsing string `content` into a `hast` tree.  A `doc` will infer the mime type of the `content` from the specified `filename` and use an associated parser.  If no parser is found, a default text parser will be used.  Parsers are applied using the `PluggableList` interface and can include multiple steps e.g. `[textParse]` or `[remarkParse, remark2rehype]`.  Custom parsers are specified through a mapping of mimeTypes to associated parsers.

### `plugins`
All plugins should be [rehype][rehype]-based and use the `PluggableList` interface e.g. `[plugin1, [plugin2, plugin2Options]]`.  Private plugins are used by `doc` APIs.  Public plugins are applied after private plugins and add further features to the `doc`.  Public plugins should avoid mutating or affecting the `textContent` of a `doc`.

### `sanitizeSchema`
By default, a `doc` will be safely sanitized.  You can supply a custom schema to apply custom sanitization.  Please see the [`hast-util-sanitize`][hast-util-sanitize] package for more details.  Sanitization rules are applied before public plugins and the following schema values control special rules:
- `null`: No sanitization.
- `{}`: safe sanitization (default value).

### `searchAlgorithm`
A `doc` provides a simple way to search its `textContent` against a `query` string.  A `searchAlgorithm` implements the behaviors of searching a `doc` and uses the following unified search interface.

```ts
type SearchAlgorithm = (
  content: string,
  query: string,
  options?: Record<string, any>,
) => SearchResult[];

interface SearchResult {
  start: number;
  end: number;
  value: string;
  data?: Record<string, any>;
}
```

A `searchAlgorithm` implementation simply needs to return `SearchResults` containing text offsets relative to the `textContent` of a `doc` when a `query` string is provided.

### `searchOptions`
A `searchAlgorithm` returns `SearchResults` but common search behaviors can be configured through a common `searchOptions`.  Future configurations can be supproted to benefit any attachable `searchAlgorithm`.

## API
The following form the set of unified document APIs used in `unified-doc`.

### `compile`
```ts
function compile(): VFile;
```

Compiles `content` into output results that is stored on a [`vfile`][vfile] based on the attached [`compiler`](#compiler).  Renderers can use the compiled results to render the document.

### `file`
```ts
function file(extension?: string): FileData;

interface FileData {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}
```

Supports easy ways to convert between file formats based on a supported `extension` argument.  The supported file extensions and behaviors are:
- `undefined`: returns the source file without modification.
- `.html`: returns the compiled `html` in a `.html` file.
- `.txt`: returns the `textContent` in a `.txt` file.

```js
const content = '> **some** markdown content';

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
```

Note that you can easily create a Javascript `File` instance using `FileData`:
```js
const { content, name, type } = doc.file('.html');
const file = new File([content], name, { type }); // creates a valid HTML file
```

### `parse`
Converts `content` into a [`hast`][hast] tree.  The tree is useful for transformations with `hast` utilities.  A `doc` uses this unified and structured `hast` representation to implement document APIs independent of its source content type.

```js
expect(doc.parse()).toEqual({ // hast tree
  type: 'root',
  children: [...],
});
```

### `search`
```ts
function search(query: string, options?: Record<string, any>): SearchResultSnippet[];

interface SearchResultSnippet extends SearchResult {
  snippet: [string, string, string];
}

interface SearchResult {
  start: number;
  end: number;
  value: string;
  data?: Record<string, any>;
}
```

Searches on the `textContent` of a `doc` when a `query` string and configurable `options` is provided.  Returns `SearchResultSnippet`.  This method supports a simple and robust way to search on a `doc` irregardless of its source content type. Custom `searchAlgorithm` with the same unified interface can be easily integrated.

Any search algorithm benefits from a common `searchOptions` config in addition to their algorithm-specific options.

```js
const content = '> **some** markdown content';
const searchOptions = { minQueryLength: 2, snippetOffsetPadding: 10 }

expect(doc.search('some')).toEqual([
  { start: 0, end: 5, value: 'some', snippet: ['', 'some', 'markdown content']},
]);
```

### `textContent`
```ts
function textContent(): string;
```

The `textContent` of a `doc` is obtained by extracting values of all text nodes in the `hast` representation of the source `content`.  The `textContent` is an extremely useful representation of the source content.  This representation includes only meaningful text data without markup.  APIs (e.g. `search` and `annotations`) using `textContent` are usually implemented in simple ways involving simple computations of string offsets relative to the `textContent`.

```js
const content1 = '> **some** markdown content';
expect(doc1.textContent()).toEqual('some markdown content');

const content2 = '<blockquote><strong>some</strong> markdown content</blockquote>';
expect(doc2.textContent()).toEqual('some markdown content');
```


## Packages
The `unified-doc` project should be built with the following package organization:

### Parsers
A `parser` is responsible for parsing string `content` into a [`hast`][hast] tree.

```ts
function parser(content: string, options?: Record<string, any>): Hast;
```

> **Note**: All parsers should use the `unified-doc-parse-*` naming convention.

### Hast Utils
`hast` utilities are functions that operate on `hast` trees.  `doc` APIs are usually implemented with `hast` utilities because `hast` provides a unified and structured representation for transforming `content` irregardless of its source content type.

```ts
function util(hast: Hast, options?: Record<string, any>): Hast;
```

> **Note**: All `hast` utilities should use the `unified-doc-util-*` naming convention.

### Search Algorithms
A `doc` provides a simple way to search its `textContent` against a `query` string.  A `searchAlgorithm` implements the behaviors of searching a `doc` and uses the following unified search interface.

```ts
type SearchAlgorithm = (
  content: string,
  query: string,
  options?: Record<string, any>,
) => SearchResult[];

interface SearchResult {
  start: number;
  end: number;
  value: string;
  data?: Record<string, any>;
}
```

A `searchAlgorithm` implementation simply needs to return `SearchResults` containing text offsets relative to the `textContent` of a `doc` when a `query` string is provided.

> **Note**: All search algorithms should use the `unified-doc-search-*` naming convention.

### Wrappers
Wrappers implement and expose `doc` APIs in other interfaces.  An example of a wrapper is `unified-doc-react`, a [`react`][react] wrapper for `unified-doc`.  Wrappers should:
- attach a `compiler` to easily render the `doc` in the corresponding native interface.
- expose the `doc` instance for convenient access to `doc` API methods.
- include a reference to the rendered `doc` element for convenient DOM manipulation.
- avoid obsfuscating `doc` APIs with wrapping code.

> **Note**: All wrappers should use the `unified-doc-*` naming convention.

## Glossary
The following are the author's definition of terms used in the project:

- **`annotation`**: an object describing how `textContent` in a `doc` should be marked.
- **`compiler`**: a function that converts a `hast` tree into output data that can be used be a renderer to render a `doc`.
- **`content`**: the physical materialization of `knowledge`.
- **`document`**: an abstraction that manages `content`.
- **`doc`**: an instance of a `document` implemented by `unified-doc`.
- **`file`**: an object storing `content` and associated metadata.
- **`filename`**: the name of a `file` that is used by a `doc` to infer the source `mimeType` for parsing `content` with an appropriate `parser`.
- **`hast`**: a syntax tree representing HTML.  A `hast` tree is created from a `parser` parsing `content`.  It is used by a `doc` to implement many APIs that rely on a unified and structured representation of the source `content`.
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
- **`vfile`**: a lightweight object representing a virtual `file`.
- **`wrapper`**: a wrapping function that implements and exposes `doc` APIs in other ecosystems.

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize
[react]: https://github.com/facebook/react
[rehype]: https://github.com/rehypejs/rehype
[unified]: https://github.com/unifiedjs
[unified-doc]: https://github.com/unified-doc/unified-doc
[vfile]: https://github.com/vfile/vfile
