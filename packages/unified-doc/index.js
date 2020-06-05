import searchRegexp from 'unified-doc-search-regexp';
import _vfile from 'vfile';

import { vFile2File } from './lib/file';
import { createProcessor } from './lib/processor';
import { getNodes, serializeResult } from './lib/search';

export default function unifiedDoc(options = {}) {
  const {
    compiler,
    content,
    filename = 'file',
    plugins = [],
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

  function compile() {
    return processor.processSync(vfile);
  }

  function file(extensionType) {
    return vFile2File(vfile, parse(), extensionType);
  }

  function parse() {
    return processor.runSync(processor.parse(vfile));
  }

  function search(algorithm = searchRegexp, options = {}) {
    const textOffsets = algorithm(text(), options);
    const nodes = textOffsets.reduce((acc, textOffset) => {
      return [...acc, ...getNodes(textOffset)];
    }, []);
    return serializeResult(nodes);
  }

  function text() {
    return vfile.toString();
  }

  return {
    compile,
    file,
    parse,
    search,
    text,
  };
}
