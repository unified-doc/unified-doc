import unifiedDoc from '../../../packages/unified-doc';

// only test the for a valid hast tree since hast is implemented/tested in "unified"
describe('parse', () => {
  it('parses content into a hast tree', async () => {
    const doc = await unifiedDoc({
      content: '<blockquote><strong>some</strong>content</blockquote>',
      filename: 'doc.html',
    });
    const hast = doc.parse();
    expect(hast).to.have.property('type');
    expect(hast).to.have.property('children');
    expect(hast).to.have.property('position');
  });
});
