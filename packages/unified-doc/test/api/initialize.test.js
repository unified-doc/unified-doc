import unifiedDoc from '../..';

describe('initialize', () => {
  it('initializes the correct public API attributes and methods', () => {
    const doc = unifiedDoc({
      filename: 'doc.md',
    });
    expect(Object.getOwnPropertyNames(doc)).toEqual([
      // methods
      'annotate',
      'compile',
      'file',
      'parse',
      'search',
      'text',
    ]);
  });
});
