import unifiedDoc from '../..';

describe('initialize', () => {
  it('initializes the public API methods', () => {
    const doc = unifiedDoc({
      filename: 'doc.md',
    });
    expect(Object.getOwnPropertyNames(doc)).toEqual([
      'annotate',
      'compile',
      'file',
      'parse',
      'search',
      'text',
    ]);
  });
});
