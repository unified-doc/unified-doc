import deepmerge from 'deepmerge';
import sanitize from 'hast-util-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import mime from 'mime-types';
import html from 'rehype-parse';
import stringify from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import text from 'unified-doc-parse-text';
import textOffsets from 'unified-doc-util-text-offsets';

import { inferMimeType } from './file';

const createPlugin = (transform) => (...args) => (tree) =>
  transform(tree, ...args);

export function createProcessor(options = {}) {
  const {
    compiler = stringify,
    plugins = [],
    sanitizeSchema = {},
    vfile,
  } = options;

  // create unified processor and apply parser by infering mime type
  const processor = unified();
  const mimeType = inferMimeType(vfile.basename);
  const defaultExtension = mime.extension(mimeType);
  switch (defaultExtension) {
    case 'html':
      processor.use(html);
      break;
    case 'markdown':
      processor.use(markdown).use(remark2rehype);
      break;
    default:
      processor.use(text);
  }

  // apply provided rehype plugins
  plugins.forEach((plugin) => {
    if (Array.isArray(plugin)) {
      // @ts-ignore TODO: check best practices for applying plugin+options dynamically
      processor.use(...plugin);
    } else {
      processor.use(plugin);
    }
  });

  // apply private plugins
  processor.use(createPlugin(textOffsets));

  // sanitize the tree
  processor.use(createPlugin(sanitize), deepmerge(gh, sanitizeSchema));

  // apply provided compiler
  if (Array.isArray(compiler)) {
    // @ts-ignore TODO: check best practices for applying plugin+options dynamically
    processor.use(...compiler);
  } else {
    processor.use(compiler);
  }

  return processor;
}
