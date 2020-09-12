import toHtml from 'hast-util-to-html';
import toMdast from 'hast-util-to-mdast';
import toXast from 'hast-util-to-xast';
import toMarkdown from 'mdast-util-to-markdown';
import mime from 'mime-types';
import toXml from 'xast-util-to-xml';

import { extensionTypes } from './enums';
import { toText } from './hast';

export function inferMimeType(filename) {
  return mime.lookup(filename) || 'text/plain';
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
    case extensionTypes.MARKDOWN: {
      content = toMarkdown(toMdast(hast));
      break;
    }
    case extensionTypes.TEXT: {
      content = toText(hast);
      break;
    }
    case extensionTypes.XML: {
      content = toXml(toXast(hast));
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
