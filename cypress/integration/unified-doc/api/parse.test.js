import unifiedDoc from '../../../../packages/unified-doc';

import { markdownContent } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

// only test the for a valid hast tree since hast is implemented/tested in "unified"
describe(getNamespace(__filename), () => {
  it('parses text file extension into a hast tree', async () => {
    const doc = await unifiedDoc({
      content: '<blockquote><strong>some</strong>content</blockquote>',
      filename: 'doc.text',
    });
    const hast = doc.parse();
    expect(hast.children.length).to.equal(1);
    expect(hast.children[0].type).to.equal('text');
    expect(hast.children[0].value).to.equal(
      '<blockquote><strong>some</strong>content</blockquote>',
    );
  });

  it('parses markdown file extension into a hast tree', async () => {
    const doc = await unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const hast = doc.parse();
    expect(hast.children[0].type).to.equal('element');
    expect(hast.children[0].tagName).to.equal('blockquote');
    expect(hast.children[0].children[0].type).to.equal('text');
    expect(hast.children[0].children[0].value).to.equal('\n');
    expect(hast.children[0].children[1].type).to.equal('element');
    expect(hast.children[0].children[1].tagName).to.equal('p');
  });

  it('parses html file extension into a hast tree', async () => {
    const doc = await unifiedDoc({
      content: '<blockquote><strong>some</strong>content</blockquote>',
      filename: 'doc.html',
    });
    const hast = doc.parse();
    expect(hast.children[0].type).to.equal('element');
    expect(hast.children[0].tagName).to.equal('blockquote');
    expect(hast.children[0].children[0].type).to.equal('element');
    expect(hast.children[0].children[0].tagName).to.equal('strong');
  });

  it('parses any unsupported file extension into a hast tree', async () => {
    const doc = await unifiedDoc({
      content: '<blockquote><strong>some</strong>content</blockquote>',
      filename: 'doc.unsupported-extension',
    });
    const hast = doc.parse();
    expect(hast.children.length).to.equal(1);
    expect(hast.children[0].type).to.equal('text');
    expect(hast.children[0].value).to.equal(
      '<blockquote><strong>some</strong>content</blockquote>',
    );
  });
});
