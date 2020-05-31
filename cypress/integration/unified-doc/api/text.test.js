import unifiedDoc from '../../../../packages/unified-doc';

import { markdownContent as content } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('sets the text content correctly when input content is provided', async () => {
    const doc = await unifiedDoc({
      content,
      filename: 'doc.md',
    });
    expect(doc.text()).to.equal(content);
  });

  it('sets the text content correctly when input file is provided', async () => {
    const doc = await unifiedDoc({
      file: new File([content], 'doc.md', {
        type: 'text/markdown',
      }),
    });
    expect(doc.text()).to.equal(content);
  });
});
