import { createVfile, toFile } from './lib/vfile';
import { createProcessor } from './lib/processor';

export default async function unifiedDoc({
  compiler,
  content,
  plugins = [],
  filename = 'file',
  file,
  sanitizeSchema = {},
}) {
  const vfile = await createVfile({
    content,
    file,
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
