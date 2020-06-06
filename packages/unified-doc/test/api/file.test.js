import unifiedDoc from '~/unified-doc';

import { markdownContent } from '../fixtures';

describe('file', () => {
  it('returns the source file (string content) if no extension is provided', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file();
    expect(file.content).toEqual(markdownContent);
    expect(file.extension).toEqual('.md');
    expect(file.name).toEqual('doc.md');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/markdown');
  });

  it('returns the source file (Buffer content) if no extension is provided', () => {
    const doc = unifiedDoc({
      content: Buffer.from(markdownContent),
      filename: 'doc.md',
    });
    const file = doc.file();
    expect(file.content).toEqual(Buffer.from(markdownContent));
    expect(file.extension).toEqual('.md');
    expect(file.name).toEqual('doc.md');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/markdown');
  });

  it('returns a valid text file with only text content when ".txt" extension is provided', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file('.txt');
    expect(file.content).not.toEqual('some markdown content');
    expect(file.content).toEqual('\nsome markdown content\n');
    expect(file.extension).toEqual('.txt');
    expect(file.name).toEqual('doc.txt');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/plain');
  });

  it('returns a valid html file when ".html" extension is provided', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file('.html');
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
      { id: 'b', start: 2, end: 8 },
      { id: 'b', start: 8, end: 10 },
    ];
    const doc = unifiedDoc({
      annotations,
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file('.uni');
    const parsedText = JSON.parse(file.content);
    expect(file.content).toContain('blockquote');
    expect(file.content).toContain('strong');
    expect(file.content).not.toContain('some markdown');
    expect(file.content).toContain('markdown content');
    expect(parsedText).toHaveProperty('hast');
    expect(parsedText).toHaveProperty(['hast', 'type'], 'root');
    expect(parsedText).toHaveProperty(['hast', 'children']);
    expect(parsedText).toHaveProperty(['hast', 'position', 'start']);
    expect(parsedText).toHaveProperty(['hast', 'position', 'end']);
    expect(parsedText).toHaveProperty('annotations', annotations);
    expect(file.extension).toEqual('.uni');
    expect(file.name).toEqual('doc.uni');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/uni');
  });
});
