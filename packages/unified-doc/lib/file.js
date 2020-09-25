import raw from 'hast-util-raw';
import toHtml from 'hast-util-to-html';
import toMdast from 'hast-util-to-mdast';
import toXast from 'hast-util-to-xast';
import gfm from 'mdast-util-gfm';
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
      content = toMarkdown(toMdast(hast), { extensions: [gfm.toMarkdown()] });
      break;
    }
    case extensionTypes.TEXT: {
      content = toText(hast);
      break;
    }
    case extensionTypes.XML: {
      // always ensure hast has a html parent node.  clean/dedupe with hast-util-raw
      const clean = raw({ type: 'element', tagName: 'html', children: [hast] });
      content = toXml(toXast(clean));
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
