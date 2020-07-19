import toc from 'rehype-toc';

import { htmlContent, markdownContent } from '../fixtures';
import api from '../../lib/api';

describe('textContent', () => {
  it('gets the textContent of the parsed tree given the provided .txt content', () => {
    const doc1 = api({
      content: markdownContent,
      filename: 'doc.txt',
    });
    expect(doc1.textContent()).toEqual(markdownContent);

    const doc2 = api({
      content: htmlContent,
      filename: 'doc.txt',
    });
    expect(doc2.textContent()).toEqual(htmlContent);
  });

  it('gets the textContent of the parsed tree given the  .md content', () => {
    const doc = api({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.textContent()).toEqual('\nsome markdown content\n');
  });

  it('gets the textContent of the parsed tree given the  .html content', () => {
    const doc = api({
      content: htmlContent,
      filename: 'doc.html',
    });
    expect(doc.textContent()).toEqual('some\ncontent');
  });

  it('ignores effects of plugins', () => {
    const doc1 = api({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
    });
    expect(doc1.textContent()).toEqual('Heading 1 with bold text');

    const doc2 = api({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
      plugins: [toc],
    });
    expect(JSON.stringify(doc2.parse()).match(/toc/gi).length).toBeGreaterThan(
      1,
    );
    expect(doc2.textContent()).toEqual('Heading 1 with bold text');
  });
});
