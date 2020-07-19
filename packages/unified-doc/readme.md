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

expect(doc.compile()).toBeInstanceOf(Vfile); // vfile instance

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

expect(doc.parse()).toEqual({ // hast tree
  type: 'root',
  children: [...],
})

expect(doc.search('nt')).toEqual([
  { start: 16, end: 18, value: 'nt', snippet: ['some markdown co', 'nt', 'ent'] },
  { start: 19, end: 21, value: 'nt', snippet: ['some markdown conte', 'nt', ''] },
])

expect(doc.textContent()).toEqual('some markdown content');
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
  compiler?: PluggableList;
  parsers?: Parsers;
  plugins?: PluggableList;
  sanitizeSchema?: SanitizeSchema | null;
  searchOptions?: SearchOptions;
  searchAlgorithm?: SearchAlgorithm;
}

interface Annotation {
  id: string;
  start: number;
  end: number;
  classNames?: string[];
  dataset?: Record<string, any>;
  data?: Record<string, any>;
  style?: Record<string, any>;
}

interface Parsers {
  [mimeType: string]: PluggableList,
}

type SanitizeSchema = Record<string, any>;

type SearchAlgorithm = (
  content: string,
  query: string,
  options?: Record<string, any>,
) => SearchResult[];

interface SearchResult {
  [key: string]: any;
  start: number;
  end: number;
  value: string;
  data?: Record<string, any>;
}

interface SearchOptions {
  minQueryLength?: number;
  snippetOffsetPadding?: number;
}

interface SearchResultSnippet extends SearchResult {
  snippet: [string, string, string];
}
```

##### `options.annotations`
Specify how `textContent` in a `doc` should be marked with annotation offsets and related data.

##### `options.compiler`
Provide a valid [rehype][rehype] compiler (e.g. `rehype-react`, `rehype-stringify`) to compile the content.  Apply the `compiler` using the `PluggableList` interface e.g. `[compiler]` or `[[compiler, compilerOptions]]`.

##### `options.content`
The document source content is provided as a string.

##### `options.filename`
The document filename should always include the file extension (e.g. `.md`), which will determine how the source content will be parsed with the corresponding parser.

##### `options.parsers`
Provide an object with mime types as keys and parsers as values.  Inferred mime type from the `filename` will use an associated parser.  If no parser is found, a default text parser will be used.  Parsers are applied using the `PluggableList` interface and can include multiple steps e.g. `[textParse]` or `[remarkParse, remark2rehype]`.

##### `options.plugins`
Valid [rehype][rehype] plugins can be provided to further customize the document.  Apply `plugins` using the `PluggableList` interface e.g. `[plugin1, [plugin2, plugin2Options]]`.

##### `options.sanitizeSchema`
Specify how the document is sanitized using a custom sanitize schema.

##### `options.searchAlgorithm`
Provide the underlying search algorithm used to search the document.  A default search algorithm based on [`micromatch`][micromatch] is used.  Search algorithms return search results (with offsets) for a given `query` when searching against a document's `textContent`.

##### `options.searchOptions`
Provide configurable search options for the any attached search algorithm (e.g. `minQueryLength`, `snippetOffsetPadding`).

#### `doc` Instance

A `doc` instance exposes the following unified document APIs:

```ts
interface Doc {
  compile: () => VFile;
  file: (extension?: string) => FileData;
  parse: () => Hast;
  search: (
    query: string,
    options?: Record<string, any>,
  ) => SearchResultSnippet[];
  textContent: () => string;
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
Easily return file data in for supported extensions (e.g. `.html`, `.txt`).  If an extension is not provided, the source file is returned.

The supported file extensions and behaviors are:
- `null`: returns the source file without modification.
- `.html`: returns the compiled `html` in a `.html` file.
- `.txt`: returns the `textContent` in a `.txt` file.

```js
const content = '> **some** markdown content';

expect(doc.file()).toEqual({ // outputs source file
  content: '> **some** markdown content',
  extension: '.md',
  name: 'doc.md',
  stem: 'doc',
  type: 'text/markdown',
})

expect(doc.file('.html')).toEqual({ // outputs html file
  content: '<blockquote><strong>some</strong>markdown content</blockquote>',
  extension: '.html',
  name: 'doc.html',
  stem: 'doc',
  type: 'text/html',
});

expect(doc.file('.txt')).toEqual({ // outputs txt file with only textContent
  content: 'some markdown content',
  extension: '.txt',
  name: 'doc.txt',
  stem: 'doc',
  type: 'text/plain',
});
```

##### `doc.parse(): Hast`
Returns the [hast][hast] tree representation of the document content.

```js
expect(doc.parse()).toEqual({
  type: 'root',
  children: [...],
});
```

##### `doc.search(query: string, options?: Record<string, any>): SearchResultSnippet[]`
Searches on the `textContent` of a `doc` with the provided `query` string.  Returns `SearchResultSnippet`.  Uses the attached search algorithm provided in `options.searchAlgorithm`.  Algorithm-specific options can be provided in the second parameter.

```js
expect(doc.search('some')).toEqual([
  { start: 0, end: 5, value: 'some', snippet: ['', 'some', 'markdown content']},
]);
```

##### `doc.textContent(): string`
The `textContent` of a `doc` is obtained by extracting values of all text nodes in the `hast` representation of the source `content`.  The `textContent` is free of markup and metadata, and supports many important `doc` features (annotations and searching).

```js
expect(doc.textContent()).toEqual('some markdown content');
```

<!-- Links -->
[micromatch]: https://github.com/micromatch/micromatch
[rehype]: https://github.com/rehypejs/rehype
[hast]: https://github.com/syntax-tree/hast
