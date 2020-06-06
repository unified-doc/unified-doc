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
    expect(hast.children[0].type).toEqual('text');
    expect(hast.children[0].value).toEqual(htmlContent);
  });

  it('parses markdown file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const hast = doc.parse();
    const blockquoteNodePath = ['children', 0];
    const textNodePath = [...blockquoteNodePath, 'children', 0];
    const paragraphNodePath = [...blockquoteNodePath, 'children', 1];
    expect(hast).toHaveProperty(
      [...blockquoteNodePath, 'tagName'],
      'blockquote',
    );
    expect(hast).toHaveProperty([...textNodePath, 'type'], 'text');
    expect(hast).toHaveProperty([...textNodePath, 'value'], '\n');
    expect(hast).toHaveProperty([...paragraphNodePath, 'tagName'], 'p');
  });

  it('parses html file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.html',
    });
    const hast = doc.parse();
    const blockquoteNodePath = ['children', 0];
    const strongNodePath = [...blockquoteNodePath, 'children', 0];
    expect(hast).toHaveProperty(
      [...blockquoteNodePath, 'tagName'],
      'blockquote',
    );
    expect(hast).toHaveProperty([...strongNodePath, 'tagName'], 'strong');
  });

  it('parses any unsupported file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.unsupported-extension',
    });
    const hast = doc.parse();
    expect(hast.children.length).toEqual(1);
    expect(hast.children[0].type).toEqual('text');
    expect(hast.children[0].value).toEqual(htmlContent);
  });

  it('applies textOffsets to track text offset data in text nodes when annotations are provided', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.html',
    });
    const hast = doc.parse();
    const blockquoteNodePath = ['children', 0];
    const strongNodePath = [...blockquoteNodePath, 'children', 0];
    const textNodePath = [...blockquoteNodePath, 'children', 1];

    expect(hast).toHaveProperty(
      [...blockquoteNodePath, 'tagName'],
      'blockquote',
    );
    expect(hast).toHaveProperty([...strongNodePath, 'tagName'], 'strong');
    expect(hast).toHaveProperty(
      [...strongNodePath, 'children', 0, 'type'],
      'text',
    );
    expect(hast).toHaveProperty(
      [...strongNodePath, 'children', 0, 'value'],
      'some',
    );
    expect(hast).toHaveProperty([...strongNodePath, 'children', 0, 'data'], {
      textOffset: { start: 0, end: 4 },
    });
    expect(hast).toHaveProperty([...textNodePath, 'type'], 'text');
    expect(hast).toHaveProperty([...textNodePath, 'value'], '\ncontent');
    expect(hast).toHaveProperty([...textNodePath, 'data'], {
      textOffset: { start: 4, end: 12 },
    });
  });
});
