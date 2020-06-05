import unifiedDoc from '~/unified-doc';

import { markdownContent } from '../fixtures';

describe('search', () => {
  it('TODO: will be implemented', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    doc.search();
  });
});
