# unified-doc-parse-code-block

[**unified-doc**][unified-doc] parser to parse content into a [hast][hast] tree with a single code block node i.e.  `<pre><code>{content}</code></pre>`.

## Install

```sh
npm install unified-doc-parse-code-block
```

## Use

```js
import codeBlock from "unified-doc-parse-code-block";
import unified from "unified";

const content = `
var hello = "hi";

var world = "earth";
`

const processor = unified()
  .use(codeBlock, { language: 'js' });

expect(processor.parse(content)).toEqual({
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'pre',
      position: {
        start: {
          column: 1,
          line: 1,
          offset: 0,
        },
        end: {
          column: 1,
          line: 5,
          offset: 41,
        },
      },
      properties: {
        className: 'language-js',
      },
      children: [
        {
          type: 'element',
          tagName: 'code',
          position: {
            start: {
              column: 1,
              line: 1,
              offset: 0,
            },
            end: {
              column: 1,
              line: 5,
              offset: 41,
            },
          },
          properties: {
            className: 'language-js',
          },
          children: [
            {
              type: 'text',
              value: '\nvar hello = "hi";\n\nvar world = "earth";\n',
              position: {
                start: {
                  column: 1,
                  line: 1,
                  offset: 0,
                },
                end: {
                  column: 1,
                  line: 5,
                  offset: 41,
                },
              },
            },
          ],
        },
      ],
    },
  ],
  position: {
    start: {
      column: 1,
      line: 1,
      offset: 0,
    },
    end: {
      column: 1,
      line: 5,
      offset: 41,
    },
  },
});
```

## API

### `unified().use(content[, options])`

`hast` parser to parse content into a single code block node i.e. `<pre><code>{content}</code></pre>`.

Use the parser with any unified processor. Note that this plugin can be conveniently used with various [rehype][] syntax highlighting plugins (e.g [`rehype-higlight`][rehype-highlight] or [`rehype-prism`][rehype-prism]) to further tokenize code block content for highlighting using stylesheets in the corresponding ecosystems.

#### Example

```js
import highlight from 'rehype-highlight';
import codeBlock from "unified-doc-parse-code-block";
import unified from "unified";

const content = `
var hello = "hi";

var world = "earth";
`

unified()
  .use(codeBlock, { language: 'js' })
  .use(highlight);

// apply relevant highlight.js to the rendered content
```

#### `options`

```ts
interface Options {
  /** code language attached as a semantic className on the <code /> node */
  language?: string;
}
```

When the `language` option is provided, attach the equivalent `language` to the CSS class name of the `pre` and `code` nodes.  Note that this is recommended by the [HTML 5 spec][code-element] to semantically inform the language of the computer code that is being marked up.  It is also used as an identifier for syntax highlighting libraries (e.g. [`highlight.js`][highlightjs] or [`prism.js`][prismjs]) to highlight code content.


<!-- Definitions -->
[code-element]: https://www.w3.org/TR/html52/textlevel-semantics.html#the-code-element
[hast]: https://github.com/syntax-tree/hast
[highlightjs]: https://github.com/highlightjs/highlight.js
[prismjs]: https://github.com/PrismJS/prism
[rehype]: https://github.com/rehypejs/rehype
[rehype-highlight]: https://github.com/rehypejs/rehype-highlight
[rehype-prism]: https://github.com/mapbox/rehype-prism
[unified-doc]: https://github.com/unified-doc/unified-doc
