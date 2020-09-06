import toHtml from 'hast-util-to-html';
import mime from 'mime-types';

import { extensionTypes, mimeTypes } from './enums';
import { toText } from './hast';

export function inferMimeType(filename) {
  return mime.lookup(filename) || mimeTypes.TEXT;
}

export function getFileData({
  extension: extensionType = null,
  hast = null,
  vfile,
}) {
  let content;
  let extension = extensionType;

  switch (extensionType) {
    case extensionTypes.HTML: {
      content = toHtml(hast);
      break;
    }
    case extensionTypes.TEXT: {
      content = toText(hast);
      break;
    }
    default: {
      content = vfile.contents;
      extension = vfile.extname;
    }
  }

  return {
    content,
    extension,
    name: `${vfile.stem}${extension}`,
    stem: vfile.stem,
    type: inferMimeType(extension),
  };
}
