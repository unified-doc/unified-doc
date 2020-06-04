import deepmerge from 'deepmerge';
import gh from 'hast-util-sanitize/lib/github.json';
import mime from 'mime-types';
import html from 'rehype-parse';
import sanitize from 'rehype-sanitize';
import stringify from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import text from 'unified-doc-parse-text';

import { inferMimeType } from './file';

export function createProcessor(options = {}) {
  const {
    compiler = stringify,
    plugins = [],
    sanitizeSchema = {},
    vfile,
  } = options;

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

  processor.use(sanitize, deepmerge(gh, sanitizeSchema));

  plugins.forEach((plugin) => {
    if (Array.isArray(plugin)) {
      // @ts-ignore TODO: check best practices for applying plugin+options dynamically
      processor.use(...plugin);
    } else {
      processor.use(plugin);
    }
  });

  if (Array.isArray(compiler)) {
    // @ts-ignore TODO: check best practices for applying plugin+options dynamically
    processor.use(...compiler);
  } else {
    processor.use(compiler);
  }

  return processor;
}
