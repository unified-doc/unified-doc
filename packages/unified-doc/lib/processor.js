import deepmerge from 'deepmerge';
import sanitize from 'hast-util-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import html from 'rehype-parse';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import text from 'unified-doc-parse-text';

import { readFileContent } from './file';

const createPlugin = (transform) => (...args) => (tree) =>
  transform(tree, ...args);

export function createProcessor(file, options = {}) {
  const { sanitizeSchema = {} } = options;

  const processor = unified();
  // Assign parsers with relevant mime-types
  if (file.type.includes('markdown')) {
    processor.use(markdown).use(remark2rehype);
  } else if (file.type.includes('html')) {
    processor.use(html);
  } else {
    processor.use(text);
  }

  processor.use(createPlugin(sanitize), deepmerge(gh, sanitizeSchema));

  async function parse() {
    const content = await readFileContent(file);
    return processor.parse(content);
  }

  function process() {
    return processor.processSync(file);
  }

  return {
    parse,
    process,
  };
}
