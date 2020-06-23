import deepmerge from 'deepmerge';
import sanitize from 'hast-util-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import toString from 'hast-util-to-string';
import mime from 'mime-types';
import html from 'rehype-parse';
import stringify from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import text from 'unified-doc-parse-text';
import annotate from 'unified-doc-util-annotate';

import { inferMimeType } from './file';

const pluginfy = (transform) => (...args) => (tree) => transform(tree, ...args);

function extractText(hast, file) {
  file.data.text = toString(hast);
}

export function createProcessor(options = {}) {
  const {
    annotations = [],
    annotationCallbacks = {},
    compiler = stringify,
    file,
    plugins = [],
    sanitizeSchema = {},
  } = options;

  // create unified processor and apply parser by infering mime type
  const processor = unified();
  const mimeType = inferMimeType(file.basename);
  const defaultExtension = mime.extension(mimeType);
  switch (defaultExtension) {
    case 'html':
      processor.use(html);
      break;
    case 'markdown':
      processor.use(markdown).use(remark2rehype);
      break;
    case 'txt':
    default:
      processor.use(text);
  }

  // sanitize the tree
  processor.use(pluginfy(sanitize), deepmerge(gh, sanitizeSchema));

  // apply private plugins (order matters)
  processor.use(pluginfy(annotate), { annotations, annotationCallbacks });
  processor.use(() => extractText);

  // apply public plugins
  plugins.forEach((plugin) => {
    if (Array.isArray(plugin)) {
      // @ts-ignore TODO: check best practices for applying plugin+options dynamically
      processor.use(...plugin);
    } else {
      processor.use(plugin);
    }
  });

  // apply compiler
  if (Array.isArray(compiler)) {
    // @ts-ignore TODO: check best practices for applying plugin+options dynamically
    processor.use(...compiler);
  } else {
    processor.use(compiler);
  }

  return {
    compile: () => processor.processSync(file),
    parse: () => processor.runSync(processor.parse(file)),
    text: () => {
      if (!file.data.text) {
        processor.processSync(file);
      }
      return file.data.text;
    },
  };
}
