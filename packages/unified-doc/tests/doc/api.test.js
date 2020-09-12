import Doc, { extensionTypes, mimeTypes } from '../../lib/doc';
import { markdownContent } from '../fixtures';

describe('api', () => {
  it('initializes the public attributes and API methods', () => {
    const doc = Doc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(Object.getOwnPropertyNames(doc)).toEqual([
      'compile',
      'file',
      'parse',
      'search',
      'textContent',
    ]);
  });

  it('should expose the following file extensionTypes', () => {
    expect(extensionTypes).toEqual({
      HTML: '.html',
      MARKDOWN: '.md',
      TEXT: '.txt',
    });
  });

  it('should expose the following supported mimeTypes', () => {
    expect(mimeTypes).toEqual({
      CSV: 'text/csv',
      HTML: 'text/html',
      MARKDOWN: 'text/markdown',
    });
  });
});
