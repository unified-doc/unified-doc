import { htmlContent, markdownContent } from '../fixtures';
import unifiedDoc from '../../../unified-doc';

describe('text', () => {
  it('gets the text content correctly for provided .txt content', () => {
    const doc1 = unifiedDoc({
      content: markdownContent,
      filename: 'doc.txt',
    });
    expect(doc1.text()).toEqual(markdownContent);

    const doc2 = unifiedDoc({
      content: htmlContent,
      filename: 'doc.txt',
    });
    expect(doc2.text()).toEqual(htmlContent);
  });

  it('gets the text content correctly for provided .md content', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.text()).toEqual('\nsome markdown content\n');
  });

  it('gets the text content correctly for provided .html content', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.html',
    });
    expect(doc.text()).toEqual('some\ncontent');
  });
});
