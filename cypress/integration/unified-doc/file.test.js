import unifiedDoc from '../../../packages/unified-doc';

describe('file', () => {
  it('sets the file when input content is provided', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    expect(doc.file).to.be.an.instanceof(File);
    expect(doc.file.name).to.equal('doc.md');
    expect(doc.file.type).to.equal('text/markdown');
    expect(await doc.file.text()).to.equal('> **some** markdown content');
  });

  it('sets the file when input file is provided', async () => {
    const doc = await unifiedDoc({
      file: new File(['> **some** markdown content'], 'doc.md', {
        type: 'text/markdown',
      }),
    });
    expect(doc.file).to.be.an.instanceof(File);
    expect(doc.file.name).to.equal('doc.md');
    expect(doc.file.type).to.equal('text/markdown');
    expect(await doc.file.text()).to.equal('> **some** markdown content');
  });
});
