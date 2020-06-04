import unifiedDoc from '../../../../packages/unified-doc';

import { markdownContent } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('test', async () => {
    const doc = await unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    doc.search('some query');
  });
});
