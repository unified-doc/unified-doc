import { createVfile, toFile } from './lib/vfile';
import { createProcessor } from './lib/processor';

export default async function unifiedDoc(options = {}) {
  const {
    compiler,
    content,
    plugins = [],
    filename = 'file',
    sanitizeSchema = {},
  } = options;
  const vfile = await createVfile({
    content,
    filename,
  });
  const processor = createProcessor({
    compiler,
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

  function file(extensionType) {
    return !extensionType && content instanceof File
      ? content
      : toFile(vfile, parse(), extensionType);
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
    file,
    parse,
    search,
    text,
  };
}
