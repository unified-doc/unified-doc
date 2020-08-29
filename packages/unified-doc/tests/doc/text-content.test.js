import Doc from '../../lib/doc';
import { htmlContent, markdownContent } from '../fixtures';

describe('doc.textContent', () => {
  it('returns the textContent from source markdown content', () => {
    const doc = Doc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.textContent()).toEqual('\nsome markdown content\n');
  });

  it('returns the textContent from source html content', () => {
    const doc = Doc({
      content: htmlContent,
      filename: 'doc.html',
    });
    expect(doc.textContent()).toEqual('some\ncontent');
  });

  it('returns the textContent from unsupported content type', () => {
    const doc1 = Doc({
      content: markdownContent,
      filename: 'doc.js',
    });
    expect(doc1.textContent()).toEqual(markdownContent);

    const doc2 = Doc({
      content: markdownContent,
      filename: 'doc.unsupported-content',
    });
    expect(doc2.textContent()).toEqual(markdownContent);

    // no extension
    const doc3 = Doc({
      content: markdownContent,
      filename: 'doc',
    });
    expect(doc3.textContent()).toEqual(markdownContent);
  });
});
