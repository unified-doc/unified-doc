# Specs

Specifications for how the `unified-doc` project should be defined and implemented to support building unified document APIs.

Key concepts and terminology used throughout the documentation (a full list is provided in the [**Glossary**](#glossary) section):
- **`knowledge`**: refers to abstract human information that is acquired and shared among humans.
- **`content`**: represents the physical materialization of `knowledge`.  For this documentation, we will only refer to digital forms of `content` (e.g. string  or bytes with specific encodings).
- **`document`**: an abstraction that manages `content`.
- **`doc`**: an instance of `unified-doc` that represents a `document`.
- **`file`**: an object to store `content` and meaningful metadata.

## Contents
- [`doc`](#doc)
- [`parser`](#parser)
- [`hast`](#hast)
- [`compiler`](#compiler)
- [`sanitizeSchema`](#sanitizeSchema)
- [`searchAlgorithm`](#searchAlgorithm)
- [`plugins`](#plugins)
- [Wrappers](#wrappers)
- [Glossary](#glossary)

## `doc`
A `doc` is an instance of a `document` implemented by `unified-doc` that represents an abstraction for managing `content` (e.g. reading, transforming, rendering, saving, sharing). The following are core concepts in defining a well-behaved `doc`.

### `doc.content`
`content` is usually typed as a `string` or `Buffer` in the `doc`.  The following are valid forms of content for a `doc`:

```js
const stringContent = 'some string';
const bufferContent = Buffer.from('some string');
const contentFromFile = await someBlob.text();
```

> **Note**: In JS, it is easy to create `content` from string, `File` or `Blob` objects.

### `doc.filename`
A `doc` is usually associated with a `file` to store and share `content`.  A `filename` is a string that represents the name of this `file`.  The `doc` will use the `filename` to infer the mime type for the associated `content`.  This then determines how the `content` will be parsed.  If a mime type cannot be inferred, we set it to `text/plain` as a default value.  The following shows the behaviors between `filename` and inferred mime types:

```js
const file0 = 'file.html'; // text/html
const file1 = 'file.htm'; // text/html
const file2 = 'file.md'; // text/markdown
const file3 = 'file.txt'; // text/plain
const file4 = 'file.jpg'; // image/jpeg
const file5 = 'file.random-extension'; // text/plain
const file6 = 'file.a.b.c'; // text/plain
const file7 = 'no-extensions-not-recommended'; // text/plain
```

> **Note**: Relying on `filename` to determine the actual mime type of `content` is not a reliable method.  It is however a very convenient method, and is therefore used in the `doc` to infer how `content` should be parsed.

### `doc.annotations`
An `annotation` is an object describing how to annotate/mark text nodes in a `doc`.  In order to do this, an `annotation` needs to provide the `start` and `end` offset relative to the `text` content of the `doc`.  The formal spec for an `annotation` is provided below:

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

The `doc` should apply annotations by simply wrapping annotated text segments with `<mark />` nodes and leave other areas of the document semantically unchanged.  The following pseudocode outlines how annotations work:

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

// apply <mark /> nodes to annotated text nodes identified above
const annotated = annotate(hast, { annotations });
```

### `doc.compile(): VFile`
If a valid `compiler` is provided, this method supports compiling its `content` into output contents/results stored in a [vfile][vfile].  Renderers can make use of this compiled data to render the document.

### `doc.file(extension?: string): FileData`
Supports easy ways to convert between file formats by providing an `extension` parameter (e.g. `.html`, `.txt`).  The formal spec for the file data is provided below:

```ts
interface FileData {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}
```

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
console.log(doc.file('.html')); // outputs html converted file
// {
  // content: '<blockquote><strong>some</strong>markdown content</blockquote>',
  // extension: '.html',
  // name: 'doc.html',
  // stem: 'doc',
  // type: 'text/html',
// }
```

Note that you can easily create a JS `File` using `FileData`:
```js
const { content, name, type } = doc.file('.html');
const file = new File([content], name, { type }); // creates a valid HTML file
```

### `doc.parse(): Hast`
Converts the `content` of a `doc` into a `hast` tree.  The tree is useful for transformations with `hast` utilities.  The `doc` uses the `hast` representation of the content to implement many private document APIs.

```js
const content = '> **some** markdown content';
console.log(doc.parse());
// { type: 'root', children: [...] }
```

### `doc.string(): string`
Provides a convenient way to return the string representation of the `content` in a `doc`.  The default string encoding is `utf-8`.

```js
const content = Buffer.from('> **some** markdown content');
console.log(doc.string()); // '> **some** markdown content' 
```

### `doc.text(): string`
Provides a very simple but important way to extract the `text` content from a `doc`.  The `text` content is human-readable content that is free of markup and metadata, and is obtained from the values of all text nodes in the `hast` representation of the `content`.  This `text` content is used in various `doc` features (e.g. `annotations` and `search`).

```js
const content1 = Buffer.from('> **some** markdown content');
console.log(doc1.text()); // 'some markdown content';

const content2 = '<blockquote><strong>some</strong> markdown content</blockquote>';
console.log(doc2.text()); // 'some markdown content';
```

### `doc.search(query: string, options?: Record<string, any>): SearchResultSnippet[]`
Searches on the `doc`'s `text` content with a provided `query` and configurable options and returns `SearchResultSnippet`.  This method supports a simple but robust way to search the `doc` irregardless of its content type, and provides ways to integrate custom `searchAlgorithm` with the same interface as illustrated in the example below:

```js
const content = '> **some** markdown content';
const searchOptions = { snippetOffsetPadding: 5 }
doc.search('some|content', { enableRegexp: true });
// [
  // { start: 0, end: 5, value: 'some', snippet: ['', 'some', ' mark']},
  // { start: 14, end: 21, value: 'content', snippet: ['down ', 'content', '']},
// ]
```

More details about [`searchAlgorithm`](#searchAlgorithm) is covered in a later section.

## `parser`
A `parser` is responsible for parsing `content` in a `doc` into a `hast` tree.  

```ts
function parser(content: string, options?: Record<string, any>): Hast;
```

The `doc` should detect and assign a parser based on the mime type inferred from the `filename`.  This parser will then parse the provided `content`.  The `doc` can support new `content` types by implementing and integrating new parsers.

> **Note**: All parsers in `unified-doc` should use the `unified-doc-parse-*` naming convention.

## `hast`
[`hast`][hast] is a syntax tree that represents HTML.  A `hast` tree is created from a `parser` parsing `content` in a `doc`.

### Utilities
`hast` utilities are functions that operate or modify `hast` trees.  `doc` APIs are usually implemented as `hast` utilities because `hast` provides a unified and structured representation of `content` that can be transformed independent of the source `content` type.

```ts
function util(hast: Hast, options?: Record<string, any>): Hast;
```

> **Note**: All `hast` utilities in `unified-doc` should use the `unified-doc-util-*` naming convention.

## `compiler`
A `compiler` compiles a `hast` tree into an output (usually a string).  The content/result of a `compiler` is usually used by a renderer to render the content.  This is a required field to specify a `doc` isntance because it affects how the `doc` is rendered and viewed.

```ts
function compile(hast: Hast, options?: Record<string, any>): any;
```

## `sanitizeSchema`
By default, the `doc`'s `hast` tree will be safely sanitized.  You can supply a custom sanitize schema for defining custom sanitization rules before `plugins` are applied.  Please see the [`hast-util-sanitize`][hast-util-sanitize] package for more details.

## `searchAlgorithm`
The `doc` provides a simple way to search its `text` content against a `query` string.  The interface for searching is implemented through a `searchAlgorithm`.  A `doc` is initialized with a `searchAlgorithm` defined by the following spec:

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
}

interface SearchResultSnippet extends SearchResult {
  snippet: [string, string, string];
}
```

A `searchAlgorithm` implementation simply needs to return search results containing text offsets calculated based on the `text` content of the `doc` in relation to the `query` string.  The `doc` provides a simple default `searchAlgorithm` based on regexp search, but more advanced interfaces and algorithms can be attached to the `doc`.

> **Note**: All search algorithms in `unified-doc` should use the `unified-doc-search-*` naming convention.

## `plugins`
Plugins provide a way to further add features to the `doc`.  The `doc` is built using a number of private plugins.  The `doc` requires that public plugins:
- be `hast`-based.
- are applied after private plugins, so they do not affect the private APIs of the `doc`.
- ideally do not mutate the tree and do not add `text` content into the tree, which may interfere with APIs that work with `doc.text()`.

## Wrappers
A wrapper is an implementation that wraps the `doc` instance and exposes its APIs more conveniently in another ecosystem.  An example of a wrapper is `unified-doc-react`, a [react][react] wrapper for `unified-doc`.  Wrappers should:
- specify a `compiler` and easily render the `doc` in the corresponding ecosystem.
- expose the `doc` instance for convenient access to all `doc` API methods.
- include a reference to the evaluated `doc` DOM node for convenient DOM manipulation.
- never change the interface of the `doc` APIs.
- remain non-opinionated about how `doc` APIs are used (i.e. simply pass the APIs through).

## Glossary
The following are the author's definition of terms used in the project:

- **`annotation`**: data that describes how a substring in the `text` content of a `doc` should be marked.
- **`compiler`**: a function that compiles and converts a `hast` tree into output data, which is used to render and view the `doc`.
- **`content`**: represents the physical materialization of `knowledge`.  This is the underlying data in a `doc` instance.
- **`document`**: an abstraction that manages `content`.
- **`doc`**: an instance of `unified-doc` that represents a `document`.
- **`file`**: an object to store `content` and associated metadata.
- **`filename`**: the name of the `file`.  A `filename` should include the file extension and is used by the `doc` to infer mime types in order to parse `content` with the appropriate `parser`.
- **`hast`**: `doc` `content` represented in a structured HTML-based syntax tree.  `hast` trees allow unified transformations to be performed across different `content` types.
- **`knowledge`**: refers to abstract human information that is acquired and shared among humans.
- **`plugin`**: a function that can operate on the `hast` tree.
- **`sanitizeSchema`**: all content is HTML-sanitized by default but a sanitize schema can define custom sanitization rules.
- **`searchAlgorithm`**: a function that takes a string query with configurable options, and returns search results while searching across the `text` content in a `doc`.
- **`searchResult`**: a search result should include offsets to indicate where it occurs in the `text` content of a `doc`.
- **`searchResultSnippet`**: a search result snippet is an extension of a search result that contains preceding and postceding text surrounding the matched search value.
- **`string`**: representation of the `doc` source content in string form.
- **`text`**: text-only content (from text nodes) extracted from the `doc` source content.  This is usually free of any metadata and markup.  The `text` value is used in many `doc` APIs (e.g. `annotations` and `search`).
- **`unified`**: the [project][unified] that unifies content as structured data.
- **`unified-doc`**: this [project][unified-doc] that unifies document APIs on top of a unified content layer.
- **`util`**: usually refers to `hast` utilities that operate on `hast` trees.
- **`vfile`**: a lightweight data structure that represents a `doc` as a virtual `file`.
- **`wrapper`**: a wrapping function that implements the `doc` instance and APIs conveniently in another ecosystem.

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize
[react]: https://github.com/facebook/react
[unified]: https://github.com/unifiedjs
[unified-doc]: https://github.com/unified-doc/unified-doc
[vfile]: https://github.com/vfile/vfile
