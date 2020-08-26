import toc from 'rehype-toc';

import api from '../../lib/api';
import { htmlContent, jsonContent, markdownContent } from '../fixtures';

describe('api.textContent', () => {
  it('returns the textContent from source text content', () => {
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

  it('returns the textContent from source markdown content', () => {
    const doc = api({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.textContent()).toEqual('\nsome markdown content\n');
  });

  it('returns the textContent from source html content', () => {
    const doc = api({
      content: htmlContent,
      filename: 'doc.html',
    });
    expect(doc.textContent()).toEqual('some\ncontent');
  });

  it('returns the textContent from source json content', () => {
    const doc = api({
      content: jsonContent,
      filename: 'doc.json',
    });
    expect(doc.textContent()).toEqual(jsonContent);
  });

  it('ignores the effects of postPlugins even if they affect the parsed hast tree', () => {
    const doc1 = api({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
    });
    expect(doc1.textContent()).toEqual('Heading 1 with bold text');

    const doc2 = api({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
      postPlugins: [toc],
    });
    expect(JSON.stringify(doc2.parse()).match(/toc/gi).length).toBeGreaterThan(
      1,
    );
    expect(doc2.textContent()).toEqual('Heading 1 with bold text');
  });

  it('includes the effects of prePlugins', () => {
    const doc1 = api({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
    });
    expect(doc1.textContent()).toEqual('Heading 1 with bold text');

    const doc2 = api({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
      prePlugins: [toc],
    });
    expect(JSON.stringify(doc2.parse()).match(/toc/gi).length).toBeGreaterThan(
      1,
    );
    expect(doc2.textContent()).toEqual('Heading 1 with bold textHeading 1 with bold text');
  });
});
