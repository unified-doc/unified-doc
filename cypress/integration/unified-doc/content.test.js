import unifiedDoc from '../../../packages/unified-doc';

describe('content', () => {
  it('sets the content when input content is provided', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    expect(doc.content).to.equal('> **some** markdown content');
  });

  it('sets the content when input file is provided', async () => {
    const doc = await unifiedDoc({
      file: new File(['> **some** markdown content'], 'doc.md', {
        type: 'text/markdown',
      }),
    });
    expect(doc.content).to.equal('> **some** markdown content');
  });
});
