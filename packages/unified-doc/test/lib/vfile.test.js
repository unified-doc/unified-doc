import vfile from 'vfile';

import { inferMimeType, toFile } from '../../lib/vfile';
import { markdownContent } from '../fixtures/content';

describe('vfile', () => {
  // only test default and some mime types since other behaviors are implemented/tested in "mime" package.
  describe(inferMimeType.name, () => {
    it('infers default mimetype for invalid types', () => {
      expect(inferMimeType('no-extension')).toEqual('text/plain');
      expect(inferMimeType('file-with.bad-extension')).toEqual('text/plain');
      expect(inferMimeType('file.text')).toEqual('text/plain');
      expect(inferMimeType('file.htm')).toEqual('text/html');
      expect(inferMimeType('file.html')).toEqual('text/html');
      expect(inferMimeType('file.md')).toEqual('text/markdown');
      expect(inferMimeType('file.json')).toEqual('application/json');
      expect(inferMimeType('file.pdf')).toEqual('application/pdf');
      expect(inferMimeType('file.docx')).toEqual(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
    });
  });

  describe(toFile.name, () => {
    it('creates file for a given vfile and infers mimetype', () => {
      const file1 = toFile(
        vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      );
      const file2 = toFile(
        vfile({
          basename: 'no-extension',
          contents: markdownContent,
        }),
      );
      const file3 = toFile(
        vfile({
          basename: 'file-with.bad-extension',
          contents: markdownContent,
        }),
      );
      expect(file1.content).toEqual(markdownContent);
      expect(file1.extension).toEqual('.md');
      expect(file1.name).toEqual('doc.md');
      expect(file1.stem).toEqual('doc');
      expect(file1.type).toEqual('text/markdown');
      expect(file2.content).toEqual(markdownContent);
      expect(file2.extension).toEqual('');
      expect(file2.name).toEqual('no-extension');
      expect(file2.stem).toEqual('no-extension');
      expect(file2.type).toEqual('text/plain');
      expect(file3.content).toEqual(markdownContent);
      expect(file3.extension).toEqual('.bad-extension');
      expect(file3.name).toEqual('file-with.bad-extension');
      expect(file3.stem).toEqual('file-with');
      expect(file3.type).toEqual('text/plain');
    });
  });
});
