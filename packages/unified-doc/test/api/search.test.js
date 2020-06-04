import { markdownContent } from '../fixtures/content';
import unifiedDoc from '../..';

describe('search', () => {
  it('test', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    doc.search('some query');
  });
});
