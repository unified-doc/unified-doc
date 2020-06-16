import searchRegexp from 'unified-doc-search-regexp';
import vfile from 'vfile';

import { getFileData } from './file';
import { createProcessor } from './processor';
import { getSnippets } from './search';

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

  const file = vfile({
    contents: content,
    basename: filename,
  });

  const processor = createProcessor({
    annotations,
    annotationCallbacks,
    compiler,
    file,
    plugins,
    sanitizeSchema,
  });

  function compile() {
    return processor.compile();
  }

  function _file(extension) {
    return getFileData({
      annotations,
      extension,
      file,
      hast: parse(),
    });
  }

  function parse() {
    return processor.parse();
  }

  function search(query, options = {}) {
    const textContent = text();
    const searchResults = searchAlgorithm(textContent, query, options);
    return getSnippets(textContent, searchResults, searchOptions);
  }

  function string() {
    return processor.string();
  }

  function text() {
    return processor.text();
  }

  return {
    compile,
    file: _file,
    parse,
    search,
    string,
    text,
  };
}
