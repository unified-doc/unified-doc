import unifiedDoc from '~/unified-doc';

import { markdownContent } from '../fixtures/content';

// only test the for a valid hast tree since hast is implemented/tested in "unified"
describe('parse', () => {
  it('parses text file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: '<blockquote><strong>some</strong>content</blockquote>',
      filename: 'doc.text',
    });
    const hast = doc.parse();
    expect(hast.children.length).toEqual(1);
    expect(hast.children[0].type).toEqual('text');
    expect(hast.children[0].value).toEqual(
      '<blockquote><strong>some</strong>content</blockquote>',
    );
  });

  it('parses markdown file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const hast = doc.parse();
    expect(hast.children[0].type).toEqual('element');
    expect(hast.children[0].tagName).toEqual('blockquote');
    expect(hast.children[0].children[0].type).toEqual('text');
    expect(hast.children[0].children[0].value).toEqual('\n');
    expect(hast.children[0].children[1].type).toEqual('element');
    expect(hast.children[0].children[1].tagName).toEqual('p');
  });

  it('parses html file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: '<blockquote><strong>some</strong>content</blockquote>',
      filename: 'doc.html',
    });
    const hast = doc.parse();
    expect(hast.children[0].type).toEqual('element');
    expect(hast.children[0].tagName).toEqual('blockquote');
    expect(hast.children[0].children[0].type).toEqual('element');
    expect(hast.children[0].children[0].tagName).toEqual('strong');
  });

  it('parses any unsupported file extension into a hast tree', () => {
    const doc = unifiedDoc({
      content: '<blockquote><strong>some</strong>content</blockquote>',
      filename: 'doc.unsupported-extension',
    });
    const hast = doc.parse();
    expect(hast.children.length).toEqual(1);
    expect(hast.children[0].type).toEqual('text');
    expect(hast.children[0].value).toEqual(
      '<blockquote><strong>some</strong>content</blockquote>',
    );
  });
});
