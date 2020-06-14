import toc from 'rehype-toc';

import { markdownContent } from '../fixtures';
import unifiedDoc from '../../../unified-doc';

describe('string', () => {
  it('gets the string content correctly when content is provided as a string', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.string()).toEqual(markdownContent);
  });

  it('gets the string content correctly when content is provided as a buffer', () => {
    const doc = unifiedDoc({
      content: Buffer.from(markdownContent),
      filename: 'doc.md',
    });
    expect(doc.string()).toEqual(markdownContent);
  });

  it('ignores effects of plugins', () => {
    const doc1 = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc1.string()).toEqual(markdownContent);

    const doc2 = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
      plugins: [toc],
    });
    expect(doc2.string()).toEqual(markdownContent);
  });
});
