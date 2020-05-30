import unifiedDoc from '../../../packages/unified-doc';

describe('export', () => {
  it('exports the current file as is', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    const file = doc.export();
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.md');
    expect(file.type).to.equal('text/markdown');
    expect(await file.text()).to.equal('> **some** markdown content');
  });

  it('exports the current file as .html', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    const file = doc.export('.html');
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.html');
    expect(file.type).to.equal('text/html');
    expect(await file.text()).to.equal(
      '<blockquote>\n<p><strong>some</strong> markdown content</p>\n</blockquote>',
    );
  });

  it('exports the current file as .uni', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    const file = doc.export('.uni');
    const text = await file.text();
    const content = JSON.parse(text);
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.uni');
    expect(file.type).to.equal('text/uni');
    expect(text).to.have.string('blockquote');
    expect(text).to.have.string('strong');
    expect(text).to.not.have.string('some markdown');
    expect(text).to.have.string('markdown content');
    expect(content).to.have.property('hast');
    expect(content).to.have.nested.property('hast.type');
    expect(content).to.have.nested.property('hast.children');
    expect(content).to.have.nested.property('hast.position.start');
    expect(content).to.have.nested.property('hast.position.end');
    expect(content.hast.type).to.equal('root');
  });
});
