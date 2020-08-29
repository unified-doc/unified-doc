import toc from 'rehype-toc';

import api from '../../lib/api';
import { htmlContent, markdownContent } from '../fixtures';

describe('api.textContent', () => {
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

  it('returns the textContent from unsupported content type', () => {
    const doc1 = api({
      content: markdownContent,
      filename: 'doc.js',
    });
    expect(doc1.textContent()).toEqual(markdownContent);

    const doc2 = api({
      content: markdownContent,
      filename: 'doc.unsupported-content',
    });
    expect(doc2.textContent()).toEqual(markdownContent);

    // no extension
    const doc3 = api({
      content: markdownContent,
      filename: 'doc',
    });
    expect(doc3.textContent()).toEqual(markdownContent);
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
    expect(doc2.textContent()).toEqual(
      'Heading 1 with bold textHeading 1 with bold text',
    );
  });
});
