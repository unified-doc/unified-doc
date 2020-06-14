import toc from 'rehype-toc';

import { htmlContent, markdownContent } from '../fixtures';
import unifiedDoc from '../../../unified-doc';

describe('text', () => {
  it('gets the text content of the parsed tree given the provided .txt content', () => {
    const doc1 = unifiedDoc({
      content: markdownContent,
      filename: 'doc.txt',
    });
    expect(doc1.text()).toEqual(markdownContent);

    const doc2 = unifiedDoc({
      content: htmlContent,
      filename: 'doc.txt',
    });
    expect(doc2.text()).toEqual(htmlContent);
  });

  it('ggets the text content of the parsed tree given the  .md content', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.text()).toEqual('\nsome markdown content\n');
  });

  it('gets the text content of the parsed tree given the  .html content', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.html',
    });
    expect(doc.text()).toEqual('some\ncontent');
  });

  it('ignores effects of plugins', () => {
    const doc1 = unifiedDoc({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
    });
    expect(doc1.text()).toEqual('Heading 1 with bold text');

    const doc2 = unifiedDoc({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
      plugins: [toc],
    });
    expect(JSON.stringify(doc2.parse()).match(/toc/gi).length).toBeGreaterThan(
      1,
    );
    expect(doc2.text()).toEqual('Heading 1 with bold text');
  });
});
