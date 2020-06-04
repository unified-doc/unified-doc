import { markdownContent } from '../fixtures/content';
import unifiedDoc from '../..';

describe('file', () => {
  it('returns file as source extension', () => {
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

  it('returns file as .txt', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file('.txt');
    expect(file.content).toEqual(markdownContent);
    expect(file.extension).toEqual('.txt');
    expect(file.name).toEqual('doc.txt');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/plain');
  });

  it('returns file as .html', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const file = doc.file('.html');
    expect(file.content).toEqual(
      '<blockquote>\n<p><strong>some</strong> markdown content</p>\n</blockquote>',
    );
    expect(file.extension).toEqual('.html');
    expect(file.name).toEqual('doc.html');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/html');
  });

  it('returns file as .uni', () => {
    const doc = unifiedDoc({
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
    expect(parsedText).toHaveProperty('hast.type');
    expect(parsedText).toHaveProperty('hast.children');
    expect(parsedText).toHaveProperty('hast.position.start');
    expect(parsedText).toHaveProperty('hast.position.end');
    expect(parsedText.hast.type).toEqual('root');
    expect(file.extension).toEqual('.uni');
    expect(file.name).toEqual('doc.uni');
    expect(file.stem).toEqual('doc');
    expect(file.type).toEqual('text/uni');
  });
});
