import { markdownContent } from '../fixtures';
import api from '../../lib/api';

describe('file', () => {
  it('returns the source file if no extension is provided', () => {
    const doc = api({
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

  it('returns a valid text file with only textContent when ".txt" extension is provided', () => {
    const doc = api({
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

  it('returns a valid html file when ".html" extension is provided', () => {
    const doc = api({
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
    const doc = api({
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file('.uni');
    const parsedContent = JSON.parse(file.content);
    expect(file.content).toContain('blockquote');
    expect(file.content).toContain('strong');
    expect(file.content).not.toContain('some markdown');
    expect(file.content).toContain('markdown content');
    expect(parsedContent).toHaveProperty('hast');
    expect(parsedContent).toHaveProperty('hast.type');
    expect(parsedContent).toHaveProperty('hast.children');
    expect(parsedContent).toHaveProperty('hast.position.start');
    expect(parsedContent).toHaveProperty('hast.position.end');
    expect(file.extension).toEqual('.uni');
    expect(file.name).toEqual('doc.uni');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/uni');
  });

  it('returns the annotated ".html" file', () => {
    const annotations = [
      { id: 'a', start: 0, end: 4 },
      { id: 'b', start: 2, end: 8 },
      { id: 'c', start: 8, end: 10 },
    ];
    const doc = api({
      annotations,
      content: markdownContent,
      filename: 'doc.md',
    });
    const htmlFile = doc.file('.html');
    const { content } = htmlFile;
    expect(content).toContain('<mark');
    expect(content).toContain('</mark>');
    expect(content).toContain('data-annotation-id="a"');
    expect(content).toContain('data-annotation-id="b"');
    expect(content).toContain('data-annotation-id="c"');
  });

  it('returns the annotated ".uni" file', () => {
    const annotations = [
      { id: 'a', start: 0, end: 4 },
      { id: 'b', start: 2, end: 8 },
      { id: 'c', start: 8, end: 10 },
    ];
    const doc = api({
      annotations,
      content: markdownContent,
      filename: 'doc.md',
    });
    const uniFile = doc.file('.uni');
    const { content } = uniFile;
    expect(content).toContain('mark');
    expect(content).toContain('dataAnnotationId');
  });
});
