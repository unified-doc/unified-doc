import unifiedDoc from '../../../../packages/unified-doc';

import { markdownContent } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('sets the text content correctly when content is provided as a string', async () => {
    const doc = await unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.text()).to.equal(markdownContent);
  });

  it('sets the text content correctly when content is provided as a file', async () => {
    const doc = await unifiedDoc({
      content: new File([markdownContent], 'doc.md', {
        type: 'text/markdown',
      }),
      filename: 'doc.md',
    });
    expect(doc.text()).to.equal(markdownContent);
  });
});
