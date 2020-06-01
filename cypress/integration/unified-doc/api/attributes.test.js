import unifiedDoc from '../../../../packages/unified-doc';

import { markdownContent } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('sets the file when content is provided as a string', async () => {
    const doc = await unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(doc.extname).to.equal('.md');
    expect(doc.filename).to.equal('doc.md');
    expect(doc.stem).to.equal('doc');
  });

  it('sets the file when content is provided as a file', async () => {
    const doc = await unifiedDoc({
      content: new File([markdownContent], 'doc.md', {
        type: 'text/markdown',
      }),
      filename: 'doc.md',
    });
    expect(doc.extname).to.equal('.md');
    expect(doc.filename).to.equal('doc.md');
    expect(doc.stem).to.equal('doc');
  });
});
