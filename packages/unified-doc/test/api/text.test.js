import unifiedDoc from '../..';

import { markdownContent } from '../fixtures/content';

describe('text', () => {
  it('sets the text content correctly when content is provided as a string', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.text()).toEqual(markdownContent);
  });

  it('sets the text content correctly when content is provided as a buffer', () => {
    const doc = unifiedDoc({
      content: Buffer.from(markdownContent),
      filename: 'doc.md',
    });
    expect(doc.text()).toEqual(markdownContent);
  });
});
