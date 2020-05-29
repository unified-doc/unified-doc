import unifiedDoc from '../../../packages/unified-doc';

describe('init', () => {
  it('exposes the correct public methods', async () => {
    const doc = await unifiedDoc();
    expect(Object.getOwnPropertyNames(doc)).to.deep.equal([
      'annotate',
      'content',
      'exportFile',
      'file',
      'parse',
      'search',
    ]);
  });
});
