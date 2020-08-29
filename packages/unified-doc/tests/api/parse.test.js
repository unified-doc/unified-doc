import api from '../../lib/api';
import { htmlContent, markdownContent } from '../fixtures';

// only test the for a valid hast tree since hast is implemented/tested in "unified"
describe('api.parse', () => {
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

  it('parses any file extension into a code block with extension specified as the code language if its underlying mime type cannot be associated with a parser', () => {
    const doc1 = api({
      content: 'var a = 3;',
      filename: 'doc.js',
      sanitizeSchema: { attributes: { '*': ['className'] } },
    });
    const hast1 = doc1.parse();
    expect(hast1).toHaveProperty('children.0.tagName', 'pre');
    expect(hast1).toHaveProperty('children.0.children.0.tagName', 'code');
    expect(hast1).toHaveProperty('children.0.children.0.properties', {
      className: 'language-js',
    });
    expect(hast1).toHaveProperty(
      'children.0.children.0.children.0.type',
      'text',
    );
    expect(hast1).toHaveProperty(
      'children.0.children.0.children.0.value',
      'var a = 3;',
    );

    const doc2 = api({
      content: htmlContent,
      filename: 'doc.unsupported-extension',
      sanitizeSchema: { attributes: { '*': ['className'] } },
    });
    const hast2 = doc2.parse();
    expect(hast2).toHaveProperty('children.0.tagName', 'pre');
    expect(hast2).toHaveProperty('children.0.children.0.tagName', 'code');
    expect(hast2).toHaveProperty('children.0.children.0.properties', {
      className: 'language-unsupported-extension',
    });
    expect(hast2).toHaveProperty(
      'children.0.children.0.children.0.type',
      'text',
    );
    expect(hast2).toHaveProperty(
      'children.0.children.0.children.0.value',
      htmlContent,
    );

    // no extension
    const doc3 = api({
      content: htmlContent,
      filename: 'doc',
      sanitizeSchema: { attributes: { '*': ['className'] } },
    });
    const hast3 = doc3.parse();
    expect(hast3).toHaveProperty('children.0.tagName', 'pre');
    expect(hast3).toHaveProperty('children.0.children.0.tagName', 'code');
    expect(hast3).toHaveProperty('children.0.children.0.properties', {});
    expect(hast3).toHaveProperty(
      'children.0.children.0.children.0.type',
      'text',
    );
    expect(hast3).toHaveProperty(
      'children.0.children.0.children.0.value',
      htmlContent,
    );
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
