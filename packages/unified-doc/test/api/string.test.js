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
});
