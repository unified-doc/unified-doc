# Spec

## Contents
- [Intro](#intro)
  - [Where this specification fits](#where-this-specification-fits)
  - [Design](#design)
  - [Implementation](#implementation)
- [`doc`](#doc)
  - [`content`](#content)
  - [`filename`](#filename)
  - [`fileData`](#fileData)
  - [`hast`](#hast)
  - [`textContent`](#textContent)
  - [`compiler`](#compiler)
  - [`parser`](#parser)
  - [`plugins`](#plugins)
  - [`sanitizeSchema`](#sanitizeSchema)
  - [`marks`](#marks)
- [API](#api)
  - [`doc.compile()`](#doccompile)
  - [`doc.file([extension])`](#docfileextension)
  - [`doc.parse()`](#docparse)
  - [`doc.search(query[, options])`](#docsearchquery-options)
  - [`doc.textContent()`](#doctextContent)
- [Packages](#packages)
  - [Parsers](#parsers)
  - [Search Algorithms](#search-algorithms)
  - [Hast Utilities](#hast-utilities)
  - [Wrappers](#wrappers)
- [Glossary](#glossary)

## Intro
This document defines how the `unified-doc` interface is designed to implement a set of APIs to unify working with documents of different formats.  Development of `unified-doc` started in May 2020.

### Where this specification fits

`unified-doc` relates to:
- [unified][] and [hast][] in that it uses these interfaces to provide a unified way to represent content of different formats through `hast` syntax trees.
- documents and files in that it seeks to unify the ways documents and files of different content types can be managed in a unified way.

### Design
`unified-doc` is built with the following design principles:
- Wrap any supported content in a `doc` instance.  All `doc` instances can now be managed in a unified way irregardless of the source content type.
- Maintain a small and simple set of APIs (i.e. `compile`, `file`, `parse`, `search`, `textContent`).
- Represent source content through `hast` trees.
- Preserve the semantic structure of the source content.
- APIs operate on unified and structured [hast][] syntax trees.
- Preconfigured with useful defaults, but extensible through plugins.
- Easily extend existing features to new content types.
- Easily add new features to existing supported content types.
- Use HTML as the default content presentation format and be interoperable with web technologies.
- Node friendly and DOM-independent.

The following diagram provides a visual summary of the design principles.

```
# Create a unified doc instance
unifiedDoc({ content }) -> doc

# Access unified document APIs through unified hast syntax tree
doc.parse()* -> hast
                 | -> plugins (sanitize, marks, etc)* -> doc.compile()* -> HTML output
                 | -> doc.file()* -> output file
                 | -> doc.search()* -> search result snippets
                 | -> doc.textContent() -> text content

*extensible interfaces
```


### Implementation
A brief overview of the `unified-doc` implementation is provided in this section.  Details are covered in further sections.

`unified-doc` uses the [unified][] and [hast][] interfaces to bridge different content types into a unified structured `hast` syntax tree.  At a minimum, the `content` and `filename` must be provided to allow `unified-doc` to infer the source content type and how the content should be parsed.  This inference is accomplished with a mapping of content type to parsers, with the default parser being a text parser.

Once `content` is parsed into a `hast` tree, we can reliably implement APIs for any supported content type with predictable behaviors.  APIs are implemented as private [rehype][] plugins, which operate on the `hast` tree.  For example:
- marks can be applied on the `hast` tree by inserting `mark` nodes based on provided data.
- file data for a specified file extension can be returned by transforming the `hast` tree into relevant output content.
- the `textContent` is easily computed from the `hast` tree by concatenating all values in text nodes.
- the `hast` tree can be sanitized through a custom sanitzation schema.

Public/post plugins can be attached after private plugins to further enhance the `doc`.  Note that some APIs (e.g. `marks` and `textContent`) are unaffected by public plugins since they are applied before post plugins are attached.

Searching a document is a common and useful document feature, and `unified-doc` accepts custom search algorithms implementing a unified search interface that can be attached to the `doc` instance.  The design of the search interface is simple and only requires implementors to compute offsets based on the `textContent` of a `doc` when a `query` string is provided.

Finally, `unified-doc` accepts a configurable `compiler` to compile the `hast` tree into an output that can be used by renderers.  By default, a HTML string compiler is used.


## `doc`
A `doc` refers to an instance of `unified-doc` that manages content.

Content is usually managed digitally in different file formats, and various programs can interface with files to read/render/search/export content.  A `doc` does this a little differently by acting as an abstraction around `content`, with internal APIs that interface with a unified representation of the source content.  This is the key reason for how a `doc` can support multiple content types through a unified set of API methods.

We provide more details on various components of a `doc` that supports building these API methods in the following sections:

### `content`
The `doc` should be provided with a string source content.  The following are common ways to set `content` on a `doc`.

#### Example
```js
const stringContent = 'some string';
const contentFromFile = await someBlob.text();
```

### `filename`
The `doc` will use the `filename` to infer the `mimeType` for the associated `content`, which determines how the `content` will be parsed.  If a `mimeType` cannot be inferred, we set it to `text/plain` as a default value.  The following shows the behaviors between `filename` and inferred `mimeTypes`.

#### Example
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

### `hast`
[hast][] is a syntax tree representing HTML.  Representing data as `hast` internally in a `doc` is one of the key enablers of implementing unified document APIs.  With `hast`, we can:
- model source content from different types as a unified structured tree.
- build features on top of this unified content layer.
- convert to other file formats if `hast` can be mapped to corresponding output.
- operate on the `hast` trees to return a new tree (e.g. marking text nodes).

### `textContent`
The `textContent` of a `doc` is the concatenation of all text nodes of its `hast` content representation.  The `textContent` is free of markup and metadata, and represents 'pure' content that is used in many internal `doc` APIs (e.g. searching and marking).

```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

expect(doc.textContent()).toEqual('some markdown content');
expect(doc.textContent()).not.toContain('> **');

expect(doc.search('nt')).toEqual([ // searches on textContent (not sourceContent)
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

### `fileData`
The `doc` provides ways to output relevant `fileData` for other extensions.  Since the underlying content is represented as `hast`, file data for relevant extensions can be supported by converting the `hast` tree to the output of the specified extension.  As new extensions are supported, this forms a simple but powerful ways to convert files between formats without custom parsers.

#### Example
```js
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
  content: '<blockquote><strong>some</strong> markdown content</blockquote>',
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

The `FileData` interface provides convenient ways to retrieve the file's `name`, `stem`, `type`, `extension`.  It is easy to create a JS `File` from `FileData` and vice versa:

```js
const { content, name, type } = doc.file();
const jsFile = new File([content], name, { type });
```

### `compiler`
A `compiler` compiles a `hast` tree into a [`vfile`][vfile] that storing the compiled output (usually a string).  The results of a `compiler` is used by a renderer to render the `doc`.  By default, a HTML string compiler is used.  A `compiler` is applied using the `PluggableList` interface e.g. `[compiler]` or `[[compiler, compilerOptions]]`.

#### Example
```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

expect(doc.compile().contents).toContain('<blockquote>');
```

### `parser`
A [`parser`][parser] is responsible for parsing string `content` into a `hast` tree.  A `doc` will infer the mime type of the `content` from the specified `filename` and use an associated parser.  If no parser is found, a default text parser will be used.  Parsers are applied using the `PluggableList` interface and can include multiple steps e.g. `[textParse]` or `[remarkParse, remark2rehype]`.  Custom parsers are specified through a mapping of mimeTypes to associated parsers.

#### Example
```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
  parsers: {
    'text/html': [parser1, parser2, parser3], // overwrite html parser with a custom multi-step parser
    'application/pdf': [pdfParser],  // a unified pdf parser is in high demand!
  },
});
```

### `plugins`
Private plugins are used internally by the `doc`.  Public [rehype][] plugins can be specified to add further features to the `doc`.  These plugins should use the `PluggableList` interface e.g. `[plugin1, [plugin2, plugin2Options]]`.  They should also avoid mutating or affecting the `textContent` of a `doc` to best ensure that internal APIs that rely on the `textContent` (e.g. searching, marking) are well-behaved.

`plugins` can be appled as `prePlugins` or `postPlugins`, where they are applied before or after private plugins respectively.  Private methods such as `textContent()` and `parse()` will not incorporate `hast` modifications introduced by `postPlugins`.  They may incorporate modifications introduced by `prePlugins`.  Depending requirements and behaviors of public plugins, you may use the two interchangeably to satisfy your use cases.

#### Example
```js
import highlight from 'rehype-highlight'
import toc from 'rehype-toc'

const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
  postPlugins: [
    [toc, { cssClasses; { list: 'custom-list'} }],
  ],
  prePlugins: [
    [highlight, { ignoreMissing: true }],
  ],
});
```

### `sanitizeSchema`
By default, a `doc` will be safely sanitized.  You can supply a custom schema to apply custom sanitization.  Please see the [`hast-util-sanitize`][hast-util-sanitize] package for more details.  Sanitization rules are applied before `plugins` and the following schema values control special rules:
- `{}`: safe sanitization (default value)
- `null`: No sanitization

#### Example
```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
  sanitizeSchema: {
    { attributes: { '*': ['className', 'style'] } }; // only allow styles and classname
  },
});
```

### `marks`
A `doc` should provide a simple way to apply `marks`.  Marks are useful in various document applications to:
- visually indicate marked nodes.
- serve as positional anchor in the document for further DOM operations (e.g. attaching other nodes).

A `Mark` is an object that indicates the `start` and `end` offset range relative to the `textContent` of the `doc`.  

```ts
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
```

Along with various stylistic properties (e.g. `classNames`, `style`, `dataset`), the `doc`'s mark algorithm should be able to insert `mark` nodes where matches occur.  The mark algorithm is done through a `hast` utility that returns a new `hast` tree with marked nodes.  Subsequent rendering of the document with marked nodes is easily implemented without further cost.

```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
  marks: [
    { id: 'a', start: 5, end: 13, classNames: ['class-a'] },
  ],
});

expect(doc.compile().contents)
  .toEqual(`
    <blockquote>
      <strong>some</strong> <mark className="class-a">markdown</mark> content
    </blockquote>
  `);
```

## API

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
Returns `FileData` for the specified extension.  This is a useful way to convert and output different file formats.  Supported extensions include `'.html'`, `'.txt'`.  If no extension is provided, the source file should be returned.  Future extensions can be implemented, providing a powerful way to convert file formats for any supported content type.

#### Example
```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

// returns source file
expect(doc.file()).toEqual({
  content: '> **some** markdown content',
  extension: '.md',
  name: 'doc.md',
  stem: 'doc',
  type: 'text/markdown',
});

// returns corresponding HTML file
expect(doc.file('.html')).toEqual({
  content: '<blockquote><strong>some</strong> markdown content</blockquote>',
  extension: '.html',
  name: 'doc.html',
  stem: 'doc',
  type: 'text/html',
});

// returns only the textContent in a .txt file
expect(doc.file('.txt')).toEqual({
  content: 'some markdown content',
  extension: '.txt',
  name: 'doc.txt',
  stem: 'doc',
  type: 'text/plain',
});
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

### `doc.textContent`
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

## Packages
The `unified-doc` project should use the following recommended package organization:

### Parsers
Content parsers transform source content into `hast` trees.  All parser packages should have the naming convention `unified-doc-parse-<custom-parser>`.

### Search Algorithms
Search algorithms implement custom ways to return search results against the `textContent` representation of a `doc` by using a unified `SearchAlgorithm` interface mentioned in earlier sections.  All search algorithm packages should have the naming convention `unified-doc-search-<custom-search-algorithm>`.

### Hast Utilities
Hast utilties are methods that operate on `hast`, and return new `hast` trees.  All hast utily packages should have the naming convention `unified-doc-util-<custom-util>`.

### Wrappers
Wrappers implement the `unified-doc` interface in other interfaces.  Wrappers should expose the `doc` instance and avoid heavily wrapping or obsfucating `doc` APIs.  All wrapper packages should have the naming convention `unified-doc-<custom-wrapper>`.


## Glossary
- **`compiler`**: A function that converts a `hast` tree into output data that can be used by a renderer to render its contents (usually HTML output).
- **`content`**: The physical materialization of `knowledge`.
- **`document`**: A digital abstraction for organizing `content`.
- **`doc`**: An instance of `unified-doc` representing a `document`.
- **`file`**: A concrete digital object that stores `content` and associated metadata.
- **`filename`**: The name of a `file`. Used by a `doc` to infer the source `mimeType` which determines how `content` is parsed with an appropriate `parser`.
- **`hast`**: A syntax tree representing HTML.  A `hast` tree is created from a `parser` parsing `content`.  It is used internally by a `doc` to implement many APIs that rely on a unified and structured representation of the source `content`.
- **`knowledge`**: Abstract human information that is acquired and shared among humans.
- **`mark`**: An object describing how `textContent` in a `doc` should be marked.
- **`mimeType`**: A standard used to identify the nature and format for the associated `content`.
- **`plugins`**: [rehype][] plugins that further enhance the `doc`.
- **`sanitizeSchema`**: A schema describing custom sanitzation rules. A `doc` is safely sanitized by default.
- **`searchAlgorithm`**: A function that takes a query string with configurable options, and returns search results when searching across the `textContent` in a `doc`.  Search algorithms should be implemented with a unified search interface when attached to a `doc`.
- **`searchResult`**: An object with offsets to indicate where the matched value occurs when searching against the `textContent` of a `doc`.
- **`searchResultSnippet`**: An extension of a `searchResult` that provides snippet information (preceding and postceding text surrounding the matched search value).
- **`textContent`**: The text content of a `doc` is the concatenated value of all text nodes in the `doc`.  This content is free of markup and metadata, and is used in many important `doc` features (e.g. marks and search).
- **`unified`**: The [project][unified] that unifies content as structured data.
- **`unified-doc`**: This [project][unified-doc] that unifies document APIs on top of a unified content layer.
- **`util`**: Usually refers to `hast` utilities that operate on `hast` trees.
- **`wrapper`**: A function that implements and exposes `doc` APIs in other interfaces.

<!-- Definitions -->
[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize
[hast]: https://github.com/syntax-tree/hast
[ideas]: https://github.com/unified-doc/ideas
[parser]: https://github.com/unifiedjs/unified#processorparser
[rehype]: https://github.com/rehypejs/rehype
[unified-doc]: https://github.com/unified-doc/unified-doc
[unified]: https://github.com/unifiedjs/unified
[vfile]: https://github.com/vfile/vfile
