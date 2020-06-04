import unifiedDoc from '../..';

import { markdownContent } from '../fixtures/content';

describe('search', () => {
  it('TODO: will be implemented', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    doc.search('some query');
  });
});
