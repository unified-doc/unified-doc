import toString from 'hast-util-to-string';
import searchRegexp from 'unified-doc-search-regexp';
import _vfile from 'vfile';

import { vFile2File } from './lib/file';
import { createProcessor } from './lib/processor';
import { getSnippets } from './lib/search';

export default function unifiedDoc(options = {}) {
  const {
    annotations = [],
    annotationCallbacks = {},
    compiler,
    content,
    filename = 'file',
    plugins = [],
    sanitizeSchema = {},
    searchAlgorithm = searchRegexp,
    searchOptions = {},
  } = options;

  const vfile = _vfile({
    contents: content,
    basename: filename,
  });

  const processor = createProcessor({
    annotations,
    annotationCallbacks,
    compiler,
    plugins,
    sanitizeSchema,
    vfile,
  });

  function compile() {
    return processor.processSync(vfile);
  }

  function file(extension) {
    return vFile2File({
      annotations,
      extension,
      hast: parse(),
      vfile,
    });
  }

  function parse() {
    return processor.runSync(processor.parse(vfile));
  }

  function search(query, options = {}) {
    const textContent = text();
    const searchResults = searchAlgorithm(textContent, query, options);
    return getSnippets(textContent, searchResults, searchOptions);
  }

  function string() {
    return vfile.toString();
  }

  function text() {
    return toString(parse());
  }

  return {
    compile,
    file,
    parse,
    search,
    string,
    text,
  };
}
