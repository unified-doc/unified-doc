import stringify from 'rehype-stringify';

import { extensionTypes } from './lib/enums';
import { toFile, toVfile } from './lib/vfile';
import { createProcessor } from './lib/processor';

export { extensionTypes };

export default async function unifiedDoc(options = {}) {
  const {
    compiler = stringify,
    compilerOptions,
    content,
    filename = 'file',
    file,
  } = options;
  const vfile = await toVfile({
    compiler,
    content,
    file,
    filename,
  });
  const processor = createProcessor({
    compiler,
    compilerOptions,
    vfile,
  });

  // TODO: implement
  function annotate(_annotations) {
    return [];
  }

  function compile() {
    return processor.processSync(vfile);
  }

  function _export(extensionType) {
    const hast = parse();
    return toFile(vfile, hast, extensionType);
  }

  function parse() {
    return processor.runSync(processor.parse(vfile));
  }

  // TODO: implement
  function search(_query) {
    return [];
  }

  function text() {
    return vfile.toString();
  }

  return {
    // attributes
    extname: vfile.extname,
    filename: vfile.basename,
    stem: vfile.stem,
    // methods
    annotate,
    compile,
    export: _export,
    parse,
    search,
    text,
  };
}
