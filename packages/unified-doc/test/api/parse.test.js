import { htmlContent, markdownContent } from '../fixtures';
import unifiedDoc from '../../../unified-doc';

// only test the for a valid hast tree since hast is implemented/tested in "unified"
describe('parse', () => {
  it('parses text file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.text',
    });
    const hast = doc.parse();
    expect(hast.children.length).toEqual(1);
    expect(hast).toHaveProperty('children.0.type', 'text');
    expect(hast).toHaveProperty('children.0.value', htmlContent);
  });

  it('parses markdown file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const hast = doc.parse();
    expect(hast).toHaveProperty('children.0.tagName', 'blockquote');
    expect(hast).toHaveProperty('children.0.children.0.type', 'text');
    expect(hast).toHaveProperty('children.0.children.0.value', '\n');
    expect(hast).toHaveProperty('children.0.children.1.tagName', 'p');
  });

  it('parses html file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.html',
    });
    const hast = doc.parse();
    expect(hast).toHaveProperty('children.0.tagName', 'blockquote');
    expect(hast).toHaveProperty('children.0.children.0.tagName', 'strong');
  });

  it('parses any unsupported file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.unsupported-extension',
    });
    const hast = doc.parse();
    expect(hast.children.length).toEqual(1);
    expect(hast).toHaveProperty('children.0.type', 'text');
    expect(hast).toHaveProperty('children.0.value', htmlContent);
  });

  it('applies textOffsets to track text offset data in text nodes when annotations are provided', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.html',
    });
    const hast = doc.parse();
    expect(hast).toHaveProperty('children.0.tagName', 'blockquote');
    expect(hast).toHaveProperty('children.0.children.0.tagName', 'strong');
    expect(hast).toHaveProperty(
      'children.0.children.0.children.0.type',
      'text',
    );
    expect(hast).toHaveProperty(
      'children.0.children.0.children.0.value',
      'some',
    );
    expect(hast).toHaveProperty('children.0.children.0.children.0.data', {
      textOffset: { start: 0, end: 4 },
    });
    expect(hast).toHaveProperty('children.0.children.1.type', 'text');
    expect(hast).toHaveProperty('children.0.children.1.value', '\ncontent');
    expect(hast).toHaveProperty('children.0.children.1.data', {
      textOffset: { start: 4, end: 12 },
    });
  });
});
