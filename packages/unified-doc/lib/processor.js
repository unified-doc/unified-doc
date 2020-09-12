import deepmerge from 'deepmerge';
import sanitize from 'hast-util-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import html from 'rehype-parse';
import stringify from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import codeBlock from 'unified-doc-parse-code-block';
import csv from 'unified-doc-parse-csv';
import mark from 'unified-doc-util-mark';

import { mimeTypes } from './enums';
import { inferMimeType } from './file';
import { toText } from './hast';

const supportedParsers = {
  [mimeTypes.CSV]: [csv],
  [mimeTypes.HTML]: [html],
  [mimeTypes.MARKDOWN]: [markdown, remark2rehype],
};

const pluginfy = (transform) => (...args) => (tree) => transform(tree, ...args);

function extractTextContent(hast, file) {
  file.data.textContent = toText(hast);
}

export function createProcessor(options = {}) {
  const {
    compiler = stringify,
    marks = [],
    parsers = supportedParsers,
    postPlugins = [],
    prePlugins = [],
    sanitizeSchema,
    vfile,
  } = options;

  const mergedParsers = {
    ...supportedParsers,
    ...parsers,
  };

  const defaultParser = [[codeBlock, { language: vfile.extname.slice(1) }]];

  // create unified processor and apply a corresponding inferred parser
  const processor = unified();
  const mimeType = inferMimeType(vfile.basename);
  const parser = mergedParsers[mimeType] || defaultParser;
  processor.use(parser);

  // apply prePlugins -> private plugins -> post plugins
  processor.use(prePlugins);
  processor.use(pluginfy(mark), marks);
  processor.use(() => extractTextContent);
  processor.use(postPlugins);

  // sanitize the tree after all plugins
  if (sanitizeSchema) {
    processor.use(pluginfy(sanitize), deepmerge(gh, sanitizeSchema));
  }

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
