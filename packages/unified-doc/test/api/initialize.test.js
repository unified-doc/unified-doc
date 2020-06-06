import unifiedDoc from '~/unified-doc';

describe('initialize', () => {
  it('initializes the public API methods', () => {
    const doc = unifiedDoc({
      filename: 'doc.md',
    });
    expect(Object.getOwnPropertyNames(doc)).toEqual([
      'compile',
      'file',
      'parse',
      'search',
      'string',
      'text',
    ]);
  });
});
