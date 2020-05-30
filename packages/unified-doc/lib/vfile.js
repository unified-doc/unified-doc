import toHtml from 'hast-util-to-html';
import mime from 'mime-types';
import vfile from 'vfile';

import { extensionTypes, mimeTypes } from './enums';

export function inferMimeType(filename) {
  return mime.lookup(filename) || mimeTypes.DEFAULT;
}

export function toFile(vf, hast, extensionType) {
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
    default: {
      content = vf.contents;
      extension = vf.extname;
      mimeType = inferMimeType(vf.basename);
    }
  }

  const filename = `${vf.stem}${extension}`;

  return new File([content], filename, { type: mimeType });
}

export async function toVfile({ content, file, filename }) {
  const basename = file ? file.name : filename;
  const contents = file ? Buffer.from(await file.arrayBuffer()) : content;
  return vfile({ basename, contents });
}
