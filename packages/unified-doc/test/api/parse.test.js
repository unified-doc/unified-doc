import { htmlContent, markdownContent } from '../fixtures';
import api from '../../lib/api';

// only test the for a valid hast tree since hast is implemented/tested in "unified"
describe('parse', () => {
  it('parses text file extension into a hast tree', () => {
    const doc = api({
      content: htmlContent,
      filename: 'doc.text',
    });
    const hast = doc.parse();
    expect(hast).toHaveProperty('children.length', 1);
    expect(hast).toHaveProperty('children.0.type', 'text');
    expect(hast).toHaveProperty('children.0.value', htmlContent);
  });

  it('parses markdown file extension into a hast tree', () => {
    const doc = api({
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
    const doc = api({
      content: htmlContent,
      filename: 'doc.html',
    });
    const hast = doc.parse();
    expect(hast).toHaveProperty('children.0.tagName', 'blockquote');
    expect(hast).toHaveProperty('children.0.children.0.tagName', 'strong');
  });

  it('parses any unsupported file extension into a hast tree', () => {
    const doc = api({
      content: htmlContent,
      filename: 'doc.unsupported-extension',
    });
    const hast = doc.parse();
    expect(hast).toHaveProperty('children.length', 1);
    expect(hast).toHaveProperty('children.0.type', 'text');
    expect(hast).toHaveProperty('children.0.value', htmlContent);
  });

  it('applies custom parser (overriding default parser)', () => {
    const customParser = function () {
      this.Parser = (_doc) => {
        return {
          type: 'root',
          children: [],
        };
      };
    };
    const doc = api({
      content: htmlContent,
      filename: 'doc.html',
      parsers: {
        'text/html': customParser,
      },
    });
    expect(doc.parse()).toEqual({ type: 'root', children: [] });
  });
});
