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
// vFile 

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

export type SearchAlgorithm = (
  content: string,
  query: string,
  options?: Record<string, any>,
) => SearchResult[];

interface SearchResultSnippet extends SearchResult {
  snippet: [string, string, string];
}
```

##### `annotations`
Document annotations inform how text nodes should be annotated based on the text offsets and properties of the provided annotations.

##### `annotationCallbacks`
Apply annotation callbacks to annotated text nodes.

##### `compiler`
Provide a valid [rehype][rehype] compiler (e.g. `rehype-react`, `rehype-stringify`) to compile the content.

##### `content`
The document content can be provided as a simple `string` or a `Buffer`.

##### `filename`
The document filename should always include the file extension (e.g. `.md`), which determines how content is parsed.

##### `plugins`
Valid [rehype][rehype] plugins can be provided to further customize the document.

##### `sanitizeSchema`
Customize how the document is sanitized with a custom sanitize schema.

##### `searchAlgorithm`
Customize the underlying search algorithm used to search the document.  By default, a simple regex search algorithm is used.

##### `searchOptions`
Provide search options to configure the associated search algorithm.

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

export interface FileData {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}
```

##### `doc.compile(): VFile`
Compiles and returns a `VFile` with compiled `content`/`result` depending on the compiler provided.

##### `doc.file(extension?: string): FileData`
From the source document, we can easily return file data of various supported formats by specifying the target extension type (e.g. `.html`, `.txt`).  If the extension is not provided, the source file is returned.

##### `doc.parse(): Hast`
Returns the [hast][hast] tree representation of the document content.

##### `doc.search(query: string, options?: Record<string, any>): SearchResultSnippet[]`
Performs a search on the document's `text` content against a provided `query` and returns `SearchResultSnippet`.  A custom `searchAlgorithm` with `searchOptions` can be provided during initialization.

##### `doc.string(): string`
Returns the string content of the source document content.

##### `doc.text(): string`
Returns the equivalent of `textContent` of the document, stripping away any markup and metadata.  This text value is used in relationship with search and annotation features in `unified-doc`.


<!-- Links -->
[rehype]: https://github.com/rehypejs/rehype
[hast]: https://github.com/syntax-tree/hast
