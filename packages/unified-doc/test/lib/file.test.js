import vfile from 'vfile';

import { hast, markdownContent } from '../fixtures';
import { inferMimeType, vFile2File } from '../../../unified-doc/lib/file';

describe('file', () => {
  // only test the default mime type since other behaviors are implemented/tested in "mime" package.
  describe('inferMimeType', () => {
    it('infers default mimetype for invalid types', () => {
      expect(inferMimeType('no-extension')).toEqual('text/plain');
      expect(inferMimeType('file-with.bad-extension')).toEqual('text/plain');
    });
  });

  describe('vFile2File', () => {
    it('creates file for a given vfile and infers mimetype', () => {
      const file1 = vFile2File({
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(file1.content).toEqual(markdownContent);
      expect(file1.extension).toEqual('.md');
      expect(file1.name).toEqual('doc.md');
      expect(file1.stem).toEqual('doc');
      expect(file1.type).toEqual('text/markdown');

      const file2 = vFile2File({
        vfile: vfile({
          basename: 'no-extension',
          contents: markdownContent,
        }),
      });
      expect(file2.content).toEqual(markdownContent);
      expect(file2.extension).toEqual('');
      expect(file2.name).toEqual('no-extension');
      expect(file2.stem).toEqual('no-extension');
      expect(file2.type).toEqual('text/plain');

      const file3 = vFile2File({
        vfile: vfile({
          basename: 'file-with.bad-extension',
          contents: markdownContent,
        }),
      });
      expect(file3.content).toEqual(markdownContent);
      expect(file3.extension).toEqual('.bad-extension');
      expect(file3.name).toEqual('file-with.bad-extension');
      expect(file3.stem).toEqual('file-with');
      expect(file3.type).toEqual('text/plain');
    });

    it('returns a valid text file with only text content when ".txt" extension is provided', () => {
      const file = vFile2File({
        extension: '.txt',
        hast,
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(file.content).not.toEqual('some markdown content');
      expect(file.content).toEqual('\nsome markdown content\n');
      expect(file.extension).toEqual('.txt');
      expect(file.name).toEqual('doc.txt');
      expect(file.stem).toEqual('doc');
      expect(file.type).toEqual('text/plain');
    });

    it('returns a valid html file when ".html" extension is provided', () => {
      const file = vFile2File({
        extension: '.html',
        hast,
        vfile: vfile({
          basename: 'doc.html',
          contents: markdownContent,
        }),
      });
      expect(file.content).not.toEqual(markdownContent);
      expect(file.content).toEqual(
        '<blockquote>\n<p><strong>some</strong> markdown content</p>\n</blockquote>',
      );
      expect(file.extension).toEqual('.html');
      expect(file.name).toEqual('doc.html');
      expect(file.stem).toEqual('doc');
      expect(file.type).toEqual('text/html');
    });

    it('returns the unified file when ".uni" extension is provided', () => {
      const annotations = [
        { id: 'a', start: 0, end: 4 },
        { id: 'b', start: 3, end: 8 },
      ];
      const file = vFile2File({
        annotations,
        extension: '.uni',
        hast,
        vfile: vfile({
          basename: 'doc.uni',
          contents: markdownContent,
        }),
      });
      const parsedText = JSON.parse(file.content);
      expect(file.content).toContain('blockquote');
      expect(file.content).toContain('strong');
      expect(file.content).not.toContain('some markdown');
      expect(file.content).toContain('markdown content');
      expect(parsedText).toHaveProperty('annotations', annotations);
      expect(parsedText).toHaveProperty('basename', 'doc.uni');
      expect(parsedText).toHaveProperty('hast');
      expect(parsedText).toHaveProperty('hast.type');
      expect(parsedText).toHaveProperty('hast.children');
      expect(parsedText).toHaveProperty('hast.position.start');
      expect(parsedText).toHaveProperty('hast.position.end');
      expect(parsedText).toHaveProperty('hast.type', 'root');
      expect(file.extension).toEqual('.uni');
      expect(file.name).toEqual('doc.uni');
      expect(file.stem).toEqual('doc');
      expect(file.type).toEqual('text/uni');
    });
  });
});
