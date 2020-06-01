import unifiedDoc from '../../../../packages/unified-doc';

import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('initializes the correct public API attributes and methods', async () => {
    const doc = await unifiedDoc({
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
      'file',
      'parse',
      'search',
      'text',
    ]);
  });
});
