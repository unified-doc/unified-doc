import unifiedDoc from '../../../packages/unified-doc';

describe('text', () => {
  it('sets the text content correctly when input content is provided', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    expect(doc.text()).to.equal('> **some** markdown content');
  });

  it('sets the text content correctly when input file is provided', async () => {
    const doc = await unifiedDoc({
      file: new File(['> **some** markdown content'], 'doc.md', {
        type: 'text/markdown',
      }),
    });
    expect(doc.text()).to.equal('> **some** markdown content');
  });
});
