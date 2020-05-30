import unifiedDoc from '../../../packages/unified-doc';

describe('init', () => {
  it('initializes the correct public API attributes and methods', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    expect(Object.getOwnPropertyNames(doc)).to.deep.equal([
      // attributes
      'extname',
      'filename',
      'stem',
      // methods
      'annotate',
      'compile',
      'export',
      'parse',
      'search',
      'text',
    ]);
  });
});
