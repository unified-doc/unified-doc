import searchMicromatch from 'unified-doc-search-micromatch';
import _vfile from 'vfile';

import { getFileData } from './file';
import { createProcessor } from './processor';
import { getSnippets } from './search';

export default function unifiedDoc(options = {}) {
  const {
    annotations = [],
    compiler,
    content,
    filename,
    plugins = [],
    sanitizeSchema = {},
    searchAlgorithm = searchMicromatch,
    searchOptions = {},
  } = options;

  const vfile = _vfile({
    contents: content,
    basename: filename,
  });

  const processor = createProcessor({
    annotations,
    compiler,
    plugins,
    sanitizeSchema,
    vfile,
  });

  function compile() {
    return processor.compile();
  }

  function file(extension) {
    return getFileData({
      extension,
      hast: parse(),
      vfile,
    });
  }

  function parse() {
    return processor.parse();
  }

  function search(query, options = {}) {
    const { minQueryLength = 1, snippetOffsetPadding = 100 } = searchOptions;

    if (query.length < minQueryLength) {
      return [];
    }

    const content = textContent();
    const searchResults = searchAlgorithm(content, query, options);
    return getSnippets({
      content,
      searchResults,
      snippetOffsetPadding,
    });
  }

  function textContent() {
    return processor.textContent();
  }

  return {
    compile,
    file,
    parse,
    search,
    textContent,
  };
}
