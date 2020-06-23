import vfile from 'vfile';

import { hast, markdownContent } from './fixtures';
import { inferMimeType, getFileData } from '../lib/file';

describe('file', () => {
  // only test the default mime type since other behaviors are implemented/tested in "mime" package.
  describe('inferMimeType', () => {
    it('infers default mimetype for invalid types', () => {
      expect(inferMimeType('no-extension')).toEqual('text/plain');
      expect(inferMimeType('file-with.bad-extension')).toEqual('text/plain');
    });
  });

  describe('getFileData', () => {
    it('creates file data for a given vfile and infers mimetype', () => {
      const fileData1 = getFileData({
        file: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(fileData1.content).toEqual(markdownContent);
      expect(fileData1.extension).toEqual('.md');
      expect(fileData1.name).toEqual('doc.md');
      expect(fileData1.stem).toEqual('doc');
      expect(fileData1.type).toEqual('text/markdown');

      const fileData2 = getFileData({
        file: vfile({
          basename: 'no-extension',
          contents: markdownContent,
        }),
      });
      expect(fileData2.content).toEqual(markdownContent);
      expect(fileData2.extension).toEqual('');
      expect(fileData2.name).toEqual('no-extension');
      expect(fileData2.stem).toEqual('no-extension');
      expect(fileData2.type).toEqual('text/plain');

      const fileData3 = getFileData({
        file: vfile({
          basename: 'file-with.bad-extension',
          contents: markdownContent,
        }),
      });
      expect(fileData3.content).toEqual(markdownContent);
      expect(fileData3.extension).toEqual('.bad-extension');
      expect(fileData3.name).toEqual('file-with.bad-extension');
      expect(fileData3.stem).toEqual('file-with');
      expect(fileData3.type).toEqual('text/plain');
    });

    it('returns a text file data with only text content when ".txt" extension is provided', () => {
      const fileData = getFileData({
        extension: '.txt',
        file: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
        hast,
      });
      expect(fileData.content).not.toEqual('some markdown content');
      expect(fileData.content).toEqual('\nsome markdown content\n');
      expect(fileData.extension).toEqual('.txt');
      expect(fileData.name).toEqual('doc.txt');
      expect(fileData.stem).toEqual('doc');
      expect(fileData.type).toEqual('text/plain');
    });

    it('returns a html file data when ".html" extension is provided', () => {
      const fileData = getFileData({
        extension: '.html',
        file: vfile({
          basename: 'doc.html',
          contents: markdownContent,
        }),
        hast,
      });
      expect(fileData.content).not.toEqual(markdownContent);
      expect(fileData.content).toEqual(
        '<blockquote>\n<p><strong>some</strong> markdown content</p>\n</blockquote>',
      );
      expect(fileData.extension).toEqual('.html');
      expect(fileData.name).toEqual('doc.html');
      expect(fileData.stem).toEqual('doc');
      expect(fileData.type).toEqual('text/html');
    });

    it('returns unified file data when ".uni" extension is provided', () => {
      const fileData = getFileData({
        extension: '.uni',
        file: vfile({
          basename: 'doc.uni',
          contents: markdownContent,
        }),
        hast,
      });
      const parsedText = JSON.parse(fileData.content);
      expect(fileData.content).toContain('blockquote');
      expect(fileData.content).toContain('strong');
      expect(fileData.content).not.toContain('some markdown');
      expect(fileData.content).toContain('markdown content');
      expect(parsedText).toHaveProperty('hast');
      expect(parsedText).toHaveProperty('hast.type');
      expect(parsedText).toHaveProperty('hast.children');
      expect(parsedText).toHaveProperty('hast.position.start');
      expect(parsedText).toHaveProperty('hast.position.end');
      expect(parsedText).toHaveProperty('hast.type', 'root');
      expect(fileData.extension).toEqual('.uni');
      expect(fileData.name).toEqual('doc.uni');
      expect(fileData.stem).toEqual('doc');
      expect(fileData.type).toEqual('text/uni');
    });
  });
});
