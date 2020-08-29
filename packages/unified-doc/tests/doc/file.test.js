import Doc from '../../lib/doc';
import { markdownContent } from '../fixtures';

describe('doc.file', () => {
  it('returns the source file if no extension is provided', () => {
    const doc = Doc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file(null);
    expect(file.content).toEqual(markdownContent);
    expect(file.extension).toEqual('.md');
    expect(file.name).toEqual('doc.md');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/markdown');
  });

  it('returns a text file with only textContent when ".txt" extension is provided', () => {
    const doc = Doc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file('.txt');
    expect(file.content).not.toEqual(markdownContent);
    expect(file.content).toEqual('\nsome markdown content\n');
    expect(file.extension).toEqual('.txt');
    expect(file.name).toEqual('doc.txt');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/plain');
  });

  it('returns a html file when ".html" extension is provided', () => {
    const doc = Doc({
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

  it('returns a marked ".html" file when marks are provided', () => {
    const marks = [
      { id: 'a', start: 0, end: 4 },
      { id: 'b', start: 2, end: 8 },
      { id: 'c', start: 8, end: 10 },
    ];
    const doc1 = Doc({
      content: markdownContent,
      filename: 'doc.md',
      marks,
    });
    const content1 = doc1.file('.html').content;
    expect(content1).toContain('<mark');
    expect(content1).toContain('</mark>');
    expect(content1).not.toContain('data-mark-id');
    expect(content1).toContain('id="user-content-a"');
    expect(content1).toContain('id="user-content-b"');
    expect(content1).toContain('id="user-content-c"');

    const doc2 = Doc({
      content: markdownContent,
      filename: 'doc.md',
      marks,
      sanitizeSchema: null,
    });
    const content2 = doc2.file('.html').content;
    expect(content2).not.toContain('user-content');
    expect(content2).toContain('<mark');
    expect(content2).toContain('</mark>');
    expect(content2).toContain('data-mark-id="a"');
    expect(content2).toContain('data-mark-id="b"');
    expect(content2).toContain('data-mark-id="c"');
  });
});
