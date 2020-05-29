import unifiedDoc from '../../../packages/unified-doc';

describe('parse', () => {
  // Test only for existence of hast tree since hast is implemented/tested in in unified packages
  it('parses content', async () => {
    const doc = await unifiedDoc({
      content: '<blockquote><strong>some</strong>content</blockquote>',
      filename: 'doc.html',
    });
    const parsed = doc.parse();
    expect(parsed).to.have.property('type');
    expect(parsed).to.have.property('children');
    expect(parsed).to.have.property('position');
  });
});
