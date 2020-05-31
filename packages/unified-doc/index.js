import { extensionTypes } from './lib/enums';
import { createVfile, toFile } from './lib/vfile';
import { createProcessor } from './lib/processor';

export { extensionTypes };

export default async function unifiedDoc(options = {}) {
  const {
    compiler,
    compilerOptions,
    content,
    plugins = [],
    filename = 'file',
    file,
    sanitizeSchema = {},
  } = options;
  const vfile = await createVfile({
    compiler,
    content,
    file,
    filename,
  });
  const processor = createProcessor({
    compiler,
    compilerOptions,
    plugins,
    sanitizeSchema,
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
