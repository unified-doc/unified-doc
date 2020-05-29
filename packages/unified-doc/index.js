import toHtml from 'hast-util-to-html';

import { fileTypes, mimeTypes } from './lib/enums';
import { fromContent, getContent, updateExtension } from './lib/file';
import { createProcessor } from './lib/processor';

export { fileTypes };

export default async function unifiedDoc(args = {}) {
  const file = args.file || fromContent(args.content, args.filename);
  const content = args.content || (await getContent(file));
  const processor = createProcessor(file, args.compiler);

  // TODO: implement
  function annotate(_annotations) {
    return [];
  }

  function parse() {
    return processor.parse(content);
  }

  function exportFile(fileType) {
    switch (fileType) {
      case fileTypes.UNI: {
        const uniContent = { hast: parse() };
        return new File(
          [JSON.stringify(uniContent, null, 2)],
          updateExtension(this.file.name, fileTypes.UNI),
          { type: mimeTypes.UNI },
        );
      }
      case fileTypes.HTML: {
        const htmlContent = toHtml(parse());
        return new File(
          [htmlContent],
          updateExtension(this.file.name, fileTypes.HTML),
          { type: mimeTypes.HTML },
        );
      }
      default:
        return this.file;
    }
  }

  // TODO: implement
  function search(_query) {
    return [];
  }

  return {
    annotate,
    content,
    exportFile,
    file,
    parse,
    search,
  };
}
