import { markdownContent } from '../fixtures/content';
import unifiedDoc from '../..';

describe('annotate', () => {
  it('test', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    doc.annotate([{ id: 'a', start: 3, end: 10 }]);
  });
});
