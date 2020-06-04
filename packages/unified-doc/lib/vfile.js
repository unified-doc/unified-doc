import toHtml from 'hast-util-to-html';
import mime from 'mime-types';

import { extensionTypes, mimeTypes } from './enums';

export function inferMimeType(filename) {
  return mime.lookup(filename) || mimeTypes.DEFAULT;
}

export function toFile(vfile, hast, extensionType) {
  let content;
  let extension;
  let type;

  switch (extensionType) {
    case extensionTypes.UNI: {
      content = JSON.stringify({ hast }, null, 2);
      extension = extensionTypes.UNI;
      type = mimeTypes.UNI;
      break;
    }
    case extensionTypes.HTML: {
      content = toHtml(hast);
      extension = extensionTypes.HTML;
      type = mimeTypes.HTML;
      break;
    }
    case extensionTypes.TEXT: {
      content = vfile.toString();
      extension = extensionTypes.TEXT;
      type = mimeTypes.TEXT;
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
