import toc from 'rehype-toc';

import { markdownContent } from '../fixtures';
import unifiedDoc from '../../lib/api';

describe('string', () => {
  it('returns the string content', () => {
    const doc = unifiedDoc({
      content: markdownContent,
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
    expect(JSON.stringify(doc2.parse()).match(/toc/gi).length).toBeGreaterThan(
      1,
    );
    expect(doc2.string()).toEqual(markdownContent);
  });
});
