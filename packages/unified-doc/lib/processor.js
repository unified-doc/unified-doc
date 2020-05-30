import deepmerge from 'deepmerge';
import sanitize from 'hast-util-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import html from 'rehype-parse';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import text from 'unified-doc-parse-text';

import { inferMimeType } from './vfile';

const createPlugin = (transform) => (...args) => (tree) =>
  transform(tree, ...args);

export function createProcessor(options = {}) {
  const { compiler, sanitizeSchema = {}, vfile } = options;
  const mimeType = inferMimeType(vfile);

  const processor = unified();
  if (mimeType.includes('markdown')) {
    processor.use(markdown).use(remark2rehype);
  } else if (mimeType.includes('html')) {
    processor.use(html);
  } else {
    processor.use(text);
  }

  processor.use(createPlugin(sanitize), deepmerge(gh, sanitizeSchema));
  processor.use(compiler);

  return processor;
}
