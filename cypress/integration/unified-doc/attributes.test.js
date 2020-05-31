import unifiedDoc from '../../../packages/unified-doc';
import { markdownContent as content } from '../../fixtures/content';

describe('attributes', () => {
  it('sets the file when input content is provided', async () => {
    const doc = await unifiedDoc({
      content,
      filename: 'doc.md',
    });
    expect(doc.extname).to.equal('.md');
    expect(doc.filename).to.equal('doc.md');
    expect(doc.stem).to.equal('doc');
  });

  it('sets the file when input file is provided', async () => {
    const doc = await unifiedDoc({
      file: new File([content], 'doc.md', {
        type: 'text/markdown',
      }),
    });
    expect(doc.extname).to.equal('.md');
    expect(doc.filename).to.equal('doc.md');
    expect(doc.stem).to.equal('doc');
  });
});
