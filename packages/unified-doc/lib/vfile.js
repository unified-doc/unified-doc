import toHtml from 'hast-util-to-html';
import mime from 'mime-types';
import _vfile from 'vfile';

import { extensionTypes, mimeTypes } from './enums';

export async function createVfile({
  content = null,
  file = null,
  filename = null,
}) {
  const basename = file ? file.name : filename;
  const contents = file ? Buffer.from(await file.arrayBuffer()) : content;
  return _vfile({ basename, contents });
}

export function inferMimeType(filename) {
  return mime.lookup(filename) || mimeTypes.DEFAULT;
}

export function toFile(vfile, hast, extensionType) {
  let content;
  let extension;
  let mimeType;

  switch (extensionType) {
    case extensionTypes.UNI: {
      content = JSON.stringify({ hast }, null, 2);
      extension = extensionTypes.UNI;
      mimeType = mimeTypes.UNI;
      break;
    }
    case extensionTypes.HTML: {
      content = toHtml(hast);
      extension = extensionTypes.HTML;
      mimeType = mimeTypes.HTML;
      break;
    }
    case extensionTypes.TEXT: {
      content = vfile.toString();
      extension = extensionTypes.TEXT;
      mimeType = mimeTypes.TEXT;
      break;
    }
    default: {
      content = vfile.contents;
      extension = vfile.extname;
      mimeType = inferMimeType(vfile.basename);
    }
  }

  const filename = `${vfile.stem}${extension}`;

  return new File([content], filename, { type: mimeType });
}
