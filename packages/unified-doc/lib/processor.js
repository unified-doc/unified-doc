import deepmerge from 'deepmerge';
import sanitize from 'hast-util-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import toString from 'hast-util-to-string';
import html from 'rehype-parse';
import stringify from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import text from 'unified-doc-parse-text';
import annotate from 'unified-doc-util-annotate';

import { mimeTypes } from './enums';
import { inferMimeType } from './file';

const defaultParsers = {
  [mimeTypes.HTML]: [html],
  [mimeTypes.MARKDOWN]: [markdown, remark2rehype],
  [mimeTypes.TEXT]: [text],
};

const pluginfy = (transform) => (...args) => (tree) => transform(tree, ...args);

function extractTextContent(hast, file) {
  file.data.textContent = toString(hast);
}

export function createProcessor(options = {}) {
  const {
    annotations = [],
    compiler = stringify,
    parsers = defaultParsers,
    plugins = [],
    sanitizeSchema,
    vfile,
  } = options;

  // create unified processor and apply parser against inferred mime type
  const processor = unified();
  const mergedParsers = {
    ...defaultParsers,
    ...parsers,
  };
  const mimeType = inferMimeType(vfile.basename);
  const parser = mergedParsers[mimeType] || mergedParsers[mimeTypes.TEXT];
  processor.use(parser);

  // sanitize the tree
  if (sanitizeSchema) {
    processor.use(pluginfy(sanitize), deepmerge(gh, sanitizeSchema));
  }

  // apply private plugins -> public plugins -> compiler (order matters)
  processor.use(pluginfy(annotate), annotations);
  processor.use(() => extractTextContent);
  processor.use(plugins);
  processor.use(compiler);

  function compile() {
    return processor.processSync(vfile);
  }

  function parse() {
    return processor.runSync(processor.parse(vfile));
  }

  function textContent() {
    const hasProcessed = vfile.data.textContent;
    if (!hasProcessed) {
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
