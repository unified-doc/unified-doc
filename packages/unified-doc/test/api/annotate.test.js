import unifiedDoc from '../..';

import { markdownContent } from '../fixtures/content';

describe('annotate', () => {
  it('TODO: will be implemented', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    doc.annotate([{ id: 'a', start: 3, end: 10 }]);
  });
});
