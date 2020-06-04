import _vfile from 'vfile';

import utilAnnotate from 'unified-doc-util-annotate';
import utilSearch from 'unified-doc-util-search';

import { toFile } from './lib/vfile';
import { createProcessor } from './lib/processor';

export default function unifiedDoc(options = {}) {
  const {
    compiler,
    content,
    plugins = [],
    filename = 'file',
    sanitizeSchema = {},
  } = options;
  const vfile = _vfile({
    contents: content,
    basename: filename,
  });
  const processor = createProcessor({
    compiler,
    plugins,
    sanitizeSchema,
    vfile,
  });

  // TODO: implement
  function annotate(annotations) {
    utilAnnotate(parse(), { annotations });
    return [];
  }

  function compile() {
    return processor.processSync(vfile);
  }

  function file(extensionType) {
    return !extensionType && content instanceof File
      ? content
      : toFile(vfile, parse(), extensionType);
  }

  function parse() {
    return processor.runSync(processor.parse(vfile));
  }

  // TODO: implement
  function search(query) {
    utilSearch(parse(), { query });
    return [];
  }

  function text() {
    return vfile.toString();
  }

  return {
    annotate,
    compile,
    file,
    parse,
    search,
    text,
  };
}
