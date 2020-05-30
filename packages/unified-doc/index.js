import toHtml from 'hast-util-to-html';

import { fileTypes, mimeTypes } from './lib/enums';
import { toFile, toVfile } from './lib/vfile';
import { createProcessor } from './lib/processor';

export { fileTypes };

export default async function unifiedDoc(options = {}) {
  const { compiler, content, filename, file } = options;
  const vfile = await toVfile({
    content,
    file,
    filename,
  });
  const processor = createProcessor({
    compiler,
    vfile,
  });

  // TODO: implement
  function annotate(_annotations) {
    return [];
  }

  function _export(fileType) {
    switch (fileType) {
      case fileTypes.UNI: {
        const uniContent = { hast: parse() };
        return new File(
          [JSON.stringify(uniContent, null, 2)],
          `${vfile.stem}.${fileTypes.UNI}`,
          { type: mimeTypes.UNI },
        );
      }
      case fileTypes.HTML: {
        const htmlContent = toHtml(parse());
        return new File([htmlContent], `${vfile.stem}.${fileTypes.HTML}`, {
          type: mimeTypes.HTML,
        });
      }
      default:
        return toFile(vfile);
    }
  }

  function parse() {
    return processor.parse(vfile);
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
    export: _export,
    parse,
    search,
    text,
  };
}
