import mime from 'mime-types';
import vfile from 'vfile';

import { mimeTypes } from './enums';

export function inferMimeType(vf) {
  return mime.lookup(vf.extname) || mimeTypes.DEFAULT;
}

export function toFile(vf) {
  return new File([vf.contents], vf.basename, { type: inferMimeType(vf) });
}

export async function toVfile({ content, file, filename }) {
  const basename = file ? file.name : filename;
  const contents = file ? Buffer.from(await file.arrayBuffer()) : content;
  return vfile({ basename, contents });
}
