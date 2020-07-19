import toHtml from 'hast-util-to-html';
import toString from 'hast-util-to-string';
import mime from 'mime-types';

import { extensionTypes, mimeTypes } from './enums';

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
  let type;

  switch (extensionType) {
    case extensionTypes.HTML: {
      content = toHtml(hast);
      type = inferMimeType(extension);
      break;
    }
    case extensionTypes.TEXT: {
      content = toString(hast);
      type = inferMimeType(extension);
      break;
    }
    default: {
      content = vfile.contents;
      extension = vfile.extname;
      type = inferMimeType(vfile.basename);
    }
  }

  return {
    content,
    extension,
    name: `${vfile.stem}${extension}`,
    stem: vfile.stem,
    type,
  };
}
