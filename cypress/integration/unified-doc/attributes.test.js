import unifiedDoc from '../../../packages/unified-doc';

describe('attributes', () => {
  it('sets the file when input content is provided', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    expect(doc.extname).to.equal('.md');
    expect(doc.filename).to.equal('doc.md');
    expect(doc.stem).to.equal('doc');
  });

  it('sets the file when input file is provided', async () => {
    const doc = await unifiedDoc({
      file: new File(['> **some** markdown content'], 'doc.md', {
        type: 'text/markdown',
      }),
    });
    expect(doc.extname).to.equal('.md');
    expect(doc.filename).to.equal('doc.md');
    expect(doc.stem).to.equal('doc');
  });
});
