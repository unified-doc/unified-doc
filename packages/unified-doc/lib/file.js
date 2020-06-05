import toHtml from 'hast-util-to-html';
import toText from 'hast-util-to-text';
import mime from 'mime-types';

import { extensionTypes, mimeTypes } from './enums';

export function inferMimeType(filename) {
  return mime.lookup(filename) || mimeTypes.DEFAULT;
}

export function vFile2File(vfile, hast, extensionType) {
  let content;
  let extension;
  let type;

  switch (extensionType) {
    case extensionTypes.HTML: {
      content = toHtml(hast);
      extension = extensionType;
      type = inferMimeType(extensionType);
      break;
    }
    case extensionTypes.TEXT: {
      content = toText(hast);
      extension = extensionType;
      type = inferMimeType(extensionType);
      break;
    }
    case extensionTypes.UNI: {
      content = JSON.stringify({ hast }, null, 2);
      extension = extensionTypes.UNI;
      type = mimeTypes.UNI;
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
