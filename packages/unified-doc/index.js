import toString from 'hast-util-to-string';
import searchRegexp from 'unified-doc-search-regexp';
import _vfile from 'vfile';

import { vFile2File } from './lib/file';
import { createProcessor } from './lib/processor';

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
    return searchAlgorithm(text(), query, options);
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
