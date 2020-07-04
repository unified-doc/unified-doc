import searchMicromatch from 'unified-doc-search-micromatch';
import vfile from 'vfile';

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

  const file = vfile({
    contents: content,
    basename: filename,
  });

  const processor = createProcessor({
    annotations,
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
      extension,
      file,
      hast: parse(),
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
    file: _file,
    parse,
    search,
    textContent,
  };
}
