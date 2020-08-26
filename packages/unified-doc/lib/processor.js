import deepmerge from 'deepmerge';
import sanitize from 'hast-util-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import toString from 'hast-util-to-string';
import html from 'rehype-parse';
import stringify from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import json from 'unified-doc-parse-json';
import text from 'unified-doc-parse-text';
import mark from 'unified-doc-util-mark';

import { mimeTypes } from './enums';
import { inferMimeType } from './file';

// TODO: support customizations of default parsers with parserOptions
const defaultParsers = {
  [mimeTypes.HTML]: [html],
  [mimeTypes.JSON]: [[json, { classNames: ['hljs', 'language-json'] }]],
  [mimeTypes.MARKDOWN]: [markdown, remark2rehype],
  [mimeTypes.TEXT]: [text],
};

const pluginfy = (transform) => (...args) => (tree) => transform(tree, ...args);

function extractTextContent(hast, file) {
  file.data.textContent = toString(hast);
}

export function createProcessor(options = {}) {
  const {
    compiler = stringify,
    marks = [],
    parsers = defaultParsers,
    postPlugins = [],
    prePlugins = [],
    sanitizeSchema,
    vfile,
  } = options;

  const mergedParsers = {
    ...defaultParsers,
    ...parsers,
  };

  // create unified processor and apply parser against inferred mime type
  const processor = unified();
  const mimeType = inferMimeType(vfile.basename);
  const parser = mergedParsers[mimeType] || mergedParsers[mimeTypes.TEXT];
  processor.use(parser);

  // sanitize the tree
  if (sanitizeSchema) {
    processor.use(pluginfy(sanitize), deepmerge(gh, sanitizeSchema));
  }

  // apply prePlugins -> private plugins -> post plugins -> compiler (order matters)
  processor.use(prePlugins);
  processor.use(pluginfy(mark), marks);
  processor.use(() => extractTextContent);
  processor.use(postPlugins);
  processor.use(compiler);

  function compile() {
    return processor.processSync(vfile);
  }

  function parse() {
    return processor.runSync(processor.parse(vfile));
  }

  function textContent() {
    if (!vfile.data.textContent) {
      compile();
    }
    return vfile.data.textContent;
  }

  return {
    compile,
    parse,
    textContent,
  };
}
