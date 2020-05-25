import mime from 'mime-types';

import { mimeTypes } from './enums';

export function create(content, filename) {
  const type = mime.lookup(filename) || mimeTypes.DEFAULT;
  return new File([content], filename, { type });
}

export function getContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      resolve(reader.result);
    });

    reader.addEventListener('error', reject);
    reader.readAsText(file);
  });
}

export function saveFile(type) {
  // Original, html, text, hast
}
