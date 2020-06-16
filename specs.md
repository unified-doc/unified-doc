# Specs

Specifications for how the `unified-doc` system and its components should behave.

The following opinionated definitions are used throughout the documentation.
- `knowledge`: refers to *abstract human information* that is acquired and shared amongst humans.
- `content`: represents the physical materialization of `knowledge`.  For this documentation, we will only refer to digital expressions of `content` (e.g. string  or bytes in specific encodings).
- `document`: an abstraction that manages `content`.
- `file`: represents an abstract way of storing `content` with meaningful metadata.  Most `document` implementations will have APIs to read and write to a `file`.

## Contents
- [`document`](#document)
- [`parser`](#parser)
- [`hast`](#hast)
- [`compiler`](#compiler)
- [`sanitizeSchema`](#sanitizeSchema)
- [`searchAlgorithm`](#searchAlgorithm)
- [`plugins`](#plugins)
- [Wrappers](#wrappers)
- [Glossary](#glossary)

## `document`
A `document` represents an abstraction that manages `content`.  The following are core concepts forming the abstraction of a `document`.

### `content`
`content` is represented as a `string` or `Buffer` data type in the system.  It encodes the data and information that represents `knowledge`.  The following are valid forms of content:

```js
const stringContent = 'some string';
const bufferContent = Buffer.from('some string');
const contentFromFile = await someBlob.text();
```

> Note: In JS, it is easy to create `content` from string, `File` or `Blob` objects.

### `filename`
A `document` is usually associated with a `file` to store and share the underlying data.  Therefore a `filename` is an important field for a well-behaved `document`.

A `filename` is a string that represents the name of the file and is inclusive of the file extension.  The system will use the `filename` to infer the mime type for the associated `content`.  This determines how the `content` will be parsed.  If a mime type cannot be inferred, we set it to `text/plain` as a default value.  The following shows the behaviors between `filename` and inferred mime types:

```js
const file0 = 'file.html'; // text/html
const file1 = 'file.htm'; // text/html
const file2 = 'file.md'; // text/markdown
const file3 = 'file.txt'; // text/plain
const file4 = 'file.jpg'; // image/jpeg
const file5 = 'file.random-extension'; // text/plain
const file6 = 'file.a.b.c'; // text/plain
const file7 = 'no-extensions-not-recommended';  // text/plain
```

> Note: Relying on `filename` to determine the actual mime type of `content` is not a reliable method.  However, it is a convenient method, and is therefore an opinionated and deliberate part of the spec.

### `annotations`
> TODO: to be updated

### `compile()`
> TODO: to be updated

### `file()`
> TODO: to be updated

### `parse()`
> TODO: to be updated

### `string()`
> TODO: to be updated

### `text()`
> TODO: to be updated

### `search()`
> TODO: to be updated

## `parser`
A `parser` is responsible for parsing a `document`'s string `content` into a `hast` tree.  

```ts
function parser(content: string, options?: Record<string, any>): Hast;
```

The `document` should detect and assign a parser based on the mime type inferred from the `filename`.  This parser will then parse the provided `content`.  The `document` can support new `content` types by implementing and integrating new parsers.

> NOTE: All parsers in the system should adopt the `unified-doc-parse-*` naming convention.

## `hast`
[`hast`][hast] is the underlying syntax tree that represents HTML.  A `hast` tree is created from a `parser` parsing `content` in a `document`.  All `hast` trees follow the same spec, and therefore allow any methods that operate on them to be interoperable.  Casting the `content` to `hast` is an important part of the system to implement unified document APIs.

### Utilities
[`hast`][hast] utilities are functions that operate or modify `hast` trees.  Document APIs are usually implemented as `hast` utilities because `hast` provides a unified and structured representation of `content`.  This allows consistent and unified APIs in a `document` irregardless of its source `content` type

```ts
function util(hast: Hast, options?: Record<string, any>): Hast;
```

> NOTE: All `hast` utilities in the system should adopt the `unified-doc-util-*` naming convention.

## `compiler`
A `compiler` compiles a `hast` tree into an output (usually a string).  The content/result of a `compiler` is usually used by a `renderer` to render the content.

```ts
function compile(hast: Hast, options?: Record<string, any>): any;
```

## `sanitizeSchema`
> TODO: to be updated

## `searchAlgorithm`
> TODO: to be updated

> NOTE: All `searchAlgorithm` in the system should adopt the `unified-doc-search-*` naming convention.

## `plugins`
Plugins provide a way to add features to the `document`.  The system is built with a number of private plugins.  The system requires that public plugins:
- are `hast`-based.
- are applied after private plugins, so they do not affect the private APIs of the `document`.
- ideally do not mutate the tree and do not add `text` content into the tree.

## Wrappers
A wrapper is a layer of code that wraps the `document` instance and exposes the `document`APIs more conveniently in another ecosystem.  An example of a wrapper is `unified-doc-react`, which is a [react][react] wrapper around the `document` APIs.  Wrappers should:
- never change the interface of the `document` APIs.
- expose the `document` instance for convenience and completion.
- have a reference to the evaluated `document` DOM node.

## Glossary
The following are the author's definition of the terms used in this document and project:

- `annotation`: data that describes how a substring in the document text should be visibly marked.
- `compiler`: a function that compiles and converts the `hast` tree back into (string) content to allow rendering and previewing of the document.
- `content`: the underlying and source content of the document.
- `doc`: a document abstraction with unified APIs.
- `file`: how a document will be stored and shared.
- `filename`: name of the file that represents a document.  Filename includes the file extension and is used to infer the underlying mimetype that is used to determine how content is parsed and presented.
- `hast`: document content represented in a unified and structured HTML-based syntax tree.
- `plugin`: a function that can operate on the `hast` tree.
- `sanitizeSchema`: all document content is HTML-sanitized by default but a sanitize schema can define custom sanitization rules.
- `searchAlgorithm`: a function that takes a string query and configurable option, and returns search results while searching across a document's `text` content.
- `searchResult`: a search result should include offsets to indicate where it occurs in a document's `text` content.
- `searchResultSnippet`: a search result snippet is a search result but contains preceding and postceding text that occurs around the matched search value.
- `string`: a document's `string` value is a representation of its source content in string form.
- `text`: a document's `text` value is a representation of all the `textContent` value of text nodes in its compiled form.  The `text` value is devoid of metadata or markup and represents the meaningful data within a document that would be read by consumers.  This value is used by `annotation`- and `search`-based APIs.
- `vfile`: a lightweight data structure that represents a document as a virtual file.

<!-- Links -->
[hast]: https://github.com/syntax-tree/hast
[react]: https://github.com/facebook/react
