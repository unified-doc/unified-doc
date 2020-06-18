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

console.log(doc.string());
// '> **some** markdown content'

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
  annotations?: Annotation[];
  annotationCallbacks?: AnnotationCallbacks;
  compiler?: Compiler;
  content?: string | Buffer;
  filename: string;
  plugins?: Plugin | Plugin[];
  sanitizeSchema?: SanitizeSchema;
  searchAlgorithm?: SearchAlgorithm;
  searchOptions?: Record<string, any>;
}

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

##### `options.annotations`
Document annotations inform how text nodes should be marked based on the provided annotation data (e.g. text offsets, classnames, style).

##### `options.annotationCallbacks`
Specify annotation callbacks for annotated text nodes.

##### `options.compiler`
Provide a valid [rehype][rehype] compiler (e.g. `rehype-react`, `rehype-stringify`) to compile the content.

##### `options.content`
The document content can be provided as a simple `string` or a `Buffer`.

##### `options.filename`
The document filename should always include the file extension (e.g. `.md`), which will determine how the content is parsed.

##### `options.plugins`
Valid [rehype][rehype] plugins can be provided to further customize the document.

##### `options.sanitizeSchema`
Specify how the document is sanitized with a custom sanitize schema.

##### `options.searchAlgorithm`
Provide the underlying search algorithm used to search the document.  A simple regex search algorithm is used by default.  Search algorithms operate by returning search results (with offsets) for a given `query` when searching against a document's `text` content.

##### `options.searchOptions`
Provide configurable search options for the associated search algorithm.

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
  string: () => string;
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

##### `doc.content`
Original contents passed to the `doc`.

##### `doc.filename`
Filename passed to the `doc`.

##### `doc.compile(): VFile`
Compiles and returns a `VFile` with compiled `content`/`result` based on the provided compiler.

##### `doc.file(extension?: string): FileData`
We can easily return file data in various formats by providing a supported extension (e.g. `.html`, `.txt`).  If an extension is not provided, the source file is returned.

```js
doc.file('.txt');
// {
//   content: '> **some** markdown content',
//   extension: '.txt',
//   name: 'doc.txt',
//   stem: 'doc',
//   type: 'text/plain',
// }

doc.file('.html')
// {
  // content: '<blockquote><strong>some</strong>markdown content</blockquote>',
  // extension: '.html',
  // name: 'doc.html',
  // stem: 'doc',
  // type: 'text/html',
// }
```

##### `doc.parse(): Hast`
Returns the [hast][hast] tree representation of the document content.

```js
doc.parse();
// { type: 'root', children: [...] }
```

##### `doc.search(query: string, options?: Record<string, any>): SearchResultSnippet[]`
Searches on the `doc`'s `text` content with a provided `query` and configurable options and returns `SearchResultSnippet`.  This method supports a simple but robust way to search the `doc` irregardless of its content type, and provides ways to integrate custom `searchAlgorithm` with the same interface as illustrated in the example below::

```js
doc.search('some|content', { enableRegexp: true });
// [
  // { start: 0, end: 5, value: 'some', snippet: ['', 'some', '']},
  // { start: 14, end: 21, value: 'content', snippet: ['', 'content', '']},
// ]
```

##### `doc.string(): string`
Returns the string representation of the source document content.

```js
doc.string(); // '> **some** markdown content'
```

##### `doc.text(): string`
Provides a very simple but important way to extract the `text` content from a `doc`.  This `text` content is usually human-readable content that is free of metadata and markup, and is obtained from the values of all text nodes in the `hast` representation of the `content`.  This `text` content is used with various features in `unified-doc` such as `annotations` and `search`

```js
doc.text(); // 'some markdown content'
```

<!-- Links -->
[rehype]: https://github.com/rehypejs/rehype
[hast]: https://github.com/syntax-tree/hast
