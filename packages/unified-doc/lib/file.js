import toHtml from 'hast-util-to-html';
import toString from 'hast-util-to-string';
import mime from 'mime-types';

import { extensionTypes, mimeTypes } from './enums';

export function inferMimeType(filename) {
  return mime.lookup(filename) || mimeTypes.DEFAULT;
}

export function vFile2File({
  annotations = [],
  vfile,
  hast = null,
  extension: extensionType = null,
}) {
  let content;
  let extension;
  let type;

  switch (extensionType) {
    case extensionTypes.HTML: {
      content = toHtml(hast);
      extension = extensionType;
      type = inferMimeType(extension);
      break;
    }
    case extensionTypes.TEXT: {
      content = toString(hast);
      extension = extensionType;
      type = inferMimeType(extension);
      break;
    }
    // TODO: formalize and abstract this into a package
    case extensionTypes.UNI: {
      content = JSON.stringify({ annotations, hast }, null, 2);
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
