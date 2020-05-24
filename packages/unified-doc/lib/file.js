import mime from 'mime-types';

import { DEFAULT_MIME_TYPE } from './enums';

export function createFile(content, filename) {
  const type = mime.lookup(filename) || DEFAULT_MIME_TYPE;
  return new File([content], filename, { type });
}

export function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      resolve(reader.result);
    });

    reader.addEventListener('error', reject);
    reader.readAsText(file);
  });
}
