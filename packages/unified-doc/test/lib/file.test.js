import vfile from 'vfile';

import { inferMimeType, vFile2File } from '~/unified-doc/lib/file';

import { markdownContent } from '../fixtures';

describe('file', () => {
  // only test the default mime type since other behaviors are implemented/tested in "mime" package.
  describe(inferMimeType.name, () => {
    it('infers default mimetype for invalid types', () => {
      expect(inferMimeType('no-extension')).toEqual('text/plain');
      expect(inferMimeType('file-with.bad-extension')).toEqual('text/plain');
    });
  });

  describe(vFile2File.name, () => {
    it('creates file for a given vfile and infers mimetype', () => {
      const vfile1 = vFile2File(
        vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      );
      expect(vfile1.content).toEqual(markdownContent);
      expect(vfile1.extension).toEqual('.md');
      expect(vfile1.name).toEqual('doc.md');
      expect(vfile1.stem).toEqual('doc');
      expect(vfile1.type).toEqual('text/markdown');

      const vfile2 = vFile2File(
        vfile({
          basename: 'no-extension',
          contents: markdownContent,
        }),
      );
      expect(vfile2.content).toEqual(markdownContent);
      expect(vfile2.extension).toEqual('');
      expect(vfile2.name).toEqual('no-extension');
      expect(vfile2.stem).toEqual('no-extension');
      expect(vfile2.type).toEqual('text/plain');

      const vfile3 = vFile2File(
        vfile({
          basename: 'file-with.bad-extension',
          contents: markdownContent,
        }),
      );
      expect(vfile3.content).toEqual(markdownContent);
      expect(vfile3.extension).toEqual('.bad-extension');
      expect(vfile3.name).toEqual('file-with.bad-extension');
      expect(vfile3.stem).toEqual('file-with');
      expect(vfile3.type).toEqual('text/plain');
    });
  });
});
