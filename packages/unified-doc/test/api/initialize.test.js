import api from '../../lib/api';

describe('initialize', () => {
  it('initializes the public API methods', () => {
    const doc = api({
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
