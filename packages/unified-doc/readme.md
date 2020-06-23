# unified-doc

unified document APIs.

## Install
```sh
npm install unified-doc
```

## Use

```js
import unifiedDoc from 'unified-doc';

const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

console.log(doc.file());
// {
  // content: '> **some** markdown content',
  // extension: '.md',
  // name: 'doc.md',
  // stem: 'doc',
  // type: 'text/markdown',
// }

console.log(doc.file('.html'));
// {
  // content: '<blockquote><strong>some</strong>markdown content</blockquote>',
  // extension: '.html',
  // name: 'doc.html',
  // stem: 'doc',
  // type: 'text/html',
// }

console.log(doc.compile());
// vfile 

console.log(doc.parse());
// hast tree

console.log(doc.search('nt'));
// [
  // { start: 14, end: 16, value: 'nt', snippet: ['', 'nt', ''] },
  // { start: 17, end: 19, value: 'nt', snippet: ['', 'nt', ''] },
// ]

console.log(doc.text());
// 'some markdown content'
```

See the **API** section for more details on other configurable options and features.

## API

```ts
function unifiedDoc(options: Options): Doc;
```

### Interfaces

#### Options

Provide configurable options to initialize a `doc` instance.

```ts
interface Options {
  content: string;
  filename: string;
  annotations?: Annotation[];
  annotationCallbacks?: AnnotationCallbacks;
  compiler?: Compiler;
  plugins?: Plugin | Plugin[];
  sanitizeSchema?: SanitizeSchema;
  searchAlgorithm?: SearchAlgorithm;
  searchOptions?: SearchOptions;
}

type SearchAlgorithm = (
  content: string,
  query: string,
  options?: Record<string, any>,
) => SearchResult[];

interface SearchOptions {
  minQueryLength?: number;
  snippetOffsetPadding?: number;
}

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

##### `options.annotations`
Document annotations inform how text nodes should be marked based on the provided annotation data (e.g. text offsets, classnames, style).

##### `options.annotationCallbacks`
Specify annotation callbacks for annotated text nodes.

##### `options.compiler`
Provide a valid [rehype][rehype] compiler (e.g. `rehype-react`, `rehype-stringify`) to compile the content.

##### `options.content`
The document content is provided as a string.

##### `options.filename`
The document filename should always include the file extension (e.g. `.md`), which will determine how the content is parsed.

##### `options.plugins`
Valid [rehype][rehype] plugins can be provided to further customize the document.

##### `options.sanitizeSchema`
Specify how the document is sanitized with a custom sanitize schema.

##### `options.searchAlgorithm`
Provide the underlying search algorithm used to search the document.  A simple regex search algorithm is used by default.  Search algorithms operate by returning search results (with offsets) for a given `query` when searching against a document's `text` content.

##### `options.searchOptions`
Provide configurable search options for the associated search algorithm (e.g. `minQueryLength`, `snippetOffsetPadding`).

#### Doc Instance

A `doc` instance exposes many unified APIs when working with documents.

```ts
 interface Doc {
  compile: () => VFile;
  file: (extension?: string) => FileData;
  parse: () => Hast;
  search: (
    query: string,
    options?: Record<string, any>,
  ) => SearchResultSnippet[];
  text: () => string;
}

interface FileData {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}
```

We will use the following example `doc` instance to go over the API methods:

```js
const doc = unifiedDoc({
  content: '> **some** markdown content',
  filename: 'doc.md',
});

```

##### `doc.compile(): VFile`
Compiles and returns a `VFile` with compiled `content`/`result` based on the provided compiler.

##### `doc.file(extension?: string): FileData`
We can easily return file data in various formats by providing a supported extension (e.g. `.html`, `.txt`).  If an extension is not provided, the source file is returned.

The core supported file extensions and behaviors are:
- `null`: returns the source file without modification.
- `.html`: returns the compiled `html` contents in a `.html` file.
- `.txt`: returns only the `text` content in a `.txt` file.
- `.uni`: returns the `hast` content and other metadata in a `.uni` file.

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
console.log(doc.file('.txt')); // outputs txt file with only text content
// {
  // content: 'some markdown content',
  // extension: '.txt',
  // name: 'doc.txt',
  // stem: 'doc',
  // type: 'text/plain',
// }
```

##### `doc.parse(): Hast`
Returns the [hast][hast] tree representation of the document content.

```js
doc.parse();
// { type: 'root', children: [...] }
```

##### `doc.search(query: string, options?: Record<string, any>): SearchResultSnippet[]`
Searches on the `text` content of a `doc` when a `query` string and configurable `options` is provided.  Returns `SearchResultSnippet`.  This method supports a simple and robust way to search on a `doc` irregardless of its underlying `mimeType`. Custom `searchAlgorithm` with the same unified interface can be easily integrated,

```js
doc.search('some|content', { enableRegexp: true });
// [
  // { start: 0, end: 5, value: 'some', snippet: ['', 'some', '']},
  // { start: 14, end: 21, value: 'content', snippet: ['', 'content', '']},
// ]
```

##### `doc.text(): string`
The `text` content of a `doc` is obtained by extracting values of all `text` nodes in the `hast` representation of the source `content`.  The `text` content is free of markup and metadata, and supports many important `doc` features (annotations and searching).

```js
doc.text(); // 'some markdown content'
```

<!-- Links -->
[rehype]: https://github.com/rehypejs/rehype
[hast]: https://github.com/syntax-tree/hast
