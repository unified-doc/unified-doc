import deepmerge from 'deepmerge';
import sanitize from 'hast-util-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import html from 'rehype-parse';
import stringify from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import text from 'unified-doc-parse-text';

import { inferMimeType } from './vfile';

const createPlugin = (transform) => (...args) => (tree) =>
  transform(tree, ...args);

export function createProcessor({
  compiler = stringify,
  plugins = [],
  sanitizeSchema = {},
  vfile,
}) {
  const processor = unified();
  const mimeType = inferMimeType(vfile.basename);
  if (mimeType.includes('markdown')) {
    processor.use(markdown).use(remark2rehype);
  } else if (mimeType.includes('html')) {
    processor.use(html);
  } else {
    processor.use(text);
  }

  processor.use(createPlugin(sanitize), deepmerge(gh, sanitizeSchema));

  plugins.forEach((plugin) => {
    if (Array.isArray(plugin)) {
      // @ts-ignore TODO: confirm best practices for supporting array-based plugin+option
      processor.use(...plugin);
    } else {
      processor.use(plugin);
    }
  });

  if (Array.isArray(compiler)) {
    // @ts-ignore TODO: confirm best practices for supporting array-based plugin+option
    processor.use(...compiler);
  } else {
    processor.use(compiler);
  }

  return processor;
}
