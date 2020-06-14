import toHtml from 'hast-util-to-html';
import toString from 'hast-util-to-string';
import mime from 'mime-types';

import { extensionTypes, mimeTypes } from './enums';

export function inferMimeType(filename) {
  return mime.lookup(filename) || mimeTypes.DEFAULT;
}

export function getFileData({
  annotations = [],
  file,
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
    // TODO: formalize and abstract this into a package (i.e. awkward to pass annotations to this method)
    case extensionTypes.UNI: {
      content = JSON.stringify(
        { annotations, basename: file.basename, hast },
        null,
        2,
      );
      extension = extensionTypes.UNI;
      type = mimeTypes.UNI;
      break;
    }
    default: {
      content = file.contents;
      extension = file.extname;
      type = inferMimeType(file.basename);
    }
  }

  return {
    content,
    extension,
    name: `${file.stem}${extension}`,
    stem: file.stem,
    type,
  };
}
