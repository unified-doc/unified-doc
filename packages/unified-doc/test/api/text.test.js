import { markdownContent } from '../fixtures/content';
import unifiedDoc from '../..';

describe('text', () => {
  it('sets the text content correctly when content is provided as a string', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.text()).toEqual(markdownContent);
  });
});
